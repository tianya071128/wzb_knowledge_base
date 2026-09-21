import { numericLiteral, unaryExpression } from "./generated/index.js";
export function buildUndefinedNode() {
  return unaryExpression("void", numericLiteral(0), true);
}