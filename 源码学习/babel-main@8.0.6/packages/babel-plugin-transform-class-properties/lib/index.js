import { declare } from "@babel/helper-plugin-utils";
import { createClassFeaturePlugin, FEATURES } from "@babel/helper-create-class-features-plugin";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  return createClassFeaturePlugin({
    name: "transform-class-properties",
    api,
    feature: FEATURES.fields,
    loose: options.loose
  });
});