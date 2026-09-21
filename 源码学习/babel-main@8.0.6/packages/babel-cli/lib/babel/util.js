import * as babel from "@babel/core";
import path from "node:path";
import fs from "node:fs";
import * as watcher from "./watcher.js";
export function chmod(src, dest) {
  try {
    fs.chmodSync(dest, fs.statSync(src).mode);
  } catch (_) {
    console.warn(`Cannot change permissions of ${dest}`);
  }
}
export function alphasort(a, b) {
  return a.localeCompare(b, "en");
}
export function readdir(dirname, includeDotfiles, filter) {
  return fs.readdirSync(dirname, {
    recursive: true,
    withFileTypes: true
  }).filter(dirent => {
    if (dirent.isDirectory()) return false;
    const filename = dirent.name;
    return (includeDotfiles || !filename.startsWith(".")) && (!filter || filter(filename));
  }).map(dirent => path.join(dirent.parentPath, dirent.name)).sort(alphasort);
}
export function readdirForCompilable(dirname, includeDotfiles, altExts) {
  return readdir(dirname, includeDotfiles, function (filename) {
    return isCompilableExtension(filename, altExts);
  });
}
export function isCompilableExtension(filename, altExts) {
  const exts = altExts || babel.DEFAULT_EXTENSIONS;
  const ext = path.extname(filename);
  return exts.includes(ext);
}
export function addSourceMappingUrl(code, loc) {
  return code + "\n//# sourceMappingURL=" + path.basename(loc);
}
export function hasDataSourcemap(code) {
  const pos = code.lastIndexOf("\n", code.length - 2);
  return pos !== -1 && code.lastIndexOf("//# sourceMappingURL") < pos;
}
const REPL_CALLER = {
  name: "@babel/cli",
  supportsStaticESM: false,
  supportsDynamicImport: false,
  supportsExportNamespaceFrom: false
};
const COMPILE_CALLER = {
  name: "@babel/cli"
};
export function transformRepl(filename, code, opts) {
  opts = {
    ...opts,
    sourceMaps: opts.sourceMaps === "inline" ? true : opts.sourceMaps,
    caller: REPL_CALLER,
    filename
  };
  return new Promise((resolve, reject) => {
    babel.transform(code, opts, (err, result) => {
      if (err) reject(err);else resolve(result);
    });
  });
}
export async function compile(filename, opts) {
  opts = {
    ...opts,
    caller: COMPILE_CALLER
  };
  const result = await babel.transformFileAsync(filename, opts);
  if (result) {
    watcher.updateExternalDependencies(filename, result.externalDependencies);
  }
  return result;
}
export function deleteDir(path) {
  fs.rmSync(path, {
    force: true,
    recursive: true
  });
}
process.on("uncaughtException", function (err) {
  console.error(err);
  process.exitCode = 1;
});
export function withExtension(filename, ext = ".js") {
  const newBasename = path.basename(filename, path.extname(filename)) + ext;
  return path.join(path.dirname(filename), newBasename);
}
export function debounce(fn, time) {
  let timer;
  function debounced() {
    clearTimeout(timer);
    timer = setTimeout(fn, time);
  }
  debounced.flush = () => {
    clearTimeout(timer);
    fn();
  };
  return debounced;
}