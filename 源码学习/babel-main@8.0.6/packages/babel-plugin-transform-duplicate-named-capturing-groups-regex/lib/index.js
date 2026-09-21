import { createRegExpFeaturePlugin } from "@babel/helper-create-regexp-features-plugin";
import { declare } from "@babel/helper-plugin-utils";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  const {
    runtime
  } = options;
  if (runtime !== undefined && typeof runtime !== "boolean") {
    throw new Error("The 'runtime' option must be boolean");
  }
  return createRegExpFeaturePlugin({
    name: "transform-duplicate-named-capturing-groups-regex",
    feature: "duplicateNamedCaptureGroups",
    options: {
      runtime
    }
  });
});