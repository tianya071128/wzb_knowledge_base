import { declare } from "@babel/helper-plugin-utils";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  const {
    all,
    enums
  } = options;
  if (typeof all !== "boolean" && all !== undefined) {
    throw new Error(".all must be a boolean, or undefined");
  }
  if (enums !== undefined) {
    throw new Error("The .enums option has been removed and it's now always enabled. Please remove it from your config.");
  }
  return {
    name: "syntax-flow",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push(["flow", {
        all
      }]);
    }
  };
});