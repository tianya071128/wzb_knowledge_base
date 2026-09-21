import { types as t, traverse } from "@babel/core";
let iifeVisitor;
export const getIIFEVisitor = () => iifeVisitor ??= traverse.explode({
  "ReferencedIdentifier|BindingIdentifier"(path, state) {
    const {
      scope,
      node
    } = path;
    const {
      name
    } = node;
    if (name === "eval" || scope.getBinding(name) === state.scope.parent.getBinding(name) && state.scope.hasOwnBinding(name)) {
      state.needsOuterBinding = true;
      path.stop();
    }
  },
  "TypeAnnotation|TSTypeAnnotation|TypeParameterDeclaration|TSTypeParameterDeclaration": path => path.skip()
});
export function collectShadowedParamsNames(param, functionScope, shadowedParams) {
  for (const name of Object.keys(param.getBindingIdentifiers())) {
    const constantViolations = functionScope.bindings[name]?.constantViolations;
    if (constantViolations) {
      for (const redeclarator of constantViolations) {
        const node = redeclarator.node;
        switch (node.type) {
          case "VariableDeclarator":
            {
              if (node.init === null) {
                const declaration = redeclarator.parentPath;
                if (!declaration.parentPath.isFor() || declaration.parentPath.get("body") === declaration) {
                  redeclarator.remove();
                  break;
                }
              }
              shadowedParams.add(name);
              break;
            }
          case "FunctionDeclaration":
            shadowedParams.add(name);
            break;
        }
      }
    }
  }
}
export function buildScopeIIFE(shadowedParams, body) {
  const args = [];
  const params = [];
  for (const name of shadowedParams) {
    args.push(t.identifier(name));
    params.push(t.identifier(name));
  }
  return t.returnStatement(t.callExpression(t.arrowFunctionExpression(params, body), args));
}