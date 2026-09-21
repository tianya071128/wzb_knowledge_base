import ReplaceSupers from "@babel/helper-replace-supers";
import { template, types as t } from "@babel/core";
import { visitors } from "@babel/traverse";
import annotateAsPure from "@babel/helper-annotate-as-pure";
export default function transformClass(path, file, builtinClasses, isLoose, assumptions, supportUnicodeId) {
  const classState = {
    classRef: undefined,
    superName: null,
    superReturns: [],
    construct: undefined,
    userConstructorPath: undefined,
    body: [],
    superThises: [],
    pushedCreateClass: false,
    protoAlias: null,
    dynamicKeys: new Map(),
    methods: {
      instance: {
        hasComputed: false,
        list: [],
        map: new Map()
      },
      static: {
        hasComputed: false,
        list: [],
        map: new Map()
      }
    }
  };
  const scope = path.scope;
  const findThisesVisitor = visitors.environmentVisitor({
    ThisExpression(path) {
      classState.superThises.push(path);
    }
  });
  function createClassHelper(args) {
    return t.callExpression(file.addHelper("createClass"), args);
  }
  function maybeCreateConstructor() {
    const classBodyPath = path.get("body");
    if (classBodyPath.node.body.some(path => t.isClassMethod(path) && path.kind === "constructor")) {
      return;
    }
    const params = [];
    let body;
    if (classState.superName) {
      body = template.statement.ast`{
          super(...arguments);
        }`;
    } else {
      body = t.blockStatement([]);
    }
    classBodyPath.unshiftContainer("body", t.classMethod("constructor", t.identifier("constructor"), params, body));
  }
  function pushBody() {
    const classBodyPaths = path.get("body.body");
    for (const path of classBodyPaths) {
      const node = path.node;
      if (path.isClassProperty() || path.isClassPrivateProperty()) {
        throw path.buildCodeFrameError("Missing class properties transform.");
      }
      if (node.decorators) {
        throw path.buildCodeFrameError("Method has decorators, put the decorator plugin before the classes one.");
      }
      if (t.isClassMethod(node)) {
        const isConstructor = node.kind === "constructor";
        const replaceSupers = new ReplaceSupers({
          methodPath: path,
          objectRef: classState.classRef,
          superRef: classState.superName,
          constantSuper: assumptions.constantSuper,
          file: file,
          refToPreserve: classState.classRef
        });
        replaceSupers.replace();
        if (isConstructor) {
          const superReturns = [];
          path.traverse(visitors.environmentVisitor({
            ReturnStatement(path) {
              if (!path.getFunctionParent().isArrowFunctionExpression()) {
                superReturns.push(path);
              }
            }
          }));
          classState.superReturns = superReturns;
          classState.userConstructorPath = path;
          t.inheritsComments(classState.construct, node).params = node.params;
        } else {
          path.ensureFunctionName(supportUnicodeId);
          let wrapped;
          if (node !== path.node) {
            wrapped = path.node;
            path.replaceWith(node);
          }
          pushMethod(node, wrapped);
        }
      }
    }
  }
  function pushDescriptors() {
    pushInheritsToBody();
    const {
      body
    } = classState;
    const props = {
      instance: null,
      static: null
    };
    for (const placement of ["static", "instance"]) {
      if (classState.methods[placement].list.length) {
        props[placement] = classState.methods[placement].list.map(desc => {
          const obj = t.objectExpression([t.objectProperty(t.identifier("key"), desc.key)]);
          for (const kind of ["get", "set", "value"]) {
            if (desc[kind] != null) {
              obj.properties.push(t.objectProperty(t.identifier(kind), desc[kind]));
            }
          }
          return obj;
        });
      }
    }
    if (props.instance || props.static) {
      let args = [t.cloneNode(classState.classRef), props.instance ? t.arrayExpression(props.instance) : t.nullLiteral(), props.static ? t.arrayExpression(props.static) : t.nullLiteral()];
      let lastNonNullIndex = 0;
      for (let i = 0; i < args.length; i++) {
        if (!t.isNullLiteral(args[i])) lastNonNullIndex = i;
      }
      args = args.slice(0, lastNonNullIndex + 1);
      body.push(t.returnStatement(createClassHelper(args)));
      classState.pushedCreateClass = true;
    }
  }
  function wrapSuperCall(bareSuper, superRef, thisRef, body) {
    const bareSuperNode = bareSuper.node;
    let call;
    if (assumptions.superIsCallableConstructor) {
      bareSuperNode.arguments.unshift(t.thisExpression());
      if (bareSuperNode.arguments.length === 2 && t.isSpreadElement(bareSuperNode.arguments[1]) && t.isIdentifier(bareSuperNode.arguments[1].argument, {
        name: "arguments"
      })) {
        bareSuperNode.arguments[1] = bareSuperNode.arguments[1].argument;
        bareSuperNode.callee = t.memberExpression(t.cloneNode(superRef), t.identifier("apply"));
      } else {
        bareSuperNode.callee = t.memberExpression(t.cloneNode(superRef), t.identifier("call"));
      }
      call = t.logicalExpression("||", bareSuperNode, t.thisExpression());
    } else {
      const args = [t.thisExpression(), t.cloneNode(classState.classRef)];
      if (bareSuperNode.arguments?.length) {
        const bareSuperNodeArguments = bareSuperNode.arguments;
        if (bareSuperNodeArguments.length === 1 && t.isSpreadElement(bareSuperNodeArguments[0]) && t.isIdentifier(bareSuperNodeArguments[0].argument, {
          name: "arguments"
        })) {
          args.push(bareSuperNodeArguments[0].argument);
        } else {
          args.push(t.arrayExpression(bareSuperNodeArguments));
        }
      }
      call = t.callExpression(file.addHelper("callSuper"), args);
    }
    if (bareSuper.parentPath.isExpressionStatement() && bareSuper.parentPath.container === body.node.body && body.node.body.length - 1 === bareSuper.parentPath.key) {
      if (classState.superThises.length) {
        call = t.assignmentExpression("=", thisRef(), call);
      }
      bareSuper.parentPath.replaceWith(t.returnStatement(call));
    } else {
      bareSuper.replaceWith(t.assignmentExpression("=", thisRef(), call));
    }
  }
  function verifyConstructor() {
    if (!classState.superName) return;
    const path = classState.userConstructorPath;
    const constructorBody = path.get("body");
    let maxGuaranteedSuperBeforeIndex = constructorBody.node.body.length;
    path.traverse(findThisesVisitor);
    let thisRef = function () {
      const ref = path.scope.generateDeclaredUidIdentifier("this");
      maxGuaranteedSuperBeforeIndex++;
      thisRef = () => t.cloneNode(ref);
      return ref;
    };
    const buildAssertThisInitialized = function () {
      return t.callExpression(file.addHelper("assertThisInitialized"), [thisRef()]);
    };
    const bareSupers = [];
    path.traverse(visitors.environmentVisitor({
      Super(path) {
        const {
          node,
          parentPath
        } = path;
        if (parentPath.isCallExpression({
          callee: node
        })) {
          bareSupers.unshift(parentPath);
        }
      }
    }));
    for (const bareSuper of bareSupers) {
      wrapSuperCall(bareSuper, classState.superName, thisRef, constructorBody);
      if (maxGuaranteedSuperBeforeIndex >= 0) {
        let lastParentPath;
        bareSuper.find(function (parentPath) {
          if (parentPath === constructorBody) {
            maxGuaranteedSuperBeforeIndex = Math.min(maxGuaranteedSuperBeforeIndex, lastParentPath.key);
            return true;
          }
          const {
            type
          } = parentPath;
          switch (type) {
            case "ExpressionStatement":
            case "SequenceExpression":
            case "AssignmentExpression":
            case "BinaryExpression":
            case "MemberExpression":
            case "CallExpression":
            case "NewExpression":
            case "VariableDeclarator":
            case "VariableDeclaration":
            case "BlockStatement":
            case "ArrayExpression":
            case "ObjectExpression":
            case "ObjectProperty":
            case "TemplateLiteral":
              lastParentPath = parentPath;
              return false;
            default:
              if (type === "LogicalExpression" && parentPath.node.left === lastParentPath.node || parentPath.isConditional() && parentPath.node.test === lastParentPath.node || type === "OptionalCallExpression" && parentPath.node.callee === lastParentPath.node || type === "OptionalMemberExpression" && parentPath.node.object === lastParentPath.node) {
                lastParentPath = parentPath;
                return false;
              }
          }
          maxGuaranteedSuperBeforeIndex = -1;
          return true;
        });
      }
    }
    const guaranteedCalls = new Set();
    for (const thisPath of classState.superThises) {
      const {
        node,
        parentPath
      } = thisPath;
      if (parentPath.isMemberExpression({
        object: node
      })) {
        thisPath.replaceWith(thisRef());
        continue;
      }
      let thisIndex;
      thisPath.find(function (parentPath) {
        if (parentPath.parentPath === constructorBody) {
          thisIndex = parentPath.key;
          return true;
        }
        return false;
      });
      let exprPath = thisPath.parentPath.isSequenceExpression() ? thisPath.parentPath : thisPath;
      if (exprPath.listKey === "arguments" && (exprPath.parentPath.isCallExpression() || exprPath.parentPath.isOptionalCallExpression())) {
        exprPath = exprPath.parentPath;
      } else {
        exprPath = null;
      }
      if (maxGuaranteedSuperBeforeIndex !== -1 && thisIndex > maxGuaranteedSuperBeforeIndex || guaranteedCalls.has(exprPath)) {
        thisPath.replaceWith(thisRef());
      } else {
        if (exprPath) {
          guaranteedCalls.add(exprPath);
        }
        thisPath.replaceWith(buildAssertThisInitialized());
      }
    }
    let wrapReturn;
    if (isLoose) {
      wrapReturn = returnArg => {
        const thisExpr = buildAssertThisInitialized();
        return returnArg ? t.logicalExpression("||", returnArg, thisExpr) : thisExpr;
      };
    } else {
      wrapReturn = returnArg => {
        const returnParams = [thisRef()];
        if (returnArg != null) {
          returnParams.push(returnArg);
        }
        return t.callExpression(file.addHelper("possibleConstructorReturn"), returnParams);
      };
    }
    const bodyPaths = constructorBody.get("body");
    const guaranteedSuperBeforeFinish = maxGuaranteedSuperBeforeIndex !== -1 && maxGuaranteedSuperBeforeIndex < bodyPaths.length;
    if (!bodyPaths.length || !bodyPaths.pop().isReturnStatement()) {
      constructorBody.pushContainer("body", t.returnStatement(guaranteedSuperBeforeFinish ? thisRef() : buildAssertThisInitialized()));
    }
    for (const returnPath of classState.superReturns) {
      returnPath.get("argument").replaceWith(wrapReturn(returnPath.node.argument));
    }
  }
  function pushMethod(node, wrapped) {
    if (node.kind === "method") {
      if (processMethod(node)) return;
    }
    const placement = node.static ? "static" : "instance";
    const methods = classState.methods[placement];
    const descKey = node.kind === "method" ? "value" : node.kind;
    const key = t.isNumericLiteral(node.key) || t.isBigIntLiteral(node.key) ? t.stringLiteral(String(node.key.value)) : t.toComputedKey(node);
    methods.hasComputed = !t.isStringLiteral(key);
    const fn = wrapped ?? t.toExpression(node);
    let descriptor;
    if (!methods.hasComputed && methods.map.has(key.value)) {
      descriptor = methods.map.get(key.value);
      descriptor[descKey] = fn;
      if (descKey === "value") {
        descriptor.get = null;
        descriptor.set = null;
      } else {
        descriptor.value = null;
      }
    } else {
      descriptor = {
        key: key,
        [descKey]: fn
      };
      methods.list.push(descriptor);
      if (!methods.hasComputed) {
        methods.map.set(key.value, descriptor);
      }
    }
  }
  function processMethod(node) {
    if (assumptions.setClassMethods && !node.decorators) {
      let {
        classRef
      } = classState;
      if (!node.static) {
        insertProtoAliasOnce();
        classRef = classState.protoAlias;
      }
      const methodName = t.memberExpression(t.cloneNode(classRef), node.key, node.computed || t.isLiteral(node.key));
      const func = t.functionExpression(node.id, node.params, node.body, node.generator, node.async);
      t.inherits(func, node);
      const expr = t.expressionStatement(t.assignmentExpression("=", methodName, func));
      t.inheritsComments(expr, node);
      classState.body.push(expr);
      return true;
    }
    return false;
  }
  function insertProtoAliasOnce() {
    if (classState.protoAlias === null) {
      classState.protoAlias = scope.generateUidIdentifier("proto");
      const classProto = t.memberExpression(classState.classRef, t.identifier("prototype"));
      const protoDeclaration = t.variableDeclaration("var", [t.variableDeclarator(classState.protoAlias, classProto)]);
      classState.body.push(protoDeclaration);
    }
  }
  function pushInheritsToBody() {
    if (!classState.superName) return;
    classState.body.unshift(t.expressionStatement(t.callExpression(file.addHelper(isLoose ? "inheritsLoose" : "inherits"), [t.cloneNode(classState.classRef), t.cloneNode(classState.superName)])));
  }
  function extractDynamicKeys() {
    const node = path.node;
    const {
      dynamicKeys
    } = classState;
    for (const elem of node.body.body) {
      if (!t.isClassMethod(elem) || !elem.computed) continue;
      if (scope.isPure(elem.key, true)) continue;
      const id = scope.generateUidIdentifierBasedOnNode(elem.key);
      dynamicKeys.set(id.name, elem.key);
      elem.key = id;
    }
  }
  function setupClosureParamsArgs() {
    const superName = classState.superName;
    const {
      dynamicKeys
    } = classState;
    const closureParams = [];
    const closureArgs = [];
    if (superName) {
      let arg = t.cloneNode(superName);
      if (t.isIdentifier(superName) && builtinClasses.has(superName.name) && !scope.hasBinding(superName.name, true)) {
        arg = t.callExpression(file.addHelper("wrapNativeSuper"), [arg]);
        annotateAsPure(arg);
      }
      const param = scope.generateUidIdentifierBasedOnNode(superName);
      closureParams.push(param);
      closureArgs.push(arg);
      classState.superName = t.cloneNode(param);
    }
    for (const [name, value] of dynamicKeys) {
      closureParams.push(t.identifier(name));
      closureArgs.push(value);
    }
    return {
      closureParams,
      closureArgs
    };
  }
  function classTransformer(path) {
    const node = path.node;
    classState.superName = node.superClass;
    classState.classRef = node.id ? t.identifier(node.id.name) : scope.generateUidIdentifier("class");
    const {
      classRef
    } = classState;
    const constructorBody = t.blockStatement([]);
    classState.construct = t.inherits(t.functionDeclaration(t.cloneNode(classRef), [], constructorBody), node);
    extractDynamicKeys();
    const {
      body
    } = classState;
    const {
      closureParams,
      closureArgs
    } = setupClosureParamsArgs();
    maybeCreateConstructor();
    pushBody();
    verifyConstructor();
    pushDescriptors();
    if (classState.userConstructorPath) {
      const {
        node
      } = classState.userConstructorPath;
      constructorBody.body.push(...node.body.body);
      constructorBody.directives = node.body.directives;
      t.inherits(classState.construct, node);
      t.inherits(constructorBody, node.body);
    }
    if (!assumptions.noClassCalls) {
      classState.construct.body.body.unshift(t.expressionStatement(t.callExpression(file.addHelper("classCallCheck"), [t.thisExpression(), t.cloneNode(classState.classRef)])));
    }
    const isStrict = path.isInStrictMode();
    let constructorOnly = body.length === 0;
    if (constructorOnly && !isStrict) {
      constructorOnly = classState.construct.params.every(param => t.isIdentifier(param));
    }
    const directives = constructorOnly ? classState.construct.body.directives : [];
    if (!isStrict) {
      directives.push(t.directive(t.directiveLiteral("use strict")));
    }
    if (constructorOnly) {
      const expr = t.toExpression(classState.construct);
      return isLoose ? expr : createClassHelper([expr]);
    }
    if (!classState.pushedCreateClass) {
      body.push(t.returnStatement(isLoose ? t.cloneNode(classState.classRef) : createClassHelper([t.cloneNode(classState.classRef)])));
    }
    body.unshift(classState.construct);
    const container = t.arrowFunctionExpression(closureParams, t.blockStatement(body, directives));
    return t.callExpression(container, closureArgs);
  }
  return classTransformer(path);
}