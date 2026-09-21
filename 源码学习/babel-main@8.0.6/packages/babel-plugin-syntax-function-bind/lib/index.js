import { declare } from "@babel/helper-plugin-utils";
export default declare(api => {
  api.assertVersion("8.0.6");
  return {
    name: "syntax-function-bind",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("functionBind");
    }
  };
});