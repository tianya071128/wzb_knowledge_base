import * as ruleComposer from "../rule-composer.js";
import { builtinRules } from "eslint/use-at-your-own-risk";
const rule = builtinRules.get("no-unused-expressions");
function isFinalStatementInBlockStatement(node) {
  const parent = node.parent;
  return /^(?:If|Expression)Statement$/.test(node.type) && parent.type === "BlockStatement" && parent.body[parent.body.length - 1] === node;
}
function isInDoStatement(node) {
  if (!node) return false;
  if (node.type === "DoExpression") return true;
  if (node.type === "IfStatement" && node.parent && node.parent.type === "IfStatement") {
    return isInDoStatement(node.parent);
  }
  if (isFinalStatementInBlockStatement(node)) {
    return isInDoStatement(node.parent.parent);
  }
  return false;
}
export default ruleComposer.filterReports(rule, problem => !isInDoStatement(problem.node));
//# sourceMappingURL=no-unused-expressions.js.map
