import { createRegExpFeaturePlugin } from "@babel/helper-create-regexp-features-plugin";
import { declare } from "@babel/helper-plugin-utils";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  const {
    useUnicodeFlag = true
  } = options;
  if (typeof useUnicodeFlag !== "boolean") {
    throw new Error(".useUnicodeFlag must be a boolean, or undefined");
  }
  return createRegExpFeaturePlugin({
    name: "transform-unicode-property-regex",
    feature: "unicodePropertyEscape",
    options: {
      useUnicodeFlag
    }
  });
});