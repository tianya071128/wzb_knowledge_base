import { validatePlugins, mixinPluginNames, mixinPlugins } from "./plugin-utils.js";
import Parser from "./parser/index.js";
import { getExportedToken, tt as internalTokenTypes } from "./tokenizer/types.js";
export function parse(input, options) {
  if (options?.sourceType === "unambiguous") {
    options = {
      ...options
    };
    try {
      options.sourceType = "module";
      const parser = getParser(options, input);
      const ast = parser.parse();
      if (parser.sawUnambiguousESM) {
        return ast;
      }
      if (parser.ambiguousScriptDifferentAst) {
        try {
          options.sourceType = "script";
          return getParser(options, input).parse();
        } catch {}
      } else {
        ast.program.sourceType = "script";
      }
      return ast;
    } catch (moduleError) {
      try {
        options.sourceType = "script";
        return getParser(options, input).parse();
      } catch {}
      throw moduleError;
    }
  } else {
    return getParser(options, input).parse();
  }
}
export function parseExpression(input, options) {
  const parser = getParser(options, input);
  if (parser.options.strictMode) {
    parser.state.strict = true;
  }
  return parser.getExpression();
}
function generateExportedTokenTypes(internalTokenTypes) {
  const tokenTypes = {};
  for (const typeName of Object.keys(internalTokenTypes)) {
    tokenTypes[typeName] = getExportedToken(internalTokenTypes[typeName]);
  }
  return tokenTypes;
}
export const tokTypes = generateExportedTokenTypes(internalTokenTypes);
function getParser(options, input) {
  let cls = Parser;
  const pluginsMap = new Map();
  if (options?.plugins) {
    for (const plugin of options.plugins) {
      let name, opts;
      if (typeof plugin === "string") {
        name = plugin;
      } else {
        [name, opts] = plugin;
      }
      if (!pluginsMap.has(name)) {
        pluginsMap.set(name, opts || {});
      }
    }
    validatePlugins(pluginsMap);
    cls = getParserClass(pluginsMap);
  }
  return new cls(options, input, pluginsMap);
}
const parserClassCache = new Map();
function getParserClass(pluginsMap) {
  const pluginList = [];
  for (const name of mixinPluginNames) {
    if (pluginsMap.has(name)) {
      pluginList.push(name);
    }
  }
  const key = pluginList.join("|");
  let cls = parserClassCache.get(key);
  if (!cls) {
    cls = Parser;
    for (const plugin of pluginList) {
      cls = mixinPlugins[plugin](cls);
    }
    parserClassCache.set(key, cls);
  }
  return cls;
}
export function getLine(locData, pos) {
  if (pos < 0 || pos * 2 >= locData.length) {
    throw new Error(`Position ${pos} is out of bounds for location data.`);
  }
  return locData[pos * 2];
}
export function getColumn(locData, pos) {
  if (pos < 0 || pos * 2 + 1 >= locData.length) {
    throw new Error(`Position ${pos} is out of bounds for location data.`);
  }
  return locData[pos * 2 + 1];
}