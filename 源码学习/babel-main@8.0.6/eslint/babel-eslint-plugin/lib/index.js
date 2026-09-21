import newCap from "./rules/new-cap.js";
import noUndef from "./rules/no-undef.js";
import noUnusedExpressions from "./rules/no-unused-expressions.js";
const meta = {
  name: "@babel/eslint-plugin",
  version: "8.0.6"
};
const rules = {
  "new-cap": newCap,
  "no-undef": noUndef,
  "no-unused-expressions": noUnusedExpressions
};
const rulesConfig = {
  "new-cap": "off",
  "no-undef": "off",
  "no-unused-expressions": "off"
};
export default {
  meta,
  rules,
  rulesConfig
};