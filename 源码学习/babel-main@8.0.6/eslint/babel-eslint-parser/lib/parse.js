import { satisfies } from "verkit";
import { version } from "@babel/core";
import { WorkerClient } from "./client.js";
import { convertError, convertFile } from "./convert/index.js";
import { createRequire } from "node:module";
import { getTokLabels, getVisitorKeys } from "./ast-info.js";
import { getParserPlugins } from "./worker/configuration.js";
const require = createRequire(import.meta.url);
const babelParser = require(require.resolve("@babel/parser", {
  paths: [require.resolve("@babel/core/package.json")]
}));
let isRunningMinSupportedCoreVersion = null;
let client;
export default function parse(code, options) {
  const minSupportedCoreVersion = "8.0.6";
  if (typeof isRunningMinSupportedCoreVersion !== "boolean") {
    isRunningMinSupportedCoreVersion = satisfies(version, minSupportedCoreVersion);
  }
  if (!isRunningMinSupportedCoreVersion) {
    throw new Error(`@babel/eslint-parser@${"8.0.6"} does not support @babel/core@${version}. Please upgrade to @babel/core@${minSupportedCoreVersion}.`);
  }
  if (options.babelOptions.babelrc === false && options.babelOptions.configFile === false) {
    const parserOpts = {
      sourceType: options.sourceType,
      sourceFilename: options.filePath,
      ...(options.sourceType !== "commonjs" ? {
        allowReturnOutsideFunction: options.ecmaFeatures?.globalReturn ?? false
      } : {}),
      ...options.babelOptions.parserOpts,
      plugins: getParserPlugins(options.babelOptions),
      attachComment: false,
      ranges: true,
      tokens: true
    };
    try {
      return convertFile(babelParser.parse(code, parserOpts), code, getTokLabels(), getVisitorKeys());
    } catch (err) {
      throw convertError(err);
    }
  }
  client ??= new WorkerClient();
  const {
    ast,
    parserOptions
  } = client.maybeParse(code, options);
  if (ast) return ast;
  try {
    return convertFile(babelParser.parse(code, parserOptions), code, getTokLabels(), getVisitorKeys());
  } catch (err) {
    throw convertError(err);
  }
}
//# sourceMappingURL=parse.js.map
