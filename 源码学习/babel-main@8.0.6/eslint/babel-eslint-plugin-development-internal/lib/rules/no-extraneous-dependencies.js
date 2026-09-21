import eslintPluginImport from "eslint-plugin-import";
const rule = eslintPluginImport.rules["no-extraneous-dependencies"];
const meta = rule.meta;
meta.schema[0].properties = {
  ...meta.schema[0].properties,
  allowlist: {
    type: "array",
    items: {
      type: "string"
    },
    description: "An array of package names to allow as extraneous dependencies. This is useful for packages that are privately defined on the root repo."
  }
};
function extractPackageNameFromErrorMessage(message) {
  const match = /^'(.+?)'/.exec(message);
  return match ? match[1] : null;
}
export default {
  meta: meta,
  create(context) {
    const options = context.options[0] || {};
    const allowlist = new Set(options.allowlist || []);
    const originalReport = context.report;
    return rule.create(Object.freeze(Object.create(context, {
      report: {
        enumerable: true,
        value(...args) {
          const message = args[1];
          if (typeof message === "string") {
            const packageName = extractPackageNameFromErrorMessage(message);
            if (packageName && allowlist.has(packageName)) {
              return;
            }
          }
          originalReport(...args);
        }
      }
    })));
  }
};
//# sourceMappingURL=no-extraneous-dependencies.js.map
