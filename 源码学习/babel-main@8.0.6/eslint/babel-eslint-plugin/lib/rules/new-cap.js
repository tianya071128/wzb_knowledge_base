import * as ruleComposer from "../rule-composer.js";
import { builtinRules } from "eslint/use-at-your-own-risk";
const rule = builtinRules.get("new-cap");
function isDecorator(node) {
  return node.parent.type === "Decorator";
}
export default ruleComposer.filterReports(rule, problem => !isDecorator(problem.node));