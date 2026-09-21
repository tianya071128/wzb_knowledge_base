import { types as t } from "@babel/core";
import traverse, { visitors } from "@babel/traverse";
let rewriteThisVisitor;
export default function rewriteThis(programPath) {
  if (!rewriteThisVisitor) {
    rewriteThisVisitor = visitors.environmentVisitor({
      ThisExpression(path) {
        path.replaceWith(t.buildUndefinedNode());
      }
    });
    rewriteThisVisitor.noScope = true;
  }
  traverse(programPath.node, rewriteThisVisitor);
}