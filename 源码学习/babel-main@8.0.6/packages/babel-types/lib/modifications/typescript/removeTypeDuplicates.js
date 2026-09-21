import { isIdentifier, isThisExpression, isTSAnyKeyword, isTSTypeReference, isTSUnionType, isTSBaseType } from "../../validators/generated/index.js";
function getQualifiedName(node) {
  return isIdentifier(node) ? node.name : isThisExpression(node) ? "this" : `${node.right.name}.${getQualifiedName(node.left)}`;
}
export default function removeTypeDuplicates(nodesIn) {
  const nodes = Array.from(nodesIn);
  const generics = new Map();
  const bases = new Map();
  const typeGroups = new Set();
  const types = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;
    if (types.includes(node)) {
      continue;
    }
    if (isTSAnyKeyword(node)) {
      return [node];
    }
    if (isTSBaseType(node)) {
      bases.set(node.type, node);
      continue;
    }
    if (isTSUnionType(node)) {
      if (!typeGroups.has(node.types)) {
        nodes.push(...node.types);
        typeGroups.add(node.types);
      }
      continue;
    }
    const typeArgumentsKey = "typeArguments";
    if (isTSTypeReference(node) && node[typeArgumentsKey]) {
      const typeArguments = node[typeArgumentsKey];
      const name = getQualifiedName(node.typeName);
      if (generics.has(name)) {
        const existingTypeArguments = generics.get(name)[typeArgumentsKey];
        if (existingTypeArguments) {
          existingTypeArguments.params.push(...typeArguments.params);
          existingTypeArguments.params = removeTypeDuplicates(existingTypeArguments.params);
        }
      } else {
        generics.set(name, node);
      }
      continue;
    }
    types.push(node);
  }
  for (const [, baseType] of bases) {
    types.push(baseType);
  }
  for (const [, genericName] of generics) {
    types.push(genericName);
  }
  return types;
}