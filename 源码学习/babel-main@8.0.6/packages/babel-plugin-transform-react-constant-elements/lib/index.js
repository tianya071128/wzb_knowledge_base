import { declare } from "@babel/helper-plugin-utils";
import { types as t, template } from "@babel/core";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  const {
    allowMutablePropsOnTags
  } = options;
  if (allowMutablePropsOnTags != null && !Array.isArray(allowMutablePropsOnTags)) {
    throw new Error(".allowMutablePropsOnTags must be an array, null, or undefined.");
  }
  const HOISTED = new WeakMap();
  function declares(node, scope) {
    if (t.isJSXIdentifier(node, {
      name: "this"
    }) || t.isJSXIdentifier(node, {
      name: "arguments"
    }) || t.isJSXIdentifier(node, {
      name: "super"
    }) || t.isJSXIdentifier(node, {
      name: "new"
    })) {
      const {
        path
      } = scope;
      return path.isFunctionParent() && !path.isArrowFunctionExpression();
    }
    return scope.hasOwnBinding(node.name);
  }
  function isHoistingScope({
    path
  }) {
    return path.isFunctionParent() || path.isLoop() || path.isProgram();
  }
  function getHoistingScope(scope) {
    while (!isHoistingScope(scope)) scope = scope.parent;
    return scope;
  }
  const targetScopeVisitor = {
    ReferencedIdentifier(path, state) {
      const {
        node
      } = path;
      let {
        scope
      } = path;
      while (scope !== state.jsxScope) {
        if (declares(node, scope)) return;
        scope = scope.parent;
      }
      while (scope) {
        if (scope === state.targetScope) return;
        if (declares(node, scope)) break;
        scope = scope.parent;
      }
      state.targetScope = getHoistingScope(scope);
    }
  };
  const immutabilityVisitor = {
    enter(path, state) {
      const stop = () => {
        state.isImmutable = false;
        path.stop();
      };
      const skip = () => {
        path.skip();
      };
      if (path.isJSXClosingElement()) {
        skip();
        return;
      }
      if (path.isJSXIdentifier({
        name: "ref"
      }) && path.parentPath.isJSXAttribute({
        name: path.node
      })) {
        stop();
        return;
      }
      if (path.isJSXIdentifier() || path.isJSXMemberExpression() || path.isJSXNamespacedName() || path.isImmutable()) {
        return;
      }
      if (path.isIdentifier()) {
        const binding = path.scope.getBinding(path.node.name);
        if (binding?.constant) return;
      }
      const {
        mutablePropsAllowed
      } = state;
      if (mutablePropsAllowed && path.isFunction()) {
        path.traverse(targetScopeVisitor, state);
        skip();
        return;
      }
      if (!path.isPure()) {
        stop();
        return;
      }
      const expressionResult = path.evaluate();
      if (expressionResult.confident) {
        const {
          value
        } = expressionResult;
        if (mutablePropsAllowed || value === null || typeof value !== "object" && typeof value !== "function") {
          skip();
          return;
        }
      } else if (expressionResult.deopt?.isIdentifier()) {
        return;
      }
      stop();
    }
  };
  const hoistingVisitor = {
    ...immutabilityVisitor,
    ...targetScopeVisitor
  };
  return {
    name: "transform-react-constant-elements",
    visitor: api.traverse.explode({
      "JSXElement|JSXFragment"(path) {
        if (HOISTED.has(path.node)) return;
        let mutablePropsAllowed = false;
        let name;
        if (path.isJSXElement()) {
          name = path.node.openingElement.name;
          if (allowMutablePropsOnTags != null) {
            let lastSegment = name;
            while (t.isJSXMemberExpression(lastSegment)) {
              lastSegment = lastSegment.property;
            }
            const elementName = lastSegment.name;
            mutablePropsAllowed = allowMutablePropsOnTags.includes(elementName);
          }
        } else {
          name = path.node;
        }
        let jsxScope;
        let current = path;
        while (!jsxScope && current.parentPath.isJSX()) {
          current = current.parentPath;
          jsxScope = HOISTED.get(current.node);
        }
        jsxScope ??= path.scope;
        HOISTED.set(path.node, jsxScope);
        const visitorState = {
          isImmutable: true,
          mutablePropsAllowed,
          jsxScope,
          targetScope: path.scope.getProgramParent()
        };
        path.traverse(hoistingVisitor, visitorState);
        if (!visitorState.isImmutable) return;
        const {
          targetScope
        } = visitorState;
        for (let currentScope = jsxScope;;) {
          if (targetScope === currentScope) return;
          if (isHoistingScope(currentScope)) break;
          currentScope = currentScope.parent;
          if (!currentScope) {
            throw new Error("Internal @babel/plugin-transform-react-constant-elements error: " + "targetScope must be an ancestor of jsxScope. " + "This is a Babel bug, please report it.");
          }
        }
        const id = path.scope.generateUidBasedOnNode(name);
        targetScope.push({
          id: t.identifier(id)
        });
        HOISTED.set(path.node, targetScope);
        let replacement = template.expression.ast`
          ${t.identifier(id)} || (${t.identifier(id)} = ${path.node})
        `;
        if (path.parentPath.isJSXElement() || path.parentPath.isJSXAttribute() || path.parentPath.isJSXFragment()) {
          replacement = t.jsxExpressionContainer(replacement);
        }
        path.replaceWith(replacement);
      }
    })
  };
});