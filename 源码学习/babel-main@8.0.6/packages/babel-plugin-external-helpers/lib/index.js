import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  if (Object.hasOwn(options, "whitelist")) {
    if (!Object.hasOwn(options, "allowlist")) {
      throw new Error("The 'whitelist' option has been renamed to 'allowlist'. " + "Please update your configuration.");
    }
  }
  const {
    helperVersion = "7.0.0-beta.0",
    allowlist = false
  } = options;
  if (allowlist !== false && (!Array.isArray(allowlist) || allowlist.some(w => typeof w !== "string"))) {
    throw new Error(".allowlist must be undefined, false, or an array of strings");
  }
  const helperAllowlist = allowlist ? new Set(allowlist) : null;
  return {
    name: "external-helpers",
    pre(file) {
      file.set("helperGenerator", name => {
        if (file.availableHelper && !file.availableHelper(name, helperVersion)) {
          return;
        }
        if (helperAllowlist && !helperAllowlist.has(name)) return;
        return t.memberExpression(t.identifier("babelHelpers"), t.identifier(name));
      });
    }
  };
});