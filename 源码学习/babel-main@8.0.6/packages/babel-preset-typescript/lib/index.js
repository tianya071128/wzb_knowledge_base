import { declarePreset } from "@babel/helper-plugin-utils";
import transformTypeScript from "@babel/plugin-transform-typescript";
import transformModulesCommonJS from "@babel/plugin-transform-modules-commonjs";
import normalizeOptions from "./normalize-options.js";
import pluginRewriteTSImports from "./plugin-rewrite-ts-imports.js";
export default declarePreset((api, opts) => {
  api.assertVersion("8.0.6");
  const {
    ignoreExtensions,
    allowNamespaces,
    disallowAmbiguousJSXLike,
    jsxPragma,
    jsxPragmaFrag,
    onlyRemoveTypeImports,
    optimizeConstEnums,
    rewriteImportExtensions
  } = normalizeOptions(opts);
  const pluginOptions = disallowAmbiguousJSXLike => ({
    allowNamespaces,
    disallowAmbiguousJSXLike,
    jsxPragma,
    jsxPragmaFrag,
    onlyRemoveTypeImports,
    optimizeConstEnums
  });
  const getPlugins = disallowAmbiguousJSXLike => {
    const tsPlugin = [transformTypeScript, pluginOptions(disallowAmbiguousJSXLike)];
    return [tsPlugin];
  };
  const disableExtensionDetect = ignoreExtensions;
  return {
    plugins: rewriteImportExtensions ? [pluginRewriteTSImports] : [],
    overrides: disableExtensionDetect ? [{
      plugins: getPlugins(disallowAmbiguousJSXLike)
    }] : [{
      test: filename => filename == null || filename.endsWith(".ts"),
      plugins: getPlugins(false)
    }, {
      test: filename => filename?.endsWith(".mts"),
      sourceType: "module",
      plugins: getPlugins(true)
    }, {
      test: filename => filename?.endsWith(".cts"),
      sourceType: "unambiguous",
      plugins: [[transformModulesCommonJS, {
        allowTopLevelThis: true
      }], [transformTypeScript, pluginOptions(true)]]
    }, {
      test: filename => filename?.endsWith(".tsx"),
      plugins: getPlugins(false)
    }]
  };
});