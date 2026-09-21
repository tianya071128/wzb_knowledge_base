import { types as t, template } from "@babel/core";
import ReplaceSupers from "@babel/helper-replace-supers";
import { skipTransparentExprWrappers } from "@babel/helper-skip-transparent-expression-wrappers";
import { privateNameVisitorFactory } from "./fields.js";
import { memoiseComputedKey } from "./misc.js";
export function hasOwnDecorators(node) {
  return !!node.decorators?.length;
}
function incrementId(id, idx = id.length - 1) {
  if (idx === -1) {
    id.unshift(65);
    return;
  }
  const current = id[idx];
  if (current === 90) {
    id[idx] = 97;
  } else if (current === 122) {
    id[idx] = 65;
    incrementId(id, idx - 1);
  } else {
    id[idx] = current + 1;
  }
}
function createPrivateUidGeneratorForClass(classPath) {
  const currentPrivateId = [];
  const privateNames = new Set();
  t.traverseFast(classPath.node, node => {
    if (t.isPrivateName(node)) {
      privateNames.add(node.id.name);
    }
  });
  return () => {
    let reifiedId;
    do {
      incrementId(currentPrivateId);
      reifiedId = String.fromCharCode(...currentPrivateId);
    } while (privateNames.has(reifiedId));
    return t.privateName(t.identifier(reifiedId));
  };
}
function createLazyPrivateUidGeneratorForClass(classPath) {
  let generator;
  return () => {
    if (!generator) {
      generator = createPrivateUidGeneratorForClass(classPath);
    }
    return generator();
  };
}
function replaceClassWithVar(path, className) {
  const id = path.node.id;
  const scope = path.scope;
  if (path.type === "ClassDeclaration") {
    const className = id.name;
    const varId = scope.generateUidIdentifierBasedOnNode(id);
    const classId = t.identifier(className);
    scope.rename(className, varId.name);
    path.get("id").replaceWith(classId);
    return {
      id: t.cloneNode(varId),
      path
    };
  } else {
    let varId;
    if (id) {
      className = id.name;
      varId = generateLetUidIdentifier(scope.parent, className);
      scope.rename(className, varId.name);
    } else {
      varId = generateLetUidIdentifier(scope.parent, typeof className === "string" ? className : "decorated_class");
    }
    const newClassExpr = t.classExpression(typeof className === "string" ? t.identifier(className) : null, path.node.superClass, path.node.body);
    const [newPath] = path.replaceWith(t.sequenceExpression([newClassExpr, varId]));
    return {
      id: t.cloneNode(varId),
      path: newPath.get("expressions.0")
    };
  }
}
function generateClassProperty(key, value, isStatic) {
  if (key.type === "PrivateName") {
    return t.classPrivateProperty(key, value, undefined, isStatic);
  } else {
    return t.classProperty(key, value, undefined, undefined, isStatic);
  }
}
function assignIdForAnonymousClass(path, className) {
  if (!path.node.id) {
    path.node.id = typeof className === "string" ? t.identifier(className) : path.scope.generateUidIdentifier("Class");
  }
}
function addProxyAccessorsFor(className, element, getterKey, setterKey, targetKey, isComputed, isStatic) {
  const thisArg = isStatic ? className : t.thisExpression();
  const getterBody = t.blockStatement([t.returnStatement(t.memberExpression(t.cloneNode(thisArg), t.cloneNode(targetKey)))]);
  const setterBody = t.blockStatement([t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.cloneNode(thisArg), t.cloneNode(targetKey)), t.identifier("v")))]);
  let getter, setter;
  if (getterKey.type === "PrivateName") {
    getter = t.classPrivateMethod("get", getterKey, [], getterBody, isStatic);
    setter = t.classPrivateMethod("set", setterKey, [t.identifier("v")], setterBody, isStatic);
  } else {
    getter = t.classMethod("get", getterKey, [], getterBody, isComputed, isStatic);
    setter = t.classMethod("set", setterKey, [t.identifier("v")], setterBody, isComputed, isStatic);
  }
  element.insertAfter(setter);
  element.insertAfter(getter);
}
function extractProxyAccessorsFor(targetKey) {
  return [template.expression.ast`
      o => o.${t.cloneNode(targetKey)}
    `, template.expression.ast`
      (o, v) => o.${t.cloneNode(targetKey)} = v
    `];
}
function getComputedKeyLastElement(path) {
  path = skipTransparentExprWrappers(path);
  if (path.isSequenceExpression()) {
    const expressions = path.get("expressions");
    return getComputedKeyLastElement(expressions[expressions.length - 1]);
  }
  return path;
}
function getComputedKeyMemoiser(path) {
  const element = getComputedKeyLastElement(path);
  if (element.isConstantExpression()) {
    return t.cloneNode(path.node);
  } else if (element.isIdentifier() && path.scope.hasUid(element.node.name)) {
    return t.cloneNode(path.node);
  } else if (element.isAssignmentExpression() && element.get("left").isIdentifier()) {
    return t.cloneNode(element.node.left);
  } else {
    throw new Error(`Internal Error: the computed key ${path.toString()} has not yet been memoised.`);
  }
}
function prependExpressionsToComputedKey(expressions, fieldPath) {
  const key = fieldPath.get("key");
  if (key.isSequenceExpression()) {
    expressions.push(...key.node.expressions);
  } else {
    expressions.push(key.node);
  }
  key.replaceWith(maybeSequenceExpression(expressions));
}
function appendExpressionsToComputedKey(expressions, fieldPath) {
  const key = fieldPath.get("key");
  const completion = getComputedKeyLastElement(key);
  if (completion.isConstantExpression()) {
    prependExpressionsToComputedKey(expressions, fieldPath);
  } else {
    const scopeParent = key.scope.parent;
    const maybeAssignment = memoiseComputedKey(completion.node, scopeParent, scopeParent.generateUid("computedKey"));
    if (!maybeAssignment) {
      prependExpressionsToComputedKey(expressions, fieldPath);
    } else {
      const expressionSequence = [...expressions, t.cloneNode(maybeAssignment.left)];
      const completionParent = completion.parentPath;
      if (completionParent.isSequenceExpression()) {
        completionParent.pushContainer("expressions", expressionSequence);
      } else {
        completion.replaceWith(maybeSequenceExpression([t.cloneNode(maybeAssignment), ...expressionSequence]));
      }
    }
  }
}
function prependExpressionsToFieldInitializer(expressions, fieldPath) {
  const initializer = fieldPath.get("value");
  if (initializer.node) {
    expressions.push(initializer.node);
  } else if (expressions.length > 0) {
    expressions[expressions.length - 1] = t.unaryExpression("void", expressions[expressions.length - 1]);
  }
  initializer.replaceWith(maybeSequenceExpression(expressions));
}
function prependExpressionsToStaticBlock(expressions, blockPath) {
  blockPath.unshiftContainer("body", t.expressionStatement(maybeSequenceExpression(expressions)));
}
function prependExpressionsToConstructor(expressions, constructorPath) {
  constructorPath.node.body.body.unshift(t.expressionStatement(maybeSequenceExpression(expressions)));
}
function isProtoInitCallExpression(expression, protoInitCall) {
  return t.isCallExpression(expression) && t.isIdentifier(expression.callee, {
    name: protoInitCall.name
  });
}
function optimizeSuperCallAndExpressions(expressions, protoInitLocal) {
  if (protoInitLocal) {
    if (expressions.length >= 2 && isProtoInitCallExpression(expressions[1], protoInitLocal)) {
      const mergedSuperCall = t.callExpression(t.cloneNode(protoInitLocal), [expressions[0]]);
      expressions.splice(0, 2, mergedSuperCall);
    }
    if (expressions.length >= 2 && t.isThisExpression(expressions[expressions.length - 1]) && isProtoInitCallExpression(expressions[expressions.length - 2], protoInitLocal)) {
      expressions.splice(expressions.length - 1, 1);
    }
  }
  return maybeSequenceExpression(expressions);
}
function insertExpressionsAfterSuperCallAndOptimize(expressions, constructorPath, protoInitLocal) {
  constructorPath.traverse({
    CallExpression: {
      exit(path) {
        if (!path.get("callee").isSuper()) return;
        const newNodes = [path.node, ...expressions.map(expr => t.cloneNode(expr))];
        if (path.isCompletionRecord()) {
          newNodes.push(t.thisExpression());
        }
        path.replaceWith(optimizeSuperCallAndExpressions(newNodes, protoInitLocal));
        path.skip();
      }
    },
    ClassMethod(path) {
      if (path.node.kind === "constructor") {
        path.skip();
      }
    }
  });
}
function createConstructorFromExpressions(expressions, isDerivedClass) {
  const body = [t.expressionStatement(maybeSequenceExpression(expressions))];
  if (isDerivedClass) {
    body.unshift(t.expressionStatement(t.callExpression(t.super(), [t.spreadElement(t.identifier("args"))])));
  }
  return t.classMethod("constructor", t.identifier("constructor"), isDerivedClass ? [t.restElement(t.identifier("args"))] : [], t.blockStatement(body));
}
function createStaticBlockFromExpressions(expressions) {
  return t.staticBlock([t.expressionStatement(maybeSequenceExpression(expressions))]);
}
const FIELD = 0;
const ACCESSOR = 1;
const METHOD = 2;
const GETTER = 3;
const SETTER = 4;
const FIELD_IGNORED = 5;
const STATIC = 8;
const DECORATORS_HAVE_THIS = 16;
function getElementKind({
  node
}) {
  switch (node.type) {
    case "ClassProperty":
      return node.declare || node.abstract ? FIELD_IGNORED : FIELD;
    case "ClassPrivateProperty":
      return FIELD;
    case "ClassAccessorProperty":
      return ACCESSOR;
    case "ClassMethod":
    case "ClassPrivateMethod":
      if (node.kind === "get") {
        return GETTER;
      } else if (node.kind === "set") {
        return SETTER;
      } else {
        return METHOD;
      }
  }
}
function toSortedDecoratorInfo(info) {
  return [...info.filter(el => el.isStatic && el.kind >= ACCESSOR && el.kind <= SETTER), ...info.filter(el => !el.isStatic && el.kind >= ACCESSOR && el.kind <= SETTER), ...info.filter(el => el.isStatic && el.kind === FIELD), ...info.filter(el => !el.isStatic && el.kind === FIELD)];
}
function generateDecorationList(decorators, decoratorsThis) {
  const decsCount = decorators.length;
  const haveOneThis = decoratorsThis.some(Boolean);
  const decs = [];
  for (let i = 0; i < decsCount; i++) {
    if (haveOneThis) {
      decs.push(decoratorsThis[i] || t.buildUndefinedNode());
    }
    decs.push(decorators[i].expression);
  }
  return {
    haveThis: haveOneThis,
    decs
  };
}
function generateDecorationExprs(decorationInfo) {
  return t.arrayExpression(decorationInfo.map(el => {
    let flag = el.kind;
    if (el.isStatic) {
      flag += STATIC;
    }
    if (el.decoratorsHaveThis) flag += DECORATORS_HAVE_THIS;
    return t.arrayExpression([el.decoratorsArray, t.numericLiteral(flag), el.name, ...(el.privateMethods || [])]);
  }));
}
function extractElementLocalAssignments(decorationInfo) {
  const localIds = [];
  for (const el of decorationInfo) {
    const {
      locals
    } = el;
    if (Array.isArray(locals)) {
      localIds.push(...locals);
    } else if (locals !== undefined) {
      localIds.push(locals);
    }
  }
  return localIds;
}
function addCallAccessorsFor(element, key, getId, setId, isStatic) {
  element.insertAfter(t.classPrivateMethod("get", t.cloneNode(key), [], t.blockStatement([t.returnStatement(t.callExpression(t.cloneNode(getId), isStatic ? [] : [t.thisExpression()]))]), isStatic));
  element.insertAfter(t.classPrivateMethod("set", t.cloneNode(key), [t.identifier("v")], t.blockStatement([t.expressionStatement(t.callExpression(t.cloneNode(setId), isStatic ? [t.identifier("v")] : [t.thisExpression(), t.identifier("v")]))]), isStatic));
}
function movePrivateAccessor(element, key, methodLocalVar, isStatic) {
  let params;
  let block;
  if (element.node.kind === "set") {
    params = [t.identifier("v")];
    block = [t.expressionStatement(t.callExpression(methodLocalVar, [t.thisExpression(), t.identifier("v")]))];
  } else {
    params = [];
    block = [t.returnStatement(t.callExpression(methodLocalVar, [t.thisExpression()]))];
  }
  element.replaceWith(t.classPrivateMethod(element.node.kind, t.cloneNode(key), params, t.blockStatement(block), isStatic));
}
function isClassDecoratableElementPath(path) {
  const {
    type
  } = path;
  return type !== "TSDeclareMethod" && type !== "TSIndexSignature" && type !== "StaticBlock";
}
function staticBlockToIIFE(block) {
  return t.callExpression(t.arrowFunctionExpression([], t.blockStatement(block.body)), []);
}
function staticBlockToFunctionClosure(block) {
  return t.functionExpression(null, [], t.blockStatement(block.body));
}
function fieldInitializerToClosure(value) {
  return t.functionExpression(null, [], t.blockStatement([t.returnStatement(value)]));
}
function maybeSequenceExpression(exprs) {
  if (exprs.length === 0) return t.buildUndefinedNode();
  if (exprs.length === 1) return exprs[0];
  return t.sequenceExpression(exprs);
}
function createFunctionExpressionFromPrivateMethod(node) {
  const {
    params,
    body,
    generator: isGenerator,
    async: isAsync
  } = node;
  return t.functionExpression(undefined, params, body, isGenerator, isAsync);
}
function createSetFunctionNameCall(state, className) {
  return t.callExpression(state.addHelper("setFunctionName"), [t.thisExpression(), className]);
}
function createToPropertyKeyCall(state, propertyKey) {
  return t.callExpression(state.addHelper("toPropertyKey"), [propertyKey]);
}
function createPrivateBrandCheckClosure(brandName) {
  return t.arrowFunctionExpression([t.identifier("_")], t.binaryExpression("in", t.cloneNode(brandName), t.identifier("_")));
}
function usesPrivateField(expression) {
  return t.traverseFast(expression, node => {
    if (t.isPrivateName(node)) {
      return t.traverseFast.stop;
    }
  });
}
function convertToComputedKey(path) {
  const {
    node
  } = path;
  node.computed = true;
  if (t.isIdentifier(node.key)) {
    node.key = t.stringLiteral(node.key.name);
  }
}
function hasInstancePrivateAccess(path, privateNames) {
  let containsInstancePrivateAccess = false;
  if (privateNames.length > 0) {
    const privateNameVisitor = privateNameVisitorFactory({
      PrivateName(path, state) {
        if (state.privateNamesMap.has(path.node.id.name)) {
          containsInstancePrivateAccess = true;
          path.stop();
        }
      }
    });
    const privateNamesMap = new Map();
    for (const name of privateNames) {
      privateNamesMap.set(name, null);
    }
    path.traverse(privateNameVisitor, {
      privateNamesMap: privateNamesMap
    });
  }
  return containsInstancePrivateAccess;
}
function checkPrivateMethodUpdateError(path, decoratedPrivateMethods) {
  const privateNameVisitor = privateNameVisitorFactory({
    PrivateName(path, state) {
      if (!state.privateNamesMap.has(path.node.id.name)) return;
      const parentPath = path.parentPath;
      const parentParentPath = parentPath.parentPath;
      if (parentParentPath.node.type === "AssignmentExpression" && parentParentPath.node.left === parentPath.node || parentParentPath.node.type === "UpdateExpression" || parentParentPath.node.type === "RestElement" || parentParentPath.node.type === "ArrayPattern" || parentParentPath.node.type === "ObjectProperty" && parentParentPath.node.value === parentPath.node && parentParentPath.parentPath.type === "ObjectPattern" || parentParentPath.node.type === "ForOfStatement" && parentParentPath.node.left === parentPath.node) {
        throw path.buildCodeFrameError(`Decorated private methods are read-only, but "#${path.node.id.name}" is updated via this expression.`);
      }
    }
  });
  const privateNamesMap = new Map();
  for (const name of decoratedPrivateMethods) {
    privateNamesMap.set(name, null);
  }
  path.traverse(privateNameVisitor, {
    privateNamesMap: privateNamesMap
  });
}
function transformClass(path, state, constantSuper, ignoreFunctionLength, className, propertyVisitor) {
  const body = path.get("body.body");
  const classDecorators = path.node.decorators;
  let hasElementDecorators = false;
  let hasComputedKeysSideEffects = false;
  let elemDecsUseFnContext = false;
  const generateClassPrivateUid = createLazyPrivateUidGeneratorForClass(path);
  const classAssignments = [];
  const scopeParent = path.scope.parent;
  const memoiseExpression = (expression, hint, assignments) => {
    const localEvaluatedId = generateLetUidIdentifier(scopeParent, hint);
    assignments.push(t.assignmentExpression("=", localEvaluatedId, expression));
    return t.cloneNode(localEvaluatedId);
  };
  let protoInitLocal;
  let staticInitLocal;
  const classIdName = path.node.id?.name;
  const setClassName = typeof className === "object" ? className : undefined;
  const usesFunctionContextOrYieldAwait = decorator => {
    return t.traverseFast(decorator, node => {
      if (t.isThisExpression(node) || t.isSuper(node) || t.isYieldExpression(node) || t.isAwaitExpression(node) || t.isIdentifier(node, {
        name: "arguments"
      }) || classIdName && t.isIdentifier(node, {
        name: classIdName
      }) || t.isMetaProperty(node) && node.meta.name !== "import") {
        return t.traverseFast.stop;
      }
    });
  };
  const instancePrivateNames = [];
  for (const element of body) {
    if (!isClassDecoratableElementPath(element)) {
      continue;
    }
    const elementNode = element.node;
    if (!elementNode.static && t.isPrivateName(elementNode.key)) {
      instancePrivateNames.push(elementNode.key.id.name);
    }
    if (isDecorated(elementNode)) {
      switch (elementNode.type) {
        case "ClassProperty":
          propertyVisitor.ClassProperty(element, state);
          break;
        case "ClassPrivateProperty":
          propertyVisitor.ClassPrivateProperty(element, state);
          break;
        case "ClassAccessorProperty":
          propertyVisitor.ClassAccessorProperty(element, state);
          break;
        default:
          if (elementNode.static) {
            staticInitLocal ??= generateLetUidIdentifier(scopeParent, "initStatic");
          } else {
            protoInitLocal ??= generateLetUidIdentifier(scopeParent, "initProto");
          }
          break;
      }
      hasElementDecorators = true;
      elemDecsUseFnContext ||= elementNode.decorators.some(usesFunctionContextOrYieldAwait);
    } else if (elementNode.type === "ClassAccessorProperty") {
      propertyVisitor.ClassAccessorProperty(element, state);
      const {
        key,
        value,
        static: isStatic,
        computed
      } = elementNode;
      const newId = generateClassPrivateUid();
      const newField = generateClassProperty(newId, value, isStatic);
      const keyPath = element.get("key");
      const [newPath] = element.replaceWith(newField);
      let getterKey, setterKey;
      if (computed && !keyPath.isConstantExpression()) {
        getterKey = memoiseComputedKey(createToPropertyKeyCall(state, key), scopeParent, scopeParent.generateUid("computedKey"));
        setterKey = t.cloneNode(getterKey.left);
      } else {
        getterKey = t.cloneNode(key);
        setterKey = t.cloneNode(key);
      }
      assignIdForAnonymousClass(path, className);
      addProxyAccessorsFor(path.node.id, newPath, getterKey, setterKey, newId, computed, isStatic);
    }
    if ("computed" in element.node && element.node.computed) {
      hasComputedKeysSideEffects ||= !scopeParent.isStatic(element.node.key);
    }
  }
  if (!classDecorators && !hasElementDecorators) {
    if (!path.node.id && typeof className === "string") {
      path.node.id = t.identifier(className);
    }
    if (setClassName) {
      path.node.body.body.unshift(createStaticBlockFromExpressions([createSetFunctionNameCall(state, setClassName)]));
    }
    return;
  }
  const elementDecoratorInfo = [];
  let constructorPath;
  const decoratedPrivateMethods = new Set();
  let classInitLocal, classIdLocal;
  let decoratorReceiverId;
  function handleDecorators(decorators) {
    let hasSideEffects = false;
    let usesFnContext = false;
    const decoratorsThis = [];
    for (const decorator of decorators) {
      const {
        expression
      } = decorator;
      let object;
      if (t.isMemberExpression(expression)) {
        if (t.isSuper(expression.object)) {
          object = t.thisExpression();
        } else if (scopeParent.isStatic(expression.object)) {
          object = t.cloneNode(expression.object);
        } else {
          decoratorReceiverId ??= generateLetUidIdentifier(scopeParent, "obj");
          object = t.assignmentExpression("=", t.cloneNode(decoratorReceiverId), expression.object);
          expression.object = t.cloneNode(decoratorReceiverId);
        }
      }
      decoratorsThis.push(object);
      hasSideEffects ||= !scopeParent.isStatic(expression);
      usesFnContext ||= usesFunctionContextOrYieldAwait(decorator);
    }
    return {
      hasSideEffects,
      usesFnContext,
      decoratorsThis
    };
  }
  const willExtractSomeElemDecs = hasComputedKeysSideEffects || elemDecsUseFnContext;
  let needsDeclarationForClassBinding = false;
  let classDecorationsFlag = 0;
  let classDecorations = [];
  let classDecorationsId;
  let computedKeyAssignments = [];
  if (classDecorators) {
    classInitLocal = generateLetUidIdentifier(scopeParent, "initClass");
    needsDeclarationForClassBinding = path.isClassDeclaration();
    ({
      id: classIdLocal,
      path
    } = replaceClassWithVar(path, className));
    path.node.decorators = null;
    const classDecsUsePrivateName = classDecorators.some(usesPrivateField);
    const {
      hasSideEffects,
      usesFnContext,
      decoratorsThis
    } = handleDecorators(classDecorators);
    const {
      haveThis,
      decs
    } = generateDecorationList(classDecorators, decoratorsThis);
    classDecorationsFlag = haveThis ? 1 : 0;
    classDecorations = decs;
    if (usesFnContext || hasSideEffects && willExtractSomeElemDecs || classDecsUsePrivateName) {
      classDecorationsId = memoiseExpression(t.arrayExpression(classDecorations), "classDecs", classAssignments);
    }
    if (!hasElementDecorators) {
      for (const element of path.get("body.body")) {
        const {
          node
        } = element;
        const isComputed = "computed" in node && node.computed;
        if (isComputed) {
          if (element.isClassProperty({
            static: true
          })) {
            if (!element.get("key").isConstantExpression()) {
              const key = node.key;
              const maybeAssignment = memoiseComputedKey(key, scopeParent, scopeParent.generateUid("computedKey"));
              if (maybeAssignment != null) {
                node.key = t.cloneNode(maybeAssignment.left);
                computedKeyAssignments.push(maybeAssignment);
              }
            }
          } else if (computedKeyAssignments.length > 0) {
            prependExpressionsToComputedKey(computedKeyAssignments, element);
            computedKeyAssignments = [];
          }
        }
      }
    }
  } else {
    assignIdForAnonymousClass(path, className);
    classIdLocal = t.cloneNode(path.node.id);
  }
  let lastInstancePrivateName = null;
  let needsInstancePrivateBrandCheck = false;
  let fieldInitializerExpressions = [];
  let staticFieldInitializerExpressions = [];
  if (hasElementDecorators) {
    if (protoInitLocal) {
      const protoInitCall = t.callExpression(t.cloneNode(protoInitLocal), [t.thisExpression()]);
      fieldInitializerExpressions.push(protoInitCall);
    }
    for (const element of body) {
      if (!isClassDecoratableElementPath(element)) {
        if (staticFieldInitializerExpressions.length > 0 && element.isStaticBlock()) {
          prependExpressionsToStaticBlock(staticFieldInitializerExpressions, element);
          staticFieldInitializerExpressions = [];
        }
        continue;
      }
      const {
        node
      } = element;
      const decorators = node.decorators;
      const hasDecorators = !!decorators?.length;
      const isComputed = "computed" in node && node.computed;
      let name = "computedKey";
      if (node.key.type === "PrivateName") {
        name = node.key.id.name;
      } else if (!isComputed && node.key.type === "Identifier") {
        name = node.key.name;
      }
      let decoratorsArray;
      let decoratorsHaveThis;
      if (hasDecorators) {
        const {
          hasSideEffects,
          usesFnContext,
          decoratorsThis
        } = handleDecorators(decorators);
        const {
          decs,
          haveThis
        } = generateDecorationList(decorators, decoratorsThis);
        decoratorsHaveThis = haveThis;
        decoratorsArray = decs.length === 1 ? decs[0] : t.arrayExpression(decs);
        if (usesFnContext || hasSideEffects && willExtractSomeElemDecs) {
          decoratorsArray = memoiseExpression(decoratorsArray, name + "Decs", computedKeyAssignments);
        }
      }
      if (isComputed) {
        if (!element.get("key").isConstantExpression()) {
          const key = node.key;
          const maybeAssignment = memoiseComputedKey(hasDecorators ? createToPropertyKeyCall(state, key) : key, scopeParent, scopeParent.generateUid("computedKey"));
          if (maybeAssignment != null) {
            if (classDecorators && element.isClassProperty({
              static: true
            })) {
              node.key = t.cloneNode(maybeAssignment.left);
              computedKeyAssignments.push(maybeAssignment);
            } else {
              node.key = maybeAssignment;
            }
          }
        }
      }
      const {
        key,
        static: isStatic
      } = node;
      const isPrivate = key.type === "PrivateName";
      const kind = getElementKind(element);
      if (kind === FIELD_IGNORED) continue;
      if (isPrivate && !isStatic) {
        if (hasDecorators) {
          needsInstancePrivateBrandCheck = true;
        }
        if (t.isClassPrivateProperty(node) || !lastInstancePrivateName) {
          lastInstancePrivateName = key;
        }
      }
      if (element.isClassMethod({
        kind: "constructor"
      })) {
        constructorPath = element;
      }
      let locals;
      if (hasDecorators) {
        let privateMethods;
        let nameExpr;
        if (isComputed) {
          nameExpr = getComputedKeyMemoiser(element.get("key"));
        } else if (key.type === "PrivateName") {
          nameExpr = t.stringLiteral(key.id.name);
        } else if (key.type === "Identifier") {
          nameExpr = t.stringLiteral(key.name);
        } else {
          nameExpr = t.cloneNode(key);
        }
        if (kind === ACCESSOR) {
          const {
            value
          } = element.node;
          const params = isStatic ? [] : [t.thisExpression()];
          if (value) {
            params.push(t.cloneNode(value));
          }
          const newId = generateClassPrivateUid();
          const newFieldInitId = generateLetUidIdentifier(scopeParent, `init_${name}`);
          const newValue = t.callExpression(t.cloneNode(newFieldInitId), params);
          const newField = generateClassProperty(newId, newValue, isStatic);
          const [newPath] = element.replaceWith(newField);
          if (isPrivate) {
            privateMethods = extractProxyAccessorsFor(newId);
            const getId = generateLetUidIdentifier(scopeParent, `get_${name}`);
            const setId = generateLetUidIdentifier(scopeParent, `set_${name}`);
            addCallAccessorsFor(newPath, key, getId, setId, isStatic);
            locals = [newFieldInitId, getId, setId];
          } else {
            assignIdForAnonymousClass(path, className);
            addProxyAccessorsFor(path.node.id, newPath, t.cloneNode(key), t.isAssignmentExpression(key) ? t.cloneNode(key.left) : t.cloneNode(key), newId, isComputed, isStatic);
            locals = [newFieldInitId];
          }
        } else if (kind === FIELD) {
          const initId = generateLetUidIdentifier(scopeParent, `init_${name}`);
          const valuePath = element.get("value");
          const args = isStatic ? [] : [t.thisExpression()];
          if (valuePath.node) args.push(valuePath.node);
          valuePath.replaceWith(t.callExpression(t.cloneNode(initId), args));
          locals = [initId];
          if (isPrivate) {
            privateMethods = extractProxyAccessorsFor(key);
          }
        } else if (isPrivate) {
          const callId = generateLetUidIdentifier(scopeParent, `call_${name}`);
          locals = [callId];
          const replaceSupers = new ReplaceSupers({
            constantSuper,
            methodPath: element,
            objectRef: classIdLocal,
            superRef: path.node.superClass,
            file: state.file,
            refToPreserve: classIdLocal
          });
          replaceSupers.replace();
          privateMethods = [createFunctionExpressionFromPrivateMethod(element.node)];
          if (kind === GETTER || kind === SETTER) {
            movePrivateAccessor(element, t.cloneNode(key), t.cloneNode(callId), isStatic);
          } else {
            const node = element.node;
            path.node.body.body.unshift(t.classPrivateProperty(key, t.cloneNode(callId), [], node.static));
            decoratedPrivateMethods.add(key.id.name);
            element.remove();
          }
        }
        elementDecoratorInfo.push({
          kind,
          decoratorsArray: decoratorsArray,
          decoratorsHaveThis: decoratorsHaveThis,
          name: nameExpr,
          isStatic,
          privateMethods: privateMethods,
          locals: locals
        });
        if (element.node) {
          element.node.decorators = null;
        }
      }
      if (isComputed && computedKeyAssignments.length > 0) {
        if (classDecorators && element.isClassProperty({
          static: true
        })) {} else {
          prependExpressionsToComputedKey(computedKeyAssignments, kind === ACCESSOR ? element.getNextSibling() : element);
          computedKeyAssignments = [];
        }
      }
      if (fieldInitializerExpressions.length > 0 && !isStatic && (kind === FIELD || kind === ACCESSOR)) {
        prependExpressionsToFieldInitializer(fieldInitializerExpressions, element);
        fieldInitializerExpressions = [];
      }
      if (staticFieldInitializerExpressions.length > 0 && isStatic && (kind === FIELD || kind === ACCESSOR)) {
        prependExpressionsToFieldInitializer(staticFieldInitializerExpressions, element);
        staticFieldInitializerExpressions = [];
      }
      if (hasDecorators) {
        if (kind === FIELD || kind === ACCESSOR) {
          const initExtraId = generateLetUidIdentifier(scopeParent, `init_extra_${name}`);
          locals.push(initExtraId);
          const initExtraCall = t.callExpression(t.cloneNode(initExtraId), isStatic ? [] : [t.thisExpression()]);
          if (!isStatic) {
            fieldInitializerExpressions.push(initExtraCall);
          } else {
            staticFieldInitializerExpressions.push(initExtraCall);
          }
        }
      }
    }
  }
  if (computedKeyAssignments.length > 0) {
    const elements = path.get("body.body");
    let lastComputedElement;
    for (let i = elements.length - 1; i >= 0; i--) {
      const path = elements[i];
      const node = path.node;
      if (node.computed) {
        if (classDecorators && t.isClassProperty(node, {
          static: true
        })) {
          continue;
        }
        lastComputedElement = path;
        break;
      }
    }
    if (lastComputedElement != null) {
      appendExpressionsToComputedKey(computedKeyAssignments, lastComputedElement);
      computedKeyAssignments = [];
    } else {}
  }
  if (fieldInitializerExpressions.length > 0) {
    const isDerivedClass = !!path.node.superClass;
    if (constructorPath) {
      if (isDerivedClass) {
        insertExpressionsAfterSuperCallAndOptimize(fieldInitializerExpressions, constructorPath, protoInitLocal);
      } else {
        prependExpressionsToConstructor(fieldInitializerExpressions, constructorPath);
      }
    } else {
      path.node.body.body.unshift(createConstructorFromExpressions(fieldInitializerExpressions, isDerivedClass));
    }
  }
  if (staticFieldInitializerExpressions.length > 0) {
    path.node.body.body.push(createStaticBlockFromExpressions(staticFieldInitializerExpressions));
    staticFieldInitializerExpressions = [];
  }
  const sortedElementDecoratorInfo = toSortedDecoratorInfo(elementDecoratorInfo);
  const elementDecorations = generateDecorationExprs(elementDecoratorInfo);
  const elementLocals = extractElementLocalAssignments(sortedElementDecoratorInfo);
  if (protoInitLocal) {
    elementLocals.push(protoInitLocal);
  }
  if (staticInitLocal) {
    elementLocals.push(staticInitLocal);
  }
  const classLocals = [];
  let classInitInjected = false;
  const classInitCall = classInitLocal && t.callExpression(t.cloneNode(classInitLocal), []);
  let originalClassPath = path;
  const originalClass = path.node;
  const staticClosures = [];
  if (classDecorators) {
    classLocals.push(classIdLocal, classInitLocal);
    const statics = [];
    path.get("body.body").forEach(element => {
      if (element.isStaticBlock() || !element.isClassMethod() && element.node.static) {
        const replaceSupers = new ReplaceSupers({
          constantSuper,
          methodPath: element,
          objectRef: classIdLocal,
          superRef: path.node.superClass,
          file: state.file,
          refToPreserve: classIdLocal
        });
        replaceSupers.replace();
      }
      if (element.isStaticBlock()) {
        if (hasInstancePrivateAccess(element, instancePrivateNames)) {
          const staticBlockClosureId = memoiseExpression(staticBlockToFunctionClosure(element.node), "staticBlock", staticClosures);
          staticFieldInitializerExpressions.push(t.callExpression(t.memberExpression(staticBlockClosureId, t.identifier("call")), [t.thisExpression()]));
        } else {
          staticFieldInitializerExpressions.push(staticBlockToIIFE(element.node));
        }
        element.remove();
        return;
      }
      if ((element.isClassProperty() || element.isClassPrivateProperty()) && element.node.static) {
        const valuePath = element.get("value");
        if (hasInstancePrivateAccess(valuePath, instancePrivateNames)) {
          const fieldValueClosureId = memoiseExpression(fieldInitializerToClosure(valuePath.node), "fieldValue", staticClosures);
          valuePath.replaceWith(t.callExpression(t.memberExpression(fieldValueClosureId, t.identifier("call")), [t.thisExpression()]));
        }
        if (staticFieldInitializerExpressions.length > 0) {
          prependExpressionsToFieldInitializer(staticFieldInitializerExpressions, element);
          staticFieldInitializerExpressions = [];
        }
        element.node.static = false;
        statics.push(element.node);
        element.remove();
      } else if (element.isClassPrivateMethod({
        static: true
      })) {
        if (hasInstancePrivateAccess(element, instancePrivateNames)) {
          const privateMethodDelegateId = memoiseExpression(createFunctionExpressionFromPrivateMethod(element.node), element.get("key.id").node.name, staticClosures);
          if (ignoreFunctionLength) {
            element.node.params = [t.restElement(t.identifier("arg"))];
            element.node.body = t.blockStatement([t.returnStatement(t.callExpression(t.memberExpression(privateMethodDelegateId, t.identifier("apply")), [t.thisExpression(), t.identifier("arg")]))]);
          } else {
            element.node.params = element.node.params.map((p, i) => {
              if (t.isRestElement(p)) {
                return t.restElement(t.identifier("arg"));
              } else {
                return t.identifier("_" + i);
              }
            });
            element.node.body = t.blockStatement([t.returnStatement(t.callExpression(t.memberExpression(privateMethodDelegateId, t.identifier("apply")), [t.thisExpression(), t.identifier("arguments")]))]);
          }
        }
        element.node.static = false;
        statics.push(element.node);
        element.remove();
      }
    });
    if (statics.length > 0 || staticFieldInitializerExpressions.length > 0) {
      const staticsClass = template.expression.ast`
        class extends ${state.addHelper("identity")} {}
      `;
      staticsClass.body.body = [t.classProperty(t.toExpression(originalClass), undefined, undefined, undefined, true, true), ...statics];
      const constructorBody = [];
      const newExpr = t.newExpression(staticsClass, []);
      if (staticFieldInitializerExpressions.length > 0) {
        constructorBody.push(...staticFieldInitializerExpressions);
      }
      if (classInitCall) {
        classInitInjected = true;
        constructorBody.push(classInitCall);
      }
      if (constructorBody.length > 0) {
        constructorBody.unshift(t.callExpression(t.super(), [t.cloneNode(classIdLocal)]));
        staticsClass.body.body.push(createConstructorFromExpressions(constructorBody, false));
      } else {
        newExpr.arguments.push(t.cloneNode(classIdLocal));
      }
      const [newPath] = path.replaceWith(newExpr);
      originalClassPath = newPath.get("callee").get("body").get("body.0.key");
    }
  }
  if (!classInitInjected && classInitCall) {
    path.node.body.body.push(t.staticBlock([t.expressionStatement(classInitCall)]));
  }
  let {
    superClass
  } = originalClass;
  if (superClass) {
    const id = path.scope.maybeGenerateMemoised(superClass);
    if (id) {
      originalClass.superClass = t.assignmentExpression("=", id, superClass);
      superClass = id;
    }
  }
  const applyDecoratorWrapper = t.staticBlock([]);
  originalClass.body.body.unshift(applyDecoratorWrapper);
  const applyDecsBody = applyDecoratorWrapper.body;
  if (computedKeyAssignments.length > 0) {
    const elements = originalClassPath.get("body.body");
    let firstPublicElement;
    for (const path of elements) {
      if ((path.isClassProperty() || path.isClassMethod()) && path.node.kind !== "constructor") {
        firstPublicElement = path;
        break;
      }
    }
    if (firstPublicElement != null) {
      convertToComputedKey(firstPublicElement);
      prependExpressionsToComputedKey(computedKeyAssignments, firstPublicElement);
    } else {
      originalClass.body.body.unshift(t.classProperty(t.sequenceExpression([...computedKeyAssignments, t.stringLiteral("_")]), undefined, undefined, undefined, true, true));
      applyDecsBody.push(t.expressionStatement(t.unaryExpression("delete", t.memberExpression(t.thisExpression(), t.identifier("_")))));
    }
  }
  applyDecsBody.push(t.expressionStatement(createLocalsAssignment(elementLocals, classLocals, elementDecorations, classDecorationsId ?? t.arrayExpression(classDecorations), t.numericLiteral(classDecorationsFlag), needsInstancePrivateBrandCheck ? lastInstancePrivateName : null, setClassName, t.cloneNode(superClass), state)));
  if (staticInitLocal) {
    applyDecsBody.push(t.expressionStatement(t.callExpression(t.cloneNode(staticInitLocal), [t.thisExpression()])));
  }
  if (staticClosures.length > 0) {
    applyDecsBody.push(...staticClosures.map(expr => t.expressionStatement(expr)));
  }
  path.insertBefore(classAssignments.map(expr => t.expressionStatement(expr)));
  if (needsDeclarationForClassBinding) {
    const classBindingInfo = scopeParent.getBinding(classIdLocal.name);
    if (!classBindingInfo.constantViolations.length) {
      path.insertBefore(t.variableDeclaration("let", [t.variableDeclarator(t.cloneNode(classIdLocal))]));
    } else {
      const classOuterBindingDelegateLocal = scopeParent.generateUidIdentifier("t" + classIdLocal.name);
      const classOuterBindingLocal = classIdLocal;
      path.replaceWithMultiple([t.variableDeclaration("let", [t.variableDeclarator(t.cloneNode(classOuterBindingLocal)), t.variableDeclarator(classOuterBindingDelegateLocal)]), t.blockStatement([t.variableDeclaration("let", [t.variableDeclarator(t.cloneNode(classIdLocal))]), path.node, t.expressionStatement(t.assignmentExpression("=", t.cloneNode(classOuterBindingDelegateLocal), t.cloneNode(classIdLocal)))]), t.expressionStatement(t.assignmentExpression("=", t.cloneNode(classOuterBindingLocal), t.cloneNode(classOuterBindingDelegateLocal)))]);
    }
  }
  if (decoratedPrivateMethods.size > 0) {
    checkPrivateMethodUpdateError(path, decoratedPrivateMethods);
  }
  path.scope.crawl();
  return path;
}
function createLocalsAssignment(elementLocals, classLocals, elementDecorations, classDecorations, classDecorationsFlag, maybePrivateBrandName, setClassName, superClass, state) {
  let lhs, rhs;
  const args = [setClassName ? createSetFunctionNameCall(state, setClassName) : t.thisExpression(), classDecorations, elementDecorations];
  if (maybePrivateBrandName || superClass || classDecorationsFlag.value !== 0) {
    args.push(classDecorationsFlag);
  }
  if (maybePrivateBrandName) {
    args.push(createPrivateBrandCheckClosure(maybePrivateBrandName));
  } else if (superClass) {
    args.push(t.buildUndefinedNode());
  }
  if (superClass) args.push(superClass);
  rhs = t.callExpression(state.addHelper("applyDecs2311"), args);
  if (elementLocals.length > 0) {
    if (classLocals.length > 0) {
      lhs = t.objectPattern([t.objectProperty(t.identifier("e"), t.arrayPattern(elementLocals)), t.objectProperty(t.identifier("c"), t.arrayPattern(classLocals))]);
    } else {
      lhs = t.arrayPattern(elementLocals);
      rhs = t.memberExpression(rhs, t.identifier("e"), false);
    }
  } else {
    lhs = t.arrayPattern(classLocals);
    rhs = t.memberExpression(rhs, t.identifier("c"), false);
  }
  return t.assignmentExpression("=", lhs, rhs);
}
function isProtoKey(node) {
  return node.type === "Identifier" ? node.name === "__proto__" : node.value === "__proto__";
}
function isDecorated(node) {
  return node.decorators && node.decorators.length > 0;
}
function shouldTransformElement(node) {
  switch (node.type) {
    case "ClassAccessorProperty":
      return true;
    case "ClassMethod":
    case "ClassProperty":
    case "ClassPrivateMethod":
    case "ClassPrivateProperty":
      return isDecorated(node);
    default:
      return false;
  }
}
function shouldTransformClass(node) {
  return isDecorated(node) || node.body.body.some(shouldTransformElement);
}
export function buildNamedEvaluationVisitor(needsName, visitor) {
  function handleComputedProperty(propertyPath, key, state) {
    switch (key.type) {
      case "StringLiteral":
        return t.stringLiteral(key.value);
      case "NumericLiteral":
      case "BigIntLiteral":
        {
          const keyValue = key.value + "";
          propertyPath.get("key").replaceWith(t.stringLiteral(keyValue));
          return t.stringLiteral(keyValue);
        }
      default:
        {
          const ref = propertyPath.scope.maybeGenerateMemoised(key);
          propertyPath.get("key").replaceWith(t.assignmentExpression("=", ref, createToPropertyKeyCall(state, key)));
          return t.cloneNode(ref);
        }
    }
  }
  return {
    VariableDeclarator(path, state) {
      const id = path.node.id;
      if (id.type === "Identifier") {
        const initializer = skipTransparentExprWrappers(path.get("init"));
        if (needsName(initializer)) {
          const name = id.name;
          visitor(initializer, state, name);
        }
      }
    },
    AssignmentExpression(path, state) {
      const id = path.node.left;
      if (id.type === "Identifier") {
        const initializer = skipTransparentExprWrappers(path.get("right"));
        if (needsName(initializer)) {
          switch (path.node.operator) {
            case "=":
            case "&&=":
            case "||=":
            case "??=":
              visitor(initializer, state, id.name);
          }
        }
      }
    },
    AssignmentPattern(path, state) {
      const id = path.node.left;
      if (id.type === "Identifier") {
        const initializer = skipTransparentExprWrappers(path.get("right"));
        if (needsName(initializer)) {
          const name = id.name;
          visitor(initializer, state, name);
        }
      }
    },
    ObjectExpression(path, state) {
      for (const propertyPath of path.get("properties")) {
        if (!propertyPath.isObjectProperty()) continue;
        const {
          node
        } = propertyPath;
        const id = node.key;
        const initializer = skipTransparentExprWrappers(propertyPath.get("value"));
        if (needsName(initializer)) {
          if (!node.computed) {
            if (!isProtoKey(id)) {
              if (id.type === "Identifier") {
                visitor(initializer, state, id.name);
              } else {
                const className = t.stringLiteral(id.value + "");
                visitor(initializer, state, className);
              }
            }
          } else {
            const ref = handleComputedProperty(propertyPath, id, state);
            visitor(initializer, state, ref);
          }
        }
      }
    },
    ClassPrivateProperty(path, state) {
      const {
        node
      } = path;
      const initializer = skipTransparentExprWrappers(path.get("value"));
      if (needsName(initializer)) {
        const className = t.stringLiteral("#" + node.key.id.name);
        visitor(initializer, state, className);
      }
    },
    ClassAccessorProperty(path, state) {
      const {
        node
      } = path;
      const id = node.key;
      const initializer = skipTransparentExprWrappers(path.get("value"));
      if (needsName(initializer)) {
        if (!node.computed) {
          if (id.type === "Identifier") {
            visitor(initializer, state, id.name);
          } else if (id.type === "PrivateName") {
            const className = t.stringLiteral("#" + id.id.name);
            visitor(initializer, state, className);
          } else {
            const className = t.stringLiteral(id.value + "");
            visitor(initializer, state, className);
          }
        } else {
          const ref = handleComputedProperty(path, id, state);
          visitor(initializer, state, ref);
        }
      }
    },
    ClassProperty(path, state) {
      const {
        node
      } = path;
      const id = node.key;
      const initializer = skipTransparentExprWrappers(path.get("value"));
      if (needsName(initializer)) {
        if (!node.computed) {
          if (id.type === "Identifier") {
            visitor(initializer, state, id.name);
          } else {
            const className = t.stringLiteral(id.value + "");
            visitor(initializer, state, className);
          }
        } else {
          const ref = handleComputedProperty(path, id, state);
          visitor(initializer, state, ref);
        }
      }
    }
  };
}
function isDecoratedAnonymousClassExpression(path) {
  return path.isClassExpression({
    id: null
  }) && shouldTransformClass(path.node);
}
function generateLetUidIdentifier(scope, name) {
  const id = scope.generateUidIdentifier(name);
  scope.push({
    id,
    kind: "let"
  });
  return t.cloneNode(id);
}
export default function ({
  assertVersion,
  assumption
}, version, inherits) {
  assertVersion("8.0.6");
  const VISITED = new WeakSet();
  const constantSuper = assumption("constantSuper") ?? false;
  const ignoreFunctionLength = assumption("ignoreFunctionLength") ?? false;
  const namedEvaluationVisitor = buildNamedEvaluationVisitor(isDecoratedAnonymousClassExpression, visitClass);
  function visitClass(path, state, className) {
    if (VISITED.has(path)) return;
    const {
      node
    } = path;
    className ??= node.id?.name;
    const newPath = transformClass(path, state, constantSuper, ignoreFunctionLength, className, namedEvaluationVisitor);
    if (newPath) {
      VISITED.add(newPath);
      return;
    }
    VISITED.add(path);
  }
  return {
    name: "proposal-decorators",
    inherits: inherits,
    visitor: {
      ExportDefaultDeclaration(path, state) {
        const {
          declaration
        } = path.node;
        if (declaration?.type === "ClassDeclaration" && isDecorated(declaration)) {
          const isAnonymous = !declaration.id;
          const updatedVarDeclarationPath = path.splitExportDeclaration();
          if (isAnonymous) {
            visitClass(updatedVarDeclarationPath, state, t.stringLiteral("default"));
          }
        }
      },
      ExportNamedDeclaration(path) {
        const {
          declaration
        } = path.node;
        if (declaration?.type === "ClassDeclaration" && isDecorated(declaration)) {
          path.splitExportDeclaration();
        }
      },
      Class(path, state) {
        visitClass(path, state, undefined);
      },
      ...namedEvaluationVisitor
    }
  };
}