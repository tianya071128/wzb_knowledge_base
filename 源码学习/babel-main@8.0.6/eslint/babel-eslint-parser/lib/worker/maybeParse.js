import { createConfigItemAsync, parseAsync } from "@babel/core";
import { convertError, convertFile } from "../convert/index.js";
import { getTokLabels, getVisitorKeys } from "../ast-info.js";
import extractParserOptionsPlugin from "./extract-parser-options-plugin.js";
const ref = {};
let extractParserOptionsConfigItem;
const MULTIPLE_OVERRIDES = /More than one plugin attempted to override parsing/;
export default async function maybeParse(code, options) {
  if (!extractParserOptionsConfigItem) {
    extractParserOptionsConfigItem = await createConfigItemAsync([extractParserOptionsPlugin, ref], {
      dirname: import.meta.dirname,
      type: "plugin"
    });
  }
  const {
    plugins
  } = options;
  options.plugins = plugins.concat(extractParserOptionsConfigItem);
  let ast;
  try {
    return {
      parserOptions: await parseAsync(code, options),
      ast: null
    };
  } catch (err) {
    if (!MULTIPLE_OVERRIDES.test(err.message)) {
      throw err;
    }
  }
  options.plugins = plugins;
  try {
    ast = await parseAsync(code, options);
  } catch (err) {
    throw convertError(err);
  }
  return {
    ast: convertFile(ast, code, getTokLabels(), getVisitorKeys()),
    parserOptions: null
  };
}