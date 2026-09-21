import { clean, isLessThan } from "verkit";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { isModuleNamespaceObject } from "node:util/types";
const require = createRequire(import.meta.url);
const nodeVersion = clean(process.version.slice(1));
function humanize(val, noext) {
  if (noext) val = path.basename(val, path.extname(val));
  return val.replace(/-/g, " ");
}
function tryResolve(module) {
  try {
    return require.resolve(module);
  } catch (_) {
    return null;
  }
}
function loadOptions(loc) {
  const options = require(loc);
  if (isModuleNamespaceObject(options) && options.default) {
    return options.default;
  }
  return options;
}
function assertDirectory(loc) {
  if (!fs.statSync(loc).isDirectory()) {
    throw new Error(`Expected ${loc} to be a directory.`);
  }
}
function shouldIgnore(name, ignore) {
  if (ignore?.includes(name)) {
    return true;
  }
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  return name.startsWith(".") || ext === ".md" || base === "LICENSE" || base === "options" || name === "package.json";
}
const EXTENSIONS = [".js", ".mjs", ".ts", ".tsx", ".cts", ".mts", ".vue"];
const JSON_AND_EXTENSIONS = [".json", ...EXTENSIONS];
function checkFile(loc, allowJSON, matchedLoc) {
  const ext = path.extname(loc);
  const extensions = allowJSON ? JSON_AND_EXTENSIONS : EXTENSIONS;
  if (!extensions.includes(ext)) {
    throw new Error(`Unsupported input extension: ${loc}`);
  }
  if (!matchedLoc) {
    return loc;
  } else {
    throw new Error(`Found conflicting file matches: ${matchedLoc},${loc}`);
  }
}
function pushTask(taskName, taskDir, suite, suiteName) {
  const taskDirStats = fs.statSync(taskDir);
  let actualLoc, expectLoc, execLoc, execLocAlias, taskOptsLoc, stdoutLoc, stderrLoc, sourceMapLoc, sourceMapVisualLoc, inputSourceMap;
  const taskOpts = JSON.parse(JSON.stringify(suite.options));
  if (taskDirStats.isDirectory()) {
    const files = fs.readdirSync(taskDir);
    for (const file of files) {
      const loc = path.join(taskDir, file);
      const name = path.basename(file, path.extname(file));
      switch (name) {
        case "input":
          actualLoc = checkFile(loc, false, actualLoc);
          break;
        case "exec":
          execLoc = checkFile(loc, false, execLoc);
          break;
        case "output":
          expectLoc = checkFile(loc, true, expectLoc);
          break;
        case "output.extended":
          expectLoc = checkFile(loc, true, expectLoc);
          break;
        case "options":
          taskOptsLoc = loc;
          Object.assign(taskOpts, loadOptions(taskOptsLoc));
          break;
        case "source-map":
          sourceMapLoc = loc;
          break;
        case "source-map-visual":
          sourceMapVisualLoc = loc;
          break;
        case "input-source-map":
          inputSourceMap = JSON.parse(readFile(loc));
          break;
      }
    }
    if (files.length > 0 && !actualLoc && !execLoc) {
      console.warn(`Skipped test folder with invalid layout: ${taskDir}`);
      return;
    }
    actualLoc ??= taskDir + "/input.js";
    execLoc ??= taskDir + "/exec.js";
    expectLoc ??= taskDir + "/output.js";
    stdoutLoc = taskDir + "/stdout.txt";
    stderrLoc = taskDir + "/stderr.txt";
  } else if (taskDirStats.isFile()) {
    const ext = path.extname(taskDir);
    if (!EXTENSIONS.includes(ext)) return;
    execLoc = taskDir;
    execLocAlias = suiteName + "/" + taskName;
  } else {
    console.warn(`Skipped test folder with invalid layout: ${taskDir}`);
    return;
  }
  const shouldIgnore = taskOpts.BABEL_8_BREAKING === false || false;
  if (shouldIgnore) return;
  function buildTestFile(loc, fileName) {
    return {
      loc,
      code: readFile(loc),
      filename: !loc ? undefined : fileName === true ? suiteName + "/" + taskName + "/" + path.basename(loc) : fileName || undefined
    };
  }
  const sourceMapFile = buildTestFile(sourceMapLoc, true);
  const sourceMap = sourceMapFile.code ? JSON.parse(sourceMapFile.code) : undefined;
  const test = {
    taskDir,
    optionsDir: taskOptsLoc ? path.dirname(taskOptsLoc) : undefined,
    title: humanize(taskName, true),
    disabled: taskName.startsWith(".") ? true : process.env.TEST_babel7plugins_babel8core && taskOpts.SKIP_babel7plugins_babel8core || false,
    options: taskOpts,
    doNotSetSourceType: taskOpts.DO_NOT_SET_SOURCE_TYPE ?? false,
    externalHelpers: taskOpts.externalHelpers ?? true,
    validateLogs: taskOpts.validateLogs ?? false,
    ignoreOutput: taskOpts.ignoreOutput ?? false,
    stdout: buildTestFile(stdoutLoc),
    stderr: buildTestFile(stderrLoc),
    exec: buildTestFile(execLoc, execLocAlias),
    actual: buildTestFile(actualLoc, true),
    expect: buildTestFile(expectLoc, true),
    sourceMap,
    sourceMapFile,
    sourceMapVisual: buildTestFile(sourceMapVisualLoc),
    validateSourceMapVisual: taskOpts.sourceMaps === true || taskOpts.sourceMaps === "both",
    inputSourceMap
  };
  if (test.exec.code && test.actual.code && path.extname(execLoc) !== path.extname(actualLoc)) {
    throw new Error(`Input file extension should match exec file extension: ${execLoc}, ${actualLoc}`);
  }
  delete taskOpts.BABEL_8_BREAKING;
  delete taskOpts.DO_NOT_SET_SOURCE_TYPE;
  delete taskOpts.SKIP_ON_PUBLISH;
  delete taskOpts.SKIP_babel7plugins_babel8core;
  if (taskOpts.minNodeVersion) {
    const minimumVersion = clean(taskOpts.minNodeVersion);
    if (minimumVersion == null) {
      throw new Error(`'minNodeVersion' has invalid semver format: ${taskOpts.minNodeVersion}`);
    }
    if (isLessThan(nodeVersion, minimumVersion)) {
      if (test.actual.code) {
        test.exec.code = undefined;
      } else {
        return;
      }
    }
    delete taskOpts.minNodeVersion;
  }
  if (taskOpts.minNodeVersionTransform) {
    const minimumVersion = clean(taskOpts.minNodeVersionTransform);
    if (minimumVersion == null) {
      throw new Error(`'minNodeVersionTransform' has invalid semver format: ${taskOpts.minNodeVersionTransform}`);
    }
    if (isLessThan(nodeVersion, minimumVersion)) {
      return;
    }
    delete taskOpts.minNodeVersionTransform;
  }
  if (taskOpts.os) {
    let os = taskOpts.os;
    if (!Array.isArray(os) && typeof os !== "string") {
      throw new Error(`'os' should be either string or string array: ${taskOpts.os}`);
    }
    if (typeof os === "string") {
      os = [os];
    }
    if (!os.includes(process.platform)) {
      return;
    }
    delete taskOpts.os;
  }
  suite.tests.push(test);
  if (taskOpts.throws) {
    if (test.expect.code) {
      throw new Error("Test cannot throw and also return output code: " + expectLoc);
    }
    if (test.sourceMap) {
      throw new Error("Test cannot throw and also return sourcemaps: " + sourceMapLoc);
    }
  }
  if (!test.validateLogs && (test.stdout.code || test.stderr.code)) {
    throw new Error("stdout.txt and stderr.txt are only allowed when the 'validateLogs' option is enabled: " + (test.stdout.code ? stdoutLoc : stderrLoc));
  }
  if (test.ignoreOutput) {
    if (test.expect.code) {
      throw new Error("Test cannot ignore its output and also validate it: " + expectLoc);
    }
    if (!test.validateLogs) {
      throw new Error("ignoreOutput can only be used when validateLogs is true: " + taskOptsLoc);
    }
  }
  delete test.options.validateLogs;
  delete test.options.ignoreOutput;
  delete test.options.externalHelpers;
}
function wrapPackagesArray(type, names, optionsDir) {
  return names.map(function (val) {
    if (typeof val === "string") val = [val];
    if (val[0].startsWith(".")) {
      if (!optionsDir) {
        throw new Error("Please provide an options.json in test dir when using a " + "relative plugin path.");
      }
      val[0] = path.resolve(optionsDir, val[0]);
    } else {
      let name = val[0];
      const match = /^(@babel\/(?:plugin-|preset-)?)(.*)$/.exec(name);
      if (match) {
        name = match[2];
      }
      const monorepoPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../..", name.startsWith("codemod") ? "codemods" : "packages", `babel-${type}-${name}/lib/index.js`);
      if (fs.existsSync(monorepoPath)) {
        if (match) {
          throw new Error(`Remove the "${match[1]}" prefix from "${val[0]}", to load it from the monorepo`);
        }
        val[0] = monorepoPath;
      }
    }
    return val;
  });
}
export function resolveOptionPluginOrPreset(options, optionsDir) {
  if (options.overrides) {
    for (const subOption of options.overrides) {
      resolveOptionPluginOrPreset(subOption, optionsDir);
    }
  }
  if (options.env) {
    for (const envName in options.env) {
      if (!Object.hasOwn(options.env, envName)) continue;
      resolveOptionPluginOrPreset(options.env[envName], optionsDir);
    }
  }
  if (options.plugins) {
    options.plugins = wrapPackagesArray("plugin", options.plugins, optionsDir);
  }
  if (options.presets) {
    options.presets = wrapPackagesArray("preset", options.presets, optionsDir).map(function (val) {
      if (val.length > 3) {
        throw new Error("Unexpected extra options " + JSON.stringify(val.slice(3)) + " passed to preset.");
      }
      return val;
    });
  }
  return options;
}
export default function get(entryLoc) {
  if (entryLoc instanceof URL) entryLoc = fileURLToPath(entryLoc);
  const suites = [];
  let rootOpts = {};
  const rootOptsLoc = tryResolve(entryLoc + "/options");
  if (rootOptsLoc) rootOpts = loadOptions(rootOptsLoc);
  for (const suiteName of fs.readdirSync(entryLoc)) {
    if (shouldIgnore(suiteName)) continue;
    const suite = {
      options: {
        ...rootOpts
      },
      tests: [],
      title: humanize(suiteName),
      filename: entryLoc + "/" + suiteName
    };
    assertDirectory(suite.filename);
    suites.push(suite);
    const suiteOptsLoc = tryResolve(suite.filename + "/options");
    if (suiteOptsLoc) {
      suite.options = resolveOptionPluginOrPreset(loadOptions(suiteOptsLoc), suite.filename);
    }
    for (const taskName of fs.readdirSync(suite.filename)) {
      pushTask(taskName, suite.filename + "/" + taskName, suite, suiteName);
    }
  }
  return suites;
}
export function multiple(entryLoc, ignore) {
  if (entryLoc instanceof URL) entryLoc = fileURLToPath(entryLoc);
  const categories = {};
  for (const name of fs.readdirSync(entryLoc)) {
    if (shouldIgnore(name, ignore)) continue;
    const loc = path.join(entryLoc, name);
    assertDirectory(loc);
    categories[name] = get(loc);
  }
  return categories;
}
export function readFile(filename) {
  try {
    if (filename === undefined) {
      return "";
    }
    return fs.readFileSync(filename, "utf8").trimRight();
  } catch (e) {
    if (e.code === "ENOENT") {
      return "";
    }
    throw e;
  }
}