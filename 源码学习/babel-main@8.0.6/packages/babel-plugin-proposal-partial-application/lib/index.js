import { declare } from "@babel/helper-plugin-utils";
import syntaxPartialApplication from "@babel/plugin-syntax-partial-application";
import { types as t } from "@babel/core";
export default declare(api => {
  api.assertVersion("8.0.6");
  function hasArgumentPlaceholder(node) {
    return node.arguments.some(arg => t.isArgumentPlaceholder(arg));
  }
  function unwrapArguments({
    arguments: args
  }, scope) {
    const init = [];
    for (let i = 0; i < args.length; i++) {
      const node = args[i];
      if (!t.isArgumentPlaceholder(node) && !t.isImmutable(node)) {
        const id = scope.generateUidIdentifierBasedOnNode(node, "param");
        scope.push({
          id
        });
        if (t.isSpreadElement(node)) {
          init.push(t.assignmentExpression("=", t.cloneNode(id), t.arrayExpression([t.spreadElement(node.argument)])));
          node.argument = t.cloneNode(id);
        } else {
          init.push(t.assignmentExpression("=", t.cloneNode(id), node));
          args[i] = t.cloneNode(id);
        }
      }
    }
    return init;
  }
  function replacePlaceholders(node, scope) {
    const placeholders = [];
    const newArgs = [];
    node.arguments.forEach(arg => {
      if (t.isArgumentPlaceholder(arg)) {
        const id = scope.generateUid("_argPlaceholder");
        placeholders.push(t.identifier(id));
        newArgs.push(t.identifier(id));
      } else {
        newArgs.push(arg);
      }
    });
    return [placeholders, newArgs];
  }
  return {
    name: "proposal-partial-application",
    inherits: syntaxPartialApplication,
    visitor: {
      CallExpression(path) {
        if (!hasArgumentPlaceholder(path.node)) {
          return;
        }
        const {
          node,
          scope
        } = path;
        const functionLVal = path.scope.generateUidIdentifierBasedOnNode(node.callee);
        const sequenceParts = [];
        const argsInitializers = unwrapArguments(node, scope);
        const [placeholdersParams, args] = replacePlaceholders(node, scope);
        scope.push({
          id: functionLVal
        });
        const callee = node.callee;
        if (t.isMemberExpression(callee)) {
          const {
            property,
            object: calleeObject
          } = callee;
          let object = calleeObject,
            receiverLVal;
          if (t.isSuper(calleeObject)) {
            receiverLVal = t.thisExpression();
          } else if (scope.isStatic(calleeObject)) {
            receiverLVal = t.cloneNode(calleeObject);
          } else {
            receiverLVal = path.scope.generateUidIdentifierBasedOnNode(calleeObject);
            scope.push({
              id: t.cloneNode(receiverLVal)
            });
            sequenceParts.push(t.assignmentExpression("=", t.cloneNode(receiverLVal), t.cloneNode(calleeObject)));
            object = t.cloneNode(receiverLVal);
          }
          if (t.isThisExpression(receiverLVal)) {
            const thisExpressionId = path.scope.generateUidIdentifierBasedOnNode(receiverLVal);
            scope.push({
              id: t.cloneNode(thisExpressionId)
            });
            sequenceParts.push(t.assignmentExpression("=", t.cloneNode(thisExpressionId), receiverLVal));
            receiverLVal = thisExpressionId;
          }
          sequenceParts.push(t.assignmentExpression("=", t.cloneNode(functionLVal), t.memberExpression(object, property)), ...argsInitializers, t.functionExpression(t.isIdentifier(property) ? t.cloneNode(property) : path.scope.generateUidIdentifierBasedOnNode(property), placeholdersParams, t.blockStatement([t.returnStatement(t.callExpression(t.memberExpression(t.cloneNode(functionLVal), t.identifier("call")), [receiverLVal, ...args]))], []), false, false));
        } else {
          sequenceParts.push(t.assignmentExpression("=", t.cloneNode(functionLVal), node.callee), ...argsInitializers, t.functionExpression(t.isIdentifier(node.callee) ? t.cloneNode(node.callee) : path.scope.generateUidIdentifierBasedOnNode(node.callee), placeholdersParams, t.blockStatement([t.returnStatement(t.callExpression(t.cloneNode(functionLVal), args))], []), false, false));
        }
        path.replaceWith(t.sequenceExpression(sequenceParts));
      }
    }
  };
});