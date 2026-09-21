import traverse from "@babel/traverse";
import PluginPass from "./plugin-pass.js";
import loadBlockHoistPlugin from "./block-hoist-plugin.js";
import normalizeOptions from "./normalize-opts.js";
import normalizeFile from "./normalize-file.js";
import generateCode from "./file/generate.js";
import { flattenToSet } from "../config/helpers/deep-array.js";
import { isAsync, maybeAsync } from "../gensync-utils/async.js";
export function* run(config, code, ast) {
  const file = yield* normalizeFile(config.passes, normalizeOptions(config), code, ast);
  const opts = file.opts;
  try {
    yield* transformFile(file, config.passes);
  } catch (e) {
    e.message = `${opts.filename ?? "unknown file"}: ${e.message}`;
    if (!e.code) {
      e.code = "BABEL_TRANSFORM_ERROR";
    }
    throw e;
  }
  let outputCode, outputMap;
  try {
    if (opts.code !== false) {
      ({
        outputCode,
        outputMap
      } = generateCode(config.passes, file));
    }
  } catch (e) {
    e.message = `${opts.filename ?? "unknown file"}: ${e.message}`;
    if (!e.code) {
      e.code = "BABEL_GENERATE_ERROR";
    }
    throw e;
  }
  return {
    metadata: file.metadata,
    options: opts,
    ast: opts.ast === true ? file.ast : null,
    code: outputCode === undefined ? null : outputCode,
    map: outputMap === undefined ? null : outputMap,
    sourceType: file.ast.program.sourceType,
    externalDependencies: flattenToSet(config.externalDependencies)
  };
}
function* transformFile(file, pluginPasses) {
  const async = yield* isAsync();
  for (const pluginPairs of pluginPasses) {
    const passPairs = [];
    const passes = [];
    const visitors = [];
    for (const plugin of pluginPairs.concat([loadBlockHoistPlugin()])) {
      const pass = new PluginPass(file, plugin.key, plugin.options, async);
      passPairs.push([plugin, pass]);
      passes.push(pass);
      visitors.push(plugin.visitor);
    }
    for (const [plugin, pass] of passPairs) {
      if (plugin.pre) {
        const fn = maybeAsync(plugin.pre, `You appear to be using an async plugin/preset, but Babel has been called synchronously`);
        yield* fn.call(pass, file);
      }
    }
    const visitor = traverse.visitors.merge(visitors, passes, file.opts.wrapPluginVisitorMethod);
    traverse(file.ast.program, visitor, file.scope, null, file.path, true);
    for (const [plugin, pass] of passPairs) {
      if (plugin.post) {
        const fn = maybeAsync(plugin.post, `You appear to be using an async plugin/preset, but Babel has been called synchronously`);
        yield* fn.call(pass, file);
      }
    }
  }
}