import { declare } from "@babel/helper-plugin-utils";
import { types as t, template } from "@babel/core";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  if ("loose" in options) {
    console.warn("@babel/plugin-transform-nullish-coalescing-operator: The 'loose' option has been deprecated, " + "use the `noDocumentAll` assumption instead (https://babeljs.io/assumptions).");
  }
  const noDocumentAll = api.assumption("noDocumentAll") ?? options.loose;
  const pureGetters = api.assumption("pureGetters") ?? false;
  return {
    name: "transform-nullish-coalescing-operator",
    manipulateOptions: undefined,
    visitor: {
      LogicalExpression(path) {
        const {
          node,
          scope
        } = path;
        if (node.operator !== "??") {
          return;
        }
        let ref;
        let assignment;
        if (pureGetters && scope.path.isPattern() && t.isMemberExpression(node.left) && !node.left.computed && t.isIdentifier(node.left.object) && t.isIdentifier(node.left.property) || t.isIdentifier(node.left) && (pureGetters || scope.hasBinding(node.left.name))) {
          ref = node.left;
          assignment = t.cloneNode(node.left);
        } else if (scope.path.isPattern()) {
          path.replaceWith(template.statement.ast`(() => ${path.node})()`);
          return;
        } else {
          ref = scope.generateUidIdentifierBasedOnNode(node.left);
          scope.push({
            id: t.cloneNode(ref)
          });
          assignment = t.assignmentExpression("=", ref, node.left);
        }
        path.replaceWith(t.conditionalExpression(noDocumentAll ? t.binaryExpression("!=", assignment, t.nullLiteral()) : t.logicalExpression("&&", t.binaryExpression("!==", assignment, t.nullLiteral()), t.binaryExpression("!==", t.cloneNode(ref), t.buildUndefinedNode())), t.cloneNode(ref), node.right));
      }
    }
  };
});