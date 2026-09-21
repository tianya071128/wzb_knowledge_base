import { isVariableDeclaration } from "./generated/index.js";
export default function isVar(node) {
  return isVariableDeclaration(node) && node.kind === "var";
}