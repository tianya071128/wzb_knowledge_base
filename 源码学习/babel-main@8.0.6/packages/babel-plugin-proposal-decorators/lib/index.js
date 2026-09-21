import { declare } from "@babel/helper-plugin-utils";
import syntaxDecorators from "@babel/plugin-syntax-decorators";
import { createClassFeaturePlugin, FEATURES } from "@babel/helper-create-class-features-plugin";
import legacyVisitor from "./transformer-legacy.js";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  const {
    version
  } = options;
  if (version === "legacy") {
    return {
      name: "proposal-decorators",
      inherits: syntaxDecorators,
      visitor: legacyVisitor
    };
  } else if (!version || version === "2023-11") {
    api.assertVersion("8.0.6");
    return createClassFeaturePlugin({
      name: "proposal-decorators",
      api,
      feature: FEATURES.decorators,
      inherits: syntaxDecorators,
      decoratorVersion: version
    });
  } else {
    throw new Error("The '.version' option must be one of 'legacy' or '2023-11'.");
  }
});