import { skipTransparentExprWrappers } from "@babel/helper-skip-transparent-expression-wrappers";
import { types as t } from "@babel/core";
function matchAffectedArguments(argumentNodes) {
  const spreadIndex = argumentNodes.findIndex(node => t.isSpreadElement(node));
  return spreadIndex >= 0 && spreadIndex !== argumentNodes.length - 1;
}
export function shouldTransform(path) {
  let optionalPath = path;
  const chains = [];
  for (;;) {
    if (optionalPath.isOptionalMemberExpression()) {
      chains.push(optionalPath.node);
      optionalPath = skipTransparentExprWrappers(optionalPath.get("object"));
    } else if (optionalPath.isOptionalCallExpression()) {
      chains.push(optionalPath.node);
      optionalPath = skipTransparentExprWrappers(optionalPath.get("callee"));
    } else {
      break;
    }
  }
  for (let i = 0; i < chains.length; i++) {
    const node = chains[i];
    if (t.isOptionalCallExpression(node) && matchAffectedArguments(node.arguments)) {
      if (node.optional) {
        return true;
      }
      const callee = chains[i + 1];
      if (t.isOptionalMemberExpression(callee, {
        optional: true
      })) {
        return true;
      }
    }
  }
  return false;
}