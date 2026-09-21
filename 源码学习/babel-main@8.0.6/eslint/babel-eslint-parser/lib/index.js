import normalizeESLintConfig from "./configuration.js";
import analyzeScope from "./analyze-scope.js";
import baseParse from "./parse.js";
import { getVisitorKeys } from "./ast-info.js";
export const meta = {
  name: "@babel/eslint-parser",
  version: "8.0.6"
};
export function parse(code, options = {}) {
  return baseParse(code, normalizeESLintConfig(options));
}
export function parseForESLint(code, options = {}) {
  const normalizedOptions = normalizeESLintConfig(options);
  const ast = baseParse(code, normalizedOptions);
  const scopeManager = analyzeScope(ast, normalizedOptions);
  return {
    ast,
    scopeManager,
    visitorKeys: getVisitorKeys()
  };
}
export default {
  meta,
  parse,
  parseForESLint
};