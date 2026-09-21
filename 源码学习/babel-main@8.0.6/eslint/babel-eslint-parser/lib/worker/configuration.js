import { loadPartialConfigAsync } from "@babel/core";
export function getParserPlugins(babelOptions) {
  const babelParserPlugins = babelOptions.parserOpts?.plugins ?? [];
  const estreeOptions = {
    classFeatures: true
  };
  for (const plugin of babelParserPlugins) {
    if (Array.isArray(plugin) && plugin[0] === "estree") {
      Object.assign(estreeOptions, plugin[1]);
      break;
    }
  }
  return [["estree", estreeOptions], ...babelParserPlugins];
}
function normalizeParserOptions(options) {
  return {
    sourceType: options.sourceType,
    filename: options.filePath,
    ...options.babelOptions,
    parserOpts: {
      ...(options.sourceType !== "commonjs" ? {
        allowReturnOutsideFunction: options.ecmaFeatures?.globalReturn ?? false
      } : {}),
      ...options.babelOptions.parserOpts,
      plugins: getParserPlugins(options.babelOptions),
      attachComment: false,
      ranges: true,
      tokens: true
    },
    caller: {
      name: "@babel/eslint-parser",
      ...options.babelOptions.caller
    }
  };
}
function validateResolvedConfig(config, options, parseOptions) {
  if (config !== null) {
    if (options.requireConfigFile !== false) {
      if (!config.hasFilesystemConfig()) {
        let error = `No Babel config file detected for ${config.options.filename}. Either disable config file checking with requireConfigFile: false, or configure Babel so that it can find the config files.`;
        if (config.options.filename.includes("node_modules")) {
          error += `\nIf you have a .babelrc.js file or use package.json#babel, keep in mind that it's not used when parsing dependencies. If you want your config to be applied to your whole app, consider using babel.config.js or babel.config.json instead.`;
        }
        throw new Error(error);
      }
    }
    if (config.options) return config.options;
  }
  return getDefaultParserOptions(parseOptions);
}
function getDefaultParserOptions(options) {
  return {
    plugins: [],
    ...options,
    babelrc: false,
    configFile: false,
    ignore: undefined,
    only: undefined
  };
}
export async function normalizeBabelParseConfig(options) {
  const parseOptions = normalizeParserOptions(options);
  const config = await loadPartialConfigAsync(parseOptions);
  return validateResolvedConfig(config, options, parseOptions);
}
//# sourceMappingURL=configuration.js.map
