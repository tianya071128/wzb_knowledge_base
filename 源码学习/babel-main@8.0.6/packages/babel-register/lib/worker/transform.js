import cloneDeep from "clone-deep";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import Cache from "./cache.js";
import { getEnv, loadPartialConfigAsync, loadOptionsAsync, transformAsync, version } from "@babel/core";
const cache = new Cache();
const nmRE = escapeRegExp(path.sep + "node_modules" + path.sep);
function escapeRegExp(string) {
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
const id = value => value;
async function cacheLookup(opts, filename) {
  if (!cache.enabled) {
    return {
      cached: null,
      store: id
    };
  }
  let cacheKey = `${JSON.stringify(opts)}:${version}`;
  const env = getEnv();
  if (env) cacheKey += `:${env}`;
  cacheKey = crypto.createHash("sha1").update(cacheKey).digest("hex");
  const cached = await cache.get(cacheKey);
  const fileMtime = +fs.statSync(filename).mtime;
  if (cached?.mtime === fileMtime) {
    return {
      cached: cached.value,
      store: id
    };
  }
  return {
    cached: null,
    async store(value) {
      await cache.set(cacheKey, {
        value,
        mtime: fileMtime
      });
      return value;
    }
  };
}
let transformOpts;
async function setOptions(opts) {
  if (opts.cache === false && cache.enabled) {
    await cache.disable();
  } else if (opts.cache !== false && !cache.enabled) {
    await cache.enable();
  }
  delete opts.cache;
  delete opts.extensions;
  transformOpts = {
    ...opts,
    caller: {
      name: "@babel/register",
      supportsStaticESM: false,
      supportsDynamicImport: false,
      supportsExportNamespaceFrom: false,
      ...(opts.caller || {})
    }
  };
  let {
    cwd = "."
  } = transformOpts;
  cwd = transformOpts.cwd = path.resolve(cwd);
  if (transformOpts.ignore === undefined && transformOpts.only === undefined) {
    const cwdRE = escapeRegExp(cwd);
    transformOpts.only = [new RegExp("^" + cwdRE, "i")];
    transformOpts.ignore = [new RegExp(`^${cwdRE}(?:${path.sep}.*)?${nmRE}`, "i")];
  }
}
async function transform(input, filename) {
  const opts = await loadOptionsAsync({
    sourceRoot: path.dirname(filename) + path.sep,
    ...cloneDeep(transformOpts),
    filename
  });
  if (opts === null) {
    return null;
  }
  const {
    cached,
    store
  } = await cacheLookup(opts, filename);
  if (cached) return cached;
  const {
    code,
    map
  } = await transformAsync(input, {
    ...opts,
    sourceMaps: opts.sourceMaps === undefined ? "both" : opts.sourceMaps,
    ast: false
  });
  return await store({
    code,
    map
  });
}
async function isFileIgnored(filename) {
  const opts = await loadPartialConfigAsync({
    ...cloneDeep(transformOpts),
    filename,
    showIgnoredFiles: true,
    babelrc: false,
    configFile: false,
    browserslistConfigFile: false,
    plugins: [],
    presets: [],
    targets: {
      browsers: undefined
    }
  });
  return opts === null;
}
function saveCache() {
  return cache.flush();
}
export { setOptions, transform, saveCache, isFileIgnored };