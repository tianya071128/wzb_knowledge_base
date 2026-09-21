import { declarePreset } from "@babel/helper-plugin-utils";
import transformFlowStripTypes from "@babel/plugin-transform-flow-strip-types";
import normalizeOptions from "./normalize-options.js";
export default declarePreset((api, opts) => {
  api.assertVersion("8.0.6");
  const {
    all,
    ignoreExtensions = false,
    experimental_useHermesParser: useHermesParser = false
  } = normalizeOptions(opts);
  const plugins = [[transformFlowStripTypes, {
    all
  }]];
  if (useHermesParser) {
    plugins.unshift("babel-plugin-syntax-hermes-parser");
  }
  if (ignoreExtensions) {
    return {
      plugins
    };
  }
  return {
    overrides: [{
      test: filename => filename == null || !/\.tsx?$/.test(filename),
      plugins
    }]
  };
});