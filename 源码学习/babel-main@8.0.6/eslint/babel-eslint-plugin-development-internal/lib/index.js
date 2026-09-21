import noExtraneousDependencies from "./rules/no-extraneous-dependencies.js";
import reportErrorMessageFormat from "./rules/report-error-message-format.js";
const meta = {
  name: "@babel/eslint-plugin-development-internal",
  version: "8.0.6"
};
const rules = {
  "no-extraneous-dependencies": noExtraneousDependencies,
  "report-error-message-format": reportErrorMessageFormat
};
export default {
  meta,
  rules
};