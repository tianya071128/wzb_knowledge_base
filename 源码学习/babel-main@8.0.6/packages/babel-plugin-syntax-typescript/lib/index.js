import { declare } from "@babel/helper-plugin-utils";
export default declare((api, opts) => {
  api.assertVersion("8.0.6");
  const {
    disallowAmbiguousJSXLike,
    dts
  } = opts;
  return {
    name: "syntax-typescript",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push(["typescript", {
        disallowAmbiguousJSXLike,
        dts
      }]);
    }
  };
});