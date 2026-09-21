export default function shouldStoreRHSInTemporaryVariable(node) {
  if (!node) return false;
  if (node.type === "ArrayPattern") {
    const nonNullElements = node.elements.filter(element => element !== null && element.type !== "VoidPattern");
    if (nonNullElements.length > 1) return true;else return shouldStoreRHSInTemporaryVariable(nonNullElements[0]);
  } else if (node.type === "ObjectPattern") {
    const {
      properties
    } = node;
    if (properties.length > 1) return true;else if (properties.length === 0) return false;else {
      const firstProperty = properties[0];
      if (firstProperty.type === "ObjectProperty") {
        return shouldStoreRHSInTemporaryVariable(firstProperty.value);
      } else {
        return shouldStoreRHSInTemporaryVariable(firstProperty);
      }
    }
  } else if (node.type === "AssignmentPattern") {
    return shouldStoreRHSInTemporaryVariable(node.left);
  } else if (node.type === "RestElement") {
    if (node.argument.type === "Identifier") return true;
    return shouldStoreRHSInTemporaryVariable(node.argument);
  } else {
    return false;
  }
}