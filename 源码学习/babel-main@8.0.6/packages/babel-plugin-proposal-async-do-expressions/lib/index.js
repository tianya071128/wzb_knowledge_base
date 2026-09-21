import { declare } from "@babel/helper-plugin-utils";
export default declare(({
  types: t,
  assertVersion
}) => {
  assertVersion("8.0.6");
  return {
    name: "proposal-async-do-expressions",
    manipulateOptions: (_, parser) => parser.plugins.push("asyncDoExpressions", "doExpressions"),
    visitor: {
      DoExpression: {
        exit(path) {
          if (!path.node.async) {
            return;
          }
          path.scope.hoistVariables();
          const bodyPath = path.get("body");
          const completionRecords = bodyPath.getCompletionRecords();
          for (const p of completionRecords) {
            if (p.isExpressionStatement()) {
              p.replaceWith(t.returnStatement(p.node.expression));
            }
          }
          path.replaceWith(t.callExpression(t.arrowFunctionExpression([], bodyPath.node, true), []));
        }
      }
    }
  };
});