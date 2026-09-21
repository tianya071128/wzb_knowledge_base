import noDeprecatedClone from "./rules/no-deprecated-clone.js";
import noUndefinedIdentifier from "./rules/no-undefined-identifier.js";
import pluginName from "./rules/plugin-name.js";
const meta = {
  name: "@babel/eslint-plugin-development",
  version: "8.0.6"
};
const rules = {
  "no-deprecated-clone": noDeprecatedClone,
  "no-undefined-identifier": noUndefinedIdentifier,
  "plugin-name": pluginName
};
export default {
  meta,
  rules
};