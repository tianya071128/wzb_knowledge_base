import { isAnyTypeAnnotation, isGenericTypeAnnotation, isUnionTypeAnnotation, isFlowBaseAnnotation, isIdentifier } from "../../validators/generated/index.js";
function getQualifiedName(node) {
  return isIdentifier(node) ? node.name : `${node.id.name}.${getQualifiedName(node.qualification)}`;
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
    if (isAnyTypeAnnotation(node)) {
      return [node];
    }
    if (isFlowBaseAnnotation(node)) {
      bases.set(node.type, node);
      continue;
    }
    if (isUnionTypeAnnotation(node)) {
      if (!typeGroups.has(node.types)) {
        nodes.push(...node.types);
        typeGroups.add(node.types);
      }
      continue;
    }
    if (isGenericTypeAnnotation(node)) {
      const name = getQualifiedName(node.id);
      if (generics.has(name)) {
        const existingTypeParameters = generics.get(name).typeParameters;
        if (existingTypeParameters) {
          if (node.typeParameters) {
            existingTypeParameters.params.push(...node.typeParameters.params);
            existingTypeParameters.params = removeTypeDuplicates(existingTypeParameters.params);
          }
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