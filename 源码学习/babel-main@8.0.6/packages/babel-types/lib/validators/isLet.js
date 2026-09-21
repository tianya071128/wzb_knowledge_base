import { isVariableDeclaration } from "./generated/index.js";
export default function isLet(node) {
  return isVariableDeclaration(node) && node.kind !== "var";
}