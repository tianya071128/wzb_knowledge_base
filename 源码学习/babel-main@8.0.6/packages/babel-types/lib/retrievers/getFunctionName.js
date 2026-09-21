import { isAssignmentExpression, isClassMethod, isIdentifier, isLiteral, isNullLiteral, isObjectMethod, isObjectProperty, isPrivateName, isRegExpLiteral, isTemplateLiteral, isVariableDeclarator } from "../validators/generated/index.js";
function getNameFromLiteralId(id) {
  if (isNullLiteral(id)) {
    return "null";
  }
  if (isRegExpLiteral(id)) {
    return `/${id.pattern}/${id.flags}`;
  }
  if (isTemplateLiteral(id)) {
    return id.quasis.map(quasi => quasi.value.raw).join("");
  }
  if (id.value !== undefined) {
    return String(id.value);
  }
  return null;
}
function getObjectMemberKey(node) {
  if (!node.computed || isLiteral(node.key)) {
    return node.key;
  }
  return null;
}
export default function getFunctionName(node, parent) {
  if ("id" in node && node.id) {
    return {
      name: node.id.name,
      originalNode: node.id
    };
  }
  let prefix = "";
  let id;
  if (isObjectProperty(parent, {
    value: node
  })) {
    id = getObjectMemberKey(parent);
  } else if (isObjectMethod(node) || isClassMethod(node)) {
    id = getObjectMemberKey(node);
    if (node.kind === "get") prefix = "get ";else if (node.kind === "set") prefix = "set ";
  } else if (isVariableDeclarator(parent) && parent.init === node) {
    id = parent.id;
  } else if (isAssignmentExpression(parent, {
    operator: "=",
    right: node
  })) {
    id = parent.left;
  }
  if (!id) return null;
  const name = isLiteral(id) ? getNameFromLiteralId(id) : isIdentifier(id) ? id.name : isPrivateName(id) ? id.id.name : null;
  if (name == null) return null;
  return {
    name: prefix + name,
    originalNode: id
  };
}