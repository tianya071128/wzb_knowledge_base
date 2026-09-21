import { skipTransparentExprWrappers } from "@babel/helper-skip-transparent-expression-wrappers";
export function isPathSimpleArrayWithLength(path, N) {
  if (!path.isArrayExpression()) {
    return false;
  }
  const elementPaths = path.get("elements");
  return elementPaths.length === N && elementPaths.every(elementPath => elementPath.node && !elementPath.isSpreadElement()) && !path.node.extra?.trailingComma;
}
export function shouldTransform(path) {
  const elementPaths = path.get("elements");
  const elementPathsLength = elementPaths.length;
  if (elementPathsLength > 0 && elementPaths[elementPathsLength - 1].isRestElement()) {
    const {
      parentPath
    } = path;
    const rhsPath = parentPath.isVariableDeclarator() ? parentPath.get("init") : parentPath.isAssignmentExpression() ? parentPath.get("right") : null;
    if (rhsPath?.node && isPathSimpleArrayWithLength(skipTransparentExprWrappers(rhsPath), elementPathsLength)) {
      return rhsPath;
    }
  }
  return false;
}