import { types as t, template } from "@babel/core";
import { skipTransparentExprWrapperNodes, skipTransparentExprWrappers } from "@babel/helper-skip-transparent-expression-wrappers";
import { willPathCastToBoolean, findOutermostTransparentParent } from "./util.js";
const last = arr => arr[arr.length - 1];
function isSimpleMemberExpression(expression) {
  expression = skipTransparentExprWrapperNodes(expression);
  return t.isIdentifier(expression) || t.isSuper(expression) || t.isMemberExpression(expression) && !expression.computed && isSimpleMemberExpression(expression.object);
}
function needsMemoize(path) {
  let optionalPath = path;
  const {
    scope
  } = path;
  while (optionalPath.isOptionalMemberExpression() || optionalPath.isOptionalCallExpression()) {
    const {
      node
    } = optionalPath;
    const childPath = skipTransparentExprWrappers(optionalPath.isOptionalMemberExpression() ? optionalPath.get("object") : optionalPath.get("callee"));
    if (node.optional) {
      return !scope.isStatic(childPath.node);
    }
    optionalPath = childPath;
  }
}
const NULLISH_CHECK = template.expression(`%%check%% === null || %%ref%% === void 0`);
const NULLISH_CHECK_NO_DDA = template.expression(`%%check%% == null`);
const NULLISH_CHECK_NEG = template.expression(`%%check%% !== null && %%ref%% !== void 0`);
const NULLISH_CHECK_NO_DDA_NEG = template.expression(`%%check%% != null`);
export function transformOptionalChain(path, {
  pureGetters,
  noDocumentAll
}, replacementPath, ifNullish, wrapLast) {
  const {
    scope
  } = path;
  if (scope.path.isPattern() && needsMemoize(path)) {
    replacementPath.replaceWith(template.expression.ast`(() => ${replacementPath.node})()`);
    return;
  }
  const optionals = [];
  let optionalPath = path;
  while (optionalPath.isOptionalMemberExpression() || optionalPath.isOptionalCallExpression()) {
    const {
      node
    } = optionalPath;
    if (node.optional) {
      optionals.push(node);
    }
    if (optionalPath.isOptionalMemberExpression()) {
      optionalPath.node.type = "MemberExpression";
      optionalPath = skipTransparentExprWrappers(optionalPath.get("object"));
    } else if (optionalPath.isOptionalCallExpression()) {
      optionalPath.node.type = "CallExpression";
      optionalPath = skipTransparentExprWrappers(optionalPath.get("callee"));
    }
  }
  if (optionals.length === 0) {
    return;
  }
  const checks = [];
  let tmpVar;
  for (let i = optionals.length - 1; i >= 0; i--) {
    const node = optionals[i];
    const isCall = t.isCallExpression(node);
    const chainWithTypes = isCall ? node.callee : node.object;
    const chain = skipTransparentExprWrapperNodes(chainWithTypes);
    let ref;
    let check;
    if (isCall && t.isIdentifier(chain, {
      name: "eval"
    })) {
      check = ref = chain;
      node.callee = t.sequenceExpression([t.numericLiteral(0), ref]);
    } else if (pureGetters && isCall && isSimpleMemberExpression(chain)) {
      check = ref = node.callee;
    } else if (scope.isStatic(chain)) {
      check = ref = chainWithTypes;
    } else {
      if (!tmpVar || isCall) {
        tmpVar = scope.generateUidIdentifierBasedOnNode(chain);
        scope.push({
          id: t.cloneNode(tmpVar)
        });
      }
      ref = tmpVar;
      check = t.assignmentExpression("=", t.cloneNode(tmpVar), chainWithTypes);
      if (isCall) {
        node.callee = ref;
      } else {
        node.object = ref;
      }
    }
    if (isCall && t.isMemberExpression(chain)) {
      if (pureGetters && isSimpleMemberExpression(chain)) {
        node.callee = chainWithTypes;
      } else {
        const {
          object
        } = chain;
        let context;
        if (t.isSuper(object)) {
          context = t.thisExpression();
        } else {
          const memoized = scope.maybeGenerateMemoised(object);
          if (memoized) {
            context = memoized;
            chain.object = t.assignmentExpression("=", memoized, object);
          } else {
            context = object;
          }
        }
        node.arguments.unshift(t.cloneNode(context));
        node.callee = t.memberExpression(node.callee, t.identifier("call"));
      }
    }
    const data = {
      check: t.cloneNode(check),
      ref: t.cloneNode(ref)
    };
    Object.defineProperty(data, "ref", {
      enumerable: false
    });
    checks.push(data);
  }
  let result = replacementPath.node;
  if (wrapLast) result = wrapLast(result);
  const ifNullishBoolean = t.isBooleanLiteral(ifNullish);
  const ifNullishFalse = ifNullishBoolean && ifNullish.value === false;
  const ifNullishVoid = !ifNullishBoolean && t.isUnaryExpression(ifNullish, {
    operator: "void"
  });
  const isEvaluationValueIgnored = t.isExpressionStatement(replacementPath.parent) && !replacementPath.isCompletionRecord() || t.isSequenceExpression(replacementPath.parent) && last(replacementPath.parent.expressions) !== replacementPath.node;
  const tpl = ifNullishFalse ? noDocumentAll ? NULLISH_CHECK_NO_DDA_NEG : NULLISH_CHECK_NEG : noDocumentAll ? NULLISH_CHECK_NO_DDA : NULLISH_CHECK;
  const logicalOp = ifNullishFalse ? "&&" : "||";
  const check = checks.map(tpl).reduce((expr, check) => t.logicalExpression(logicalOp, expr, check));
  replacementPath.replaceWith(ifNullishBoolean || ifNullishVoid && isEvaluationValueIgnored ? t.logicalExpression(logicalOp, check, result) : t.conditionalExpression(check, ifNullish, result));
}
export function transform(path, assumptions) {
  const {
    scope
  } = path;
  const maybeWrapped = findOutermostTransparentParent(path);
  const {
    parentPath
  } = maybeWrapped;
  if (parentPath.isUnaryExpression({
    operator: "delete"
  })) {
    transformOptionalChain(path, assumptions, parentPath, t.booleanLiteral(true));
  } else {
    let wrapLast;
    if (parentPath.isCallExpression({
      callee: maybeWrapped.node
    }) && path.isOptionalMemberExpression()) {
      wrapLast = replacement => {
        const object = skipTransparentExprWrapperNodes(replacement.object);
        let baseRef;
        if (!assumptions.pureGetters || !isSimpleMemberExpression(object)) {
          baseRef = scope.maybeGenerateMemoised(object);
          if (baseRef) {
            replacement.object = t.assignmentExpression("=", baseRef, object);
          }
        }
        return t.callExpression(t.memberExpression(replacement, t.identifier("bind")), [t.cloneNode(baseRef ?? object)]);
      };
    }
    transformOptionalChain(path, assumptions, path, willPathCastToBoolean(maybeWrapped) ? t.booleanLiteral(false) : t.buildUndefinedNode(), wrapLast);
  }
}