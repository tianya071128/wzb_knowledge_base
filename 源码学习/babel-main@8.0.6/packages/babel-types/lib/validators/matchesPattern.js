import { isIdentifier, isMetaProperty, isMemberExpression, isPrivateName, isStringLiteral, isSuper, isThisExpression } from "./generated/index.js";
function isMemberExpressionLike(node) {
  return isMemberExpression(node) || isMetaProperty(node);
}
export default function matchesPattern(member, match, allowPartial) {
  if (!isMemberExpressionLike(member)) return false;
  const parts = Array.isArray(match) ? match : match.split(".");
  const nodes = [];
  let node;
  for (node = member; isMemberExpressionLike(node); node = node.object ?? node.meta) {
    nodes.push(node.property);
  }
  nodes.push(node);
  if (nodes.length < parts.length) return false;
  if (!allowPartial && nodes.length > parts.length) return false;
  for (let i = 0, j = nodes.length - 1; i < parts.length; i++, j--) {
    const node = nodes[j];
    let value;
    if (isIdentifier(node)) {
      value = node.name;
    } else if (isStringLiteral(node)) {
      value = node.value;
    } else if (isThisExpression(node)) {
      value = "this";
    } else if (isSuper(node)) {
      value = "super";
    } else if (isPrivateName(node)) {
      value = "#" + node.id.name;
    } else {
      return false;
    }
    if (parts[i] !== value) return false;
  }
  return true;
}