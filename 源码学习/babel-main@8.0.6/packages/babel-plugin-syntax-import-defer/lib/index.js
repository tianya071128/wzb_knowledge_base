import { declare } from "@babel/helper-plugin-utils";
export default declare(api => {
  api.assertVersion("8.0.6");
  return {
    name: "syntax-import-defer",
    manipulateOptions(_, parserOpts) {
      parserOpts.plugins.push("deferredImportEvaluation");
    }
  };
});