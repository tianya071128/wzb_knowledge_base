import getReferenceOrigin from "./get-reference-origin.js";
import isDefaultExport from "./is-default-export.js";
export default function isBabelPluginFactory(node, scope) {
  const {
    parent
  } = node;
  if (parent.type === "CallExpression") {
    const calleeOrigin = getReferenceOrigin(parent.callee, scope);
    return !!(calleeOrigin?.kind === "import" && calleeOrigin.name === "declare" && calleeOrigin.source === "@babel/helper-plugin-utils");
  }
  return isDefaultExport(parent);
}