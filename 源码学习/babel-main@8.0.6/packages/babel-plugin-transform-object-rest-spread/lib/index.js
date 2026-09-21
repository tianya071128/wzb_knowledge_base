import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";
import { convertFunctionParams } from "@babel/plugin-transform-parameters";
import { isRequired } from "@babel/helper-compilation-targets";
import shouldStoreRHSInTemporaryVariable from "./shouldStoreRHSInTemporaryVariable.js";
import compatData from "./compat-data.js";
import { unshiftForXStatementBody } from "@babel/plugin-transform-destructuring";
export default declare((api, opts) => {
  api.assertVersion("8.0.6");
  if ("loose" in opts) {
    console.warn("@babel/plugin-transform-object-rest-spread: The 'loose' option has been deprecated, " + "use the `ignoreFunctionLength`, `objectRestNoSymbols`, `pureGetters`, and `setSpreadProperties` assumptions instead (https://babeljs.io/assumptions).");
  }
  const targets = api.targets();
  const supportsObjectAssign = !isRequired("Object.assign", targets, {
    compatData
  });
  const {
    useBuiltIns = supportsObjectAssign,
    loose = false
  } = opts;
  if (typeof loose !== "boolean") {
    throw new Error(".loose must be a boolean, or undefined");
  }
  const ignoreFunctionLength = api.assumption("ignoreFunctionLength") ?? loose;
  const objectRestNoSymbols = api.assumption("objectRestNoSymbols") ?? loose;
  const pureGetters = api.assumption("pureGetters") ?? loose;
  const setSpreadProperties = api.assumption("setSpreadProperties") ?? loose;
  function getExtendsHelper(file) {
    return useBuiltIns ? t.memberExpression(t.identifier("Object"), t.identifier("assign")) : file.addHelper("extends");
  }
  function* iterateObjectRestElement(path) {
    switch (path.type) {
      case "ArrayPattern":
        for (const elementPath of path.get("elements")) {
          if (elementPath.isRestElement()) {
            yield* iterateObjectRestElement(elementPath.get("argument"));
          } else {
            yield* iterateObjectRestElement(elementPath);
          }
        }
        break;
      case "ObjectPattern":
        for (const propertyPath of path.get("properties")) {
          if (propertyPath.isRestElement()) {
            yield propertyPath;
          } else {
            yield* iterateObjectRestElement(propertyPath.get("value"));
          }
        }
        break;
      case "AssignmentPattern":
        yield* iterateObjectRestElement(path.get("left"));
        break;
      default:
        break;
    }
  }
  function hasObjectRestElement(path) {
    const objectRestPatternIterator = iterateObjectRestElement(path);
    return !objectRestPatternIterator.next().done;
  }
  function visitObjectRestElements(path, visitor) {
    for (const restElementPath of iterateObjectRestElement(path)) {
      visitor(restElementPath);
    }
  }
  function hasSpread(node) {
    for (const prop of node.properties) {
      if (t.isSpreadElement(prop)) {
        return true;
      }
    }
    return false;
  }
  function extractNormalizedKeys(pattern) {
    const propsList = pattern.get("properties").map(p => p.node);
    const keys = [];
    let allPrimitives = true;
    let hasTemplateLiteral = false;
    for (const prop of propsList) {
      const key = prop.key;
      if (t.isIdentifier(key) && !prop.computed) {
        keys.push(t.stringLiteral(key.name));
      } else if (t.isTemplateLiteral(key)) {
        keys.push(t.cloneNode(key));
        hasTemplateLiteral = true;
      } else if (t.isLiteral(key)) {
        keys.push(t.stringLiteral(String(key.value)));
      } else {
        if (t.isAssignmentExpression(key) && t.isIdentifier(key.left)) {
          keys.push(t.cloneNode(key.left));
        } else {
          keys.push(t.cloneNode(key));
        }
        const keyToCheck = t.isAssignmentExpression(key) ? key.right : key;
        if (t.isMemberExpression(keyToCheck, {
          computed: false
        }) && t.isIdentifier(keyToCheck.object, {
          name: "Symbol"
        }) || t.isCallExpression(keyToCheck) && t.matchesPattern(keyToCheck.callee, "Symbol.for")) {} else {
          allPrimitives = false;
        }
      }
    }
    return {
      keys,
      allPrimitives,
      hasTemplateLiteral
    };
  }
  function replaceImpureComputedKeys(properties, scope) {
    const tempVariableDeclarations = [];
    for (const property of properties) {
      const keyExpression = property.get("key");
      if (keyExpression.isAssignmentExpression() && keyExpression.get("left").isIdentifier()) {
        const identName = keyExpression.node.left.name;
        if (scope.hasUid(identName)) {
          continue;
        }
      }
      if (property.node.computed && !keyExpression.isPure()) {
        const tempVariableName = scope.generateUidBasedOnNode(keyExpression.node);
        const tempVariableDeclaration = t.variableDeclarator(t.identifier(tempVariableName), keyExpression.node);
        tempVariableDeclarations.push(tempVariableDeclaration);
        keyExpression.replaceWith(t.identifier(tempVariableName));
      }
    }
    return tempVariableDeclarations;
  }
  function removeUnusedExcludedKeys(path) {
    const bindings = path.getOuterBindingIdentifierPaths();
    Object.keys(bindings).forEach(bindingName => {
      const bindingParentPath = bindings[bindingName].parentPath;
      if (path.scope.getBinding(bindingName).references > 0 || !bindingParentPath.isObjectProperty()) {
        return;
      }
      bindingParentPath.remove();
    });
  }
  function collectComputedKeysInSourceOrder(destructuringPattern) {
    const computedProperties = [];
    function visitPattern(pattern) {
      if (pattern.isObjectPattern()) {
        const properties = pattern.get("properties");
        for (const property of properties) {
          if (property.isRestElement()) continue;
          if (property.node.computed) {
            computedProperties.push(property);
          }
          const nestedPattern = property.get("value");
          visitPattern(nestedPattern);
        }
      } else if (pattern.isArrayPattern()) {
        for (const element of pattern.get("elements")) {
          if (!element) continue;
          if (element.isRestElement()) {
            const restArgument = element.get("argument");
            visitPattern(restArgument);
          } else {
            visitPattern(element);
          }
        }
      } else if (pattern.isAssignmentPattern()) {
        visitPattern(pattern.get("left"));
      }
    }
    visitPattern(destructuringPattern);
    return computedProperties;
  }
  function createObjectRest(path, file, objRef) {
    const props = path.get("properties");
    const last = props[props.length - 1];
    t.assertRestElement(last.node);
    const restElement = t.cloneNode(last.node);
    last.remove();
    const impureComputedPropertyDeclarators = replaceImpureComputedKeys(path.get("properties"), path.scope);
    const {
      keys,
      allPrimitives,
      hasTemplateLiteral
    } = extractNormalizedKeys(path);
    if (keys.length === 0) {
      return [impureComputedPropertyDeclarators, restElement.argument, t.callExpression(getExtendsHelper(file), [t.objectExpression([]), t.sequenceExpression([t.callExpression(file.addHelper("objectDestructuringEmpty"), [t.cloneNode(objRef)]), t.cloneNode(objRef)])])];
    }
    let keyExpression;
    if (!allPrimitives) {
      keyExpression = t.callExpression(t.memberExpression(t.arrayExpression(keys), t.identifier("map")), [file.addHelper("toPropertyKey")]);
    } else {
      keyExpression = t.arrayExpression(keys);
      if (!hasTemplateLiteral && !t.isProgram(path.scope.block)) {
        const program = path.findParent(path => path.isProgram());
        const id = path.scope.generateUidIdentifier("excluded");
        program.scope.push({
          id,
          init: keyExpression,
          kind: "const"
        });
        keyExpression = t.cloneNode(id);
      }
    }
    return [impureComputedPropertyDeclarators, restElement.argument, t.callExpression(file.addHelper(`objectWithoutProperties${objectRestNoSymbols ? "Loose" : ""}`), [t.cloneNode(objRef), keyExpression])];
  }
  function replaceRestElement(parentPath, paramPath, container) {
    if (paramPath.isAssignmentPattern()) {
      replaceRestElement(parentPath, paramPath.get("left"), container);
      return;
    }
    if (paramPath.isArrayPattern() && hasObjectRestElement(paramPath)) {
      const elements = paramPath.get("elements");
      for (let i = 0; i < elements.length; i++) {
        replaceRestElement(parentPath, elements[i], container);
      }
    }
    if (paramPath.isObjectPattern() && hasObjectRestElement(paramPath)) {
      const uid = parentPath.scope.generateUidIdentifier("ref");
      const declar = t.variableDeclaration("let", [t.variableDeclarator(paramPath.node, uid)]);
      if (container) {
        container.push(declar);
      } else {
        parentPath.ensureBlock();
        parentPath.get("body").unshiftContainer("body", declar);
      }
      paramPath.replaceWith(t.cloneNode(uid));
    }
  }
  return {
    name: "transform-object-rest-spread",
    manipulateOptions: undefined,
    visitor: {
      Function(path) {
        const params = path.get("params");
        const paramsWithRestElement = new Set();
        const idsInRestParams = new Set();
        for (let i = 0; i < params.length; ++i) {
          const param = params[i];
          if (hasObjectRestElement(param)) {
            paramsWithRestElement.add(i);
            for (const name of Object.keys(param.getBindingIdentifiers())) {
              idsInRestParams.add(name);
            }
          }
        }
        let idInRest = false;
        const IdentifierHandler = function (path, functionScope) {
          const name = path.node.name;
          if (path.scope.getBinding(name) === functionScope.getBinding(name) && idsInRestParams.has(name)) {
            idInRest = true;
            path.stop();
          }
        };
        let i;
        for (i = 0; i < params.length && !idInRest; ++i) {
          const param = params[i];
          if (!paramsWithRestElement.has(i)) {
            if (param.isReferencedIdentifier() || param.isBindingIdentifier()) {
              IdentifierHandler(param, path.scope);
            } else {
              param.traverse({
                "Scope|TypeAnnotation|TSTypeAnnotation": path => path.skip(),
                "ReferencedIdentifier|BindingIdentifier": IdentifierHandler
              }, path.scope);
            }
          }
        }
        if (!idInRest) {
          for (let i = 0; i < params.length; ++i) {
            const param = params[i];
            if (paramsWithRestElement.has(i)) {
              replaceRestElement(path, param);
            }
          }
        } else {
          const shouldTransformParam = idx => idx >= i - 1 || paramsWithRestElement.has(idx);
          convertFunctionParams(path, ignoreFunctionLength, shouldTransformParam, replaceRestElement);
        }
      },
      VariableDeclarator(path, file) {
        if (!path.get("id").isObjectPattern()) {
          return;
        }
        let insertionPath = path;
        const originalPath = path;
        if (hasObjectRestElement(path.get("id"))) {
          const destructuringPattern = originalPath.get("id");
          const propertiesWithComputedKeys = collectComputedKeysInSourceOrder(destructuringPattern);
          for (const property of propertiesWithComputedKeys) {
            const computedKeyExpression = property.get("key");
            if (computedKeyExpression.isAssignmentExpression() && computedKeyExpression.get("left").isIdentifier() && originalPath.scope.hasUid(computedKeyExpression.node.left.name)) {
              continue;
            }
            if (!computedKeyExpression.isPure()) {
              const tempVariableName = originalPath.scope.generateUidBasedOnNode(computedKeyExpression.node);
              const tempIdentifier = t.identifier(tempVariableName);
              originalPath.scope.push({
                id: tempIdentifier,
                kind: "var"
              });
              computedKeyExpression.replaceWith(t.assignmentExpression("=", t.cloneNode(tempIdentifier), computedKeyExpression.node));
            }
          }
        }
        visitObjectRestElements(path.get("id"), path => {
          if (shouldStoreRHSInTemporaryVariable(originalPath.node.id) && !t.isIdentifier(originalPath.node.init)) {
            const initRef = path.scope.generateUidIdentifierBasedOnNode(originalPath.node.init, "ref");
            originalPath.insertBefore(t.variableDeclarator(initRef, originalPath.node.init));
            originalPath.replaceWith(t.variableDeclarator(originalPath.node.id, t.cloneNode(initRef)));
            return;
          }
          let ref = originalPath.node.init;
          const refPropertyPath = [];
          let kind;
          path.findParent(path => {
            if (path.isObjectProperty()) {
              refPropertyPath.unshift(path);
            } else if (path.isVariableDeclarator()) {
              kind = path.parentPath.node.kind;
              return true;
            }
            return false;
          });
          const impureObjRefComputedDeclarators = replaceImpureComputedKeys(refPropertyPath, path.scope);
          refPropertyPath.forEach(prop => {
            const keyPath = prop.get("key");
            let keyForMemberExpression = keyPath.node;
            if (t.isAssignmentExpression(keyPath.node)) {
              keyForMemberExpression = keyPath.node.left;
            }
            ref = t.memberExpression(ref, t.cloneNode(keyForMemberExpression), prop.node.computed || t.isLiteral(keyPath.node));
          });
          const objectPatternPath = path.parentPath;
          const [impureComputedPropertyDeclarators, argument, callExpression] = createObjectRest(objectPatternPath, file, ref);
          if (pureGetters) {
            removeUnusedExcludedKeys(objectPatternPath);
          }
          t.assertIdentifier(argument);
          insertionPath.insertBefore(impureComputedPropertyDeclarators);
          insertionPath.insertBefore(impureObjRefComputedDeclarators);
          insertionPath = insertionPath.insertAfter(t.variableDeclarator(argument, callExpression))[0];
          path.scope.registerBinding(kind, insertionPath);
          if (objectPatternPath.node.properties.length === 0) {
            objectPatternPath.findParent(path => path.isObjectProperty() || path.isVariableDeclarator()).remove();
          }
        });
      },
      ExportNamedDeclaration(path) {
        const declaration = path.get("declaration");
        if (!declaration.isVariableDeclaration()) return;
        const hasRest = declaration.get("declarations").some(path => hasObjectRestElement(path.get("id")));
        if (!hasRest) return;
        path.splitExportDeclaration();
      },
      CatchClause(path) {
        const paramPath = path.get("param");
        replaceRestElement(path, paramPath);
      },
      AssignmentExpression(path, file) {
        const leftPath = path.get("left");
        if (leftPath.isObjectPattern() && hasObjectRestElement(leftPath)) {
          const nodes = [];
          const refName = path.scope.generateUidBasedOnNode(path.node.right, "ref");
          nodes.push(t.variableDeclaration("var", [t.variableDeclarator(t.identifier(refName), path.node.right)]));
          const [impureComputedPropertyDeclarators, argument, callExpression] = createObjectRest(leftPath, file, t.identifier(refName));
          if (impureComputedPropertyDeclarators.length > 0) {
            nodes.push(t.variableDeclaration("var", impureComputedPropertyDeclarators));
          }
          const nodeWithoutSpread = t.cloneNode(path.node);
          nodeWithoutSpread.right = t.identifier(refName);
          nodes.push(t.expressionStatement(nodeWithoutSpread));
          nodes.push(t.expressionStatement(t.assignmentExpression("=", argument, callExpression)));
          nodes.push(t.expressionStatement(t.identifier(refName)));
          path.replaceWithMultiple(nodes);
        }
      },
      ForXStatement(path) {
        const {
          node,
          scope
        } = path;
        const leftPath = path.get("left");
        if (!leftPath.isVariableDeclaration()) {
          if (!hasObjectRestElement(leftPath)) {
            return;
          }
          const temp = scope.generateUidIdentifier("ref");
          node.left = t.variableDeclaration("var", [t.variableDeclarator(temp)]);
          path.ensureBlock();
          const statementBody = path.node.body.body;
          const nodes = [];
          if (statementBody.length === 0 && path.isCompletionRecord()) {
            nodes.unshift(t.expressionStatement(t.buildUndefinedNode()));
          }
          nodes.unshift(t.expressionStatement(t.assignmentExpression("=", leftPath.node, t.cloneNode(temp))));
          unshiftForXStatementBody(path, nodes);
          scope.crawl();
          return;
        } else {
          const patternPath = leftPath.get("declarations")[0].get("id");
          if (!hasObjectRestElement(patternPath)) {
            return;
          }
          const left = leftPath.node;
          const pattern = patternPath.node;
          const key = scope.generateUidIdentifier("ref");
          node.left = t.variableDeclaration(left.kind, [t.variableDeclarator(key, null)]);
          path.ensureBlock();
          unshiftForXStatementBody(path, [t.variableDeclaration(node.left.kind, [t.variableDeclarator(pattern, t.cloneNode(key))])]);
          scope.crawl();
          return;
        }
      },
      ArrayPattern(path) {
        const objectPatterns = [];
        const {
          scope
        } = path;
        const uidIdentifiers = [];
        visitObjectRestElements(path, path => {
          const objectPattern = path.parentPath;
          const uid = scope.generateUidIdentifier("ref");
          objectPatterns.push({
            left: objectPattern.node,
            right: uid
          });
          uidIdentifiers.push(uid);
          objectPattern.replaceWith(t.cloneNode(uid));
          path.skip();
        });
        if (objectPatterns.length > 0) {
          const patternParentPath = path.findParent(path => !(path.isPattern() || path.isObjectProperty()));
          const patternParent = patternParentPath.node;
          switch (patternParent.type) {
            case "VariableDeclarator":
              patternParentPath.insertAfter(objectPatterns.map(({
                left,
                right
              }) => t.variableDeclarator(left, right)));
              break;
            case "AssignmentExpression":
              {
                for (const uidIdentifier of uidIdentifiers) {
                  scope.push({
                    id: t.cloneNode(uidIdentifier)
                  });
                }
                patternParentPath.insertAfter(objectPatterns.map(({
                  left,
                  right
                }) => t.assignmentExpression("=", left, right)));
              }
              break;
            default:
              throw new Error(`Unexpected pattern parent type: ${patternParent.type}`);
          }
        }
      },
      ObjectExpression(path, file) {
        if (!hasSpread(path.node)) return;
        let helper;
        if (setSpreadProperties) {
          helper = getExtendsHelper(file);
        } else {
          helper = file.addHelper("objectSpread2");
        }
        let exp = null;
        let props = [];
        function make() {
          const hadProps = props.length > 0;
          const obj = t.objectExpression(props);
          props = [];
          if (!exp) {
            exp = t.callExpression(helper, [obj]);
            return;
          }
          if (pureGetters) {
            if (hadProps) {
              exp.arguments.push(obj);
            }
            return;
          }
          exp = t.callExpression(t.cloneNode(helper), [exp, ...(hadProps ? [t.objectExpression([]), obj] : [])]);
        }
        for (const prop of path.node.properties) {
          if (t.isSpreadElement(prop)) {
            make();
            exp.arguments.push(prop.argument);
          } else {
            props.push(prop);
          }
        }
        if (props.length) make();
        path.replaceWith(exp);
      }
    }
  };
});