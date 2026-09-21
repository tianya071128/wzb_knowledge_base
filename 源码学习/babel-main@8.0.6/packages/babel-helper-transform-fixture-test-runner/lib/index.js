import * as babel from "@babel/core";
import { buildExternalHelpers } from "@babel/core";
import { default as getFixtures, resolveOptionPluginOrPreset, readFile } from "@babel/helper-fixtures";
import { codeFrameColumns } from "@babel/code-frame";
import * as helpers from "./helpers.js";
import visualizeSourceMap from "./source-map-visualizer.js";
import assert from "node:assert";
import fs, { readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import flru from "flru";
import { fileURLToPath } from "node:url";
import { diff } from "jest-diff";
import { spawn } from "node:child_process";
import os from "node:os";
import * as resolve from "resolve";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const dirname = path.dirname(fileURLToPath(import.meta.url));
import checkDuplicateNodes from "@babel/helper-check-duplicate-nodes";
import { createHash } from "node:crypto";
const EXTERNAL_HELPERS_VERSION = "7.100.0";
const cachedScripts = flru(10);
const contextModuleCache = new WeakMap();
function transformWithoutConfigFile(code, opts) {
  return babel.transformSync(code, {
    browserslistConfigFile: false,
    configFile: false,
    babelrc: false,
    caller: {
      name: "babel-helper-transform-fixture-test-runner/sync",
      supportsStaticESM: false,
      supportsDynamicImport: false,
      supportsExportNamespaceFrom: false
    },
    ...opts
  });
}
function transformAsyncWithoutConfigFile(code, opts) {
  return babel.transformAsync(code, {
    browserslistConfigFile: false,
    configFile: false,
    babelrc: false,
    caller: {
      name: "babel-helper-transform-fixture-test-runner/async",
      supportsStaticESM: false,
      supportsDynamicImport: false,
      supportsExportNamespaceFrom: false
    },
    ...opts
  });
}
export function createTestContext() {
  const context = vm.createContext({
    ...helpers,
    process: process,
    transform: transformWithoutConfigFile,
    transformAsync: transformAsyncWithoutConfigFile,
    setTimeout: setTimeout,
    setImmediate: setImmediate,
    expect
  });
  context.global = context;
  const moduleCache = Object.create(null);
  contextModuleCache.set(context, moduleCache);
  runCacheableScriptInTestContext(path.join(path.dirname(fileURLToPath(import.meta.url)), "babel-helpers-in-memory.js"), buildExternalHelpers, context, moduleCache);
  return context;
}
function runCacheableScriptInTestContext(filename, srcFn, context, moduleCache) {
  let cached = cachedScripts.get(filename);
  if (!cached) {
    const code = `(function (exports, require, module, __filename, __dirname) {\n${srcFn()}\n});`;
    cached = {
      code,
      cachedData: undefined
    };
    cachedScripts.set(filename, cached);
  }
  const script = new vm.Script(cached.code, {
    filename,
    lineOffset: -1,
    cachedData: cached.cachedData
  });
  cached.cachedData = script.createCachedData();
  const module = {
    id: filename,
    exports: {}
  };
  moduleCache[filename] = module;
  const req = id => runModuleInTestContext(id, filename, context, moduleCache);
  const dirname = path.dirname(filename);
  script.runInContext(context).call(module.exports, module.exports, req, module, filename, dirname);
  return module;
}
function runModuleInTestContext(id, relativeFilename, context, moduleCache) {
  const filename = resolve.sync(id, {
    basedir: path.dirname(relativeFilename)
  });
  if (filename === id) return require(id);
  if (moduleCache[filename]) return moduleCache[filename].exports;
  return runCacheableScriptInTestContext(filename, () => fs.readFileSync(filename, "utf8"), context, moduleCache).exports;
}
let sharedTestContext;
export function runCodeInTestContext(code, opts, context = sharedTestContext ??= createTestContext()) {
  const filename = opts.filename instanceof URL ? fileURLToPath(opts.filename) : opts.filename;
  const dirname = path.dirname(filename);
  const moduleCache = contextModuleCache.get(context);
  const req = id => runModuleInTestContext(id, filename, context, moduleCache);
  const module = {
    id: filename,
    exports: {}
  };
  const oldCwd = process.cwd();
  try {
    if (filename) process.chdir(path.dirname(filename));
    const src = `((function(exports, require, module, __filename, __dirname, opts) {\n${code}\n})).apply(global, global.__callArgs);`;
    context.__callArgs = [module.exports, req, module, filename, dirname, opts];
    return vm.runInContext(src, context, {
      filename,
      displayErrors: true,
      lineOffset: -1,
      timeout: opts.timeout ?? 10000
    });
  } finally {
    context.__callArgs = undefined;
    process.chdir(oldCwd);
  }
}
async function maybeMockConsole(validateLogs, run) {
  const actualLogs = {
    stdout: "",
    stderr: ""
  };
  if (!validateLogs) return {
    result: await run(),
    actualLogs
  };
  const spy1 = jest.spyOn(console, "log").mockImplementation(msg => {
    actualLogs.stdout += `${msg}\n`;
  });
  const spy2 = jest.spyOn(console, "warn").mockImplementation(msg => {
    actualLogs.stderr += `${msg}\n`;
  });
  try {
    return {
      result: await run(),
      actualLogs
    };
  } finally {
    spy1.mockRestore();
    spy2.mockRestore();
  }
}
async function run(task) {
  const {
    actual,
    expect: expected,
    exec,
    options: opts,
    doNotSetSourceType,
    optionsDir,
    validateLogs,
    ignoreOutput,
    stdout,
    stderr
  } = task;
  function getOpts(self) {
    const newOpts = {
      ast: true,
      cwd: path.dirname(self.loc),
      filename: self.loc,
      filenameRelative: self.filename,
      sourceFileName: self.filename,
      ...(doNotSetSourceType ? {} : {
        sourceType: "script"
      }),
      babelrc: false,
      configFile: false,
      inputSourceMap: task.inputSourceMap || undefined,
      ...opts
    };
    return resolveOptionPluginOrPreset(newOpts, optionsDir);
  }
  let execCode = exec.code;
  let result;
  let resultExec;
  let execErr;
  if (execCode) {
    const context = createTestContext();
    const execOpts = getOpts(exec);
    result = (await maybeMockConsole(validateLogs, async () => babel.transformAsync(execCode, execOpts))).result;
    checkDuplicateNodes(result.ast);
    execCode = result.code;
    try {
      resultExec = runCodeInTestContext(execCode, execOpts, context);
    } catch (err) {
      if (typeof err === "object" && err.message) {
        err.message = `${exec.loc}: ${err.message}\n` + codeFrameColumns(execCode, {});
      }
      execErr = err;
    }
  }
  const inputCode = actual.code;
  const expectedCode = expected.code;
  if (!execCode || inputCode) {
    const res = await maybeMockConsole(validateLogs, () => babel.transformAsync(inputCode, getOpts(actual)));
    result = res.result;
    const outputCode = normalizeOutput(result.code, {
      normalizePathSeparator: true
    });
    checkDuplicateNodes(result.ast);
    if (!ignoreOutput) {
      if (!expectedCode && outputCode && !opts.throws && fs.statSync(path.dirname(expected.loc)).isDirectory() && !process.env.CI) {
        const expectedFile = expected.loc.replace(/\.m?js$/, result.sourceType === "module" ? ".mjs" : ".js");
        console.log(`New test file created: ${expectedFile}`);
        fs.writeFileSync(expectedFile, `${outputCode}\n`);
        if (expected.loc !== expectedFile) {
          try {
            fs.unlinkSync(expected.loc);
          } catch (_) {}
        }
      } else {
        validateFile(outputCode, expected.loc, expectedCode);
        if (inputCode) {
          expect(expected.loc).toMatch(result.sourceType === "module" ? /\.mjs$/ : /\.js$/);
        }
      }
    }
    if (validateLogs) {
      const normalizationOpts = {
        normalizePathSeparator: true,
        normalizePresetEnvDebug: task.taskDir.includes("babel-preset-env")
      };
      validateFile(normalizeOutput(res.actualLogs.stdout, normalizationOpts), stdout.loc, stdout.code);
      validateFile(normalizeOutput(res.actualLogs.stderr, normalizationOpts), stderr.loc, stderr.code);
    }
  }
  if (execErr) {
    throw execErr;
  }
  if (task.validateSourceMapVisual === true) {
    const visual = visualizeSourceMap(result.code, result.map);
    try {
      expect(visual).toEqual(task.sourceMapVisual.code);
    } catch (e) {
      if (!process.env.OVERWRITE && task.sourceMapVisual.code) throw e;
      console.log(`Updated test file: ${task.sourceMapVisual.loc}`);
      fs.writeFileSync(task.sourceMapVisual.loc ?? task.taskDir + "/source-map-visual.txt", visual + "\n");
    }
  }
  if (opts.sourceMaps === true) {
    try {
      expect(result.map).toEqual(task.sourceMap);
    } catch (e) {
      if (!process.env.OVERWRITE && task.sourceMap) throw e;
      task.sourceMapFile.loc ??= task.taskDir + "/source-map.json";
      console.log(`Updated test file: ${task.sourceMapFile.loc}`);
      fs.writeFileSync(task.sourceMapFile.loc, JSON.stringify(result.map, null, 2));
    }
  }
  if (execCode && resultExec) {
    return resultExec;
  }
}
function validateFile(actualCode, expectedLoc, expectedCode) {
  if (actualCode !== expectedCode) {
    if (process.env.OVERWRITE) {
      console.log(`Updated test file: ${expectedLoc}`);
      fs.writeFileSync(expectedLoc, `${actualCode}\n`);
      return;
    }
    throw new Error(`Expected ${expectedLoc} to match transform output.\n` + `To autogenerate a passing version of this file, delete ` + ` the file and re-run the tests.\n\n` + `Diff:\n\n${diff(expectedCode, actualCode, {
      expand: false
    })}`);
  }
}
function normalizeOutput(code, {
  normalizePathSeparator = false
} = {}) {
  const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
  const symbol = "<CWD>";
  let result = code.trim().replaceAll(dir, symbol);
  if (process.platform === "win32") {
    result = result.replaceAll(dir.replaceAll("\\", "/"), symbol).replaceAll(dir.replaceAll("\\", "\\\\"), symbol);
    if (normalizePathSeparator) {
      result = result.replaceAll(/<CWD>[\w\\/.-]+/g, path => path.replaceAll(/\\\\?/g, "/"));
    }
  }
  return result;
}
export default function (fixturesLoc, name, suiteOpts = {}, taskOpts = {}, dynamicOpts) {
  const suites = getFixtures(fixturesLoc);
  for (const testSuite of suites) {
    if (suiteOpts.ignoreSuites?.includes(testSuite.title)) continue;
    describe(name + "/" + testSuite.title, function () {
      for (const task of testSuite.tests) {
        if (suiteOpts.ignoreTasks?.includes(task.title) || suiteOpts.ignoreTasks?.includes(testSuite.title + "/" + task.title)) {
          continue;
        }
        const testFn = task.disabled ? it.skip : it;
        const testTitle = typeof task.disabled === "string" ? `(SKIP: ${task.disabled}) ${task.title}` : task.title;
        testFn(testTitle, async function () {
          const runTask = () => run(task);
          if ("sourceMap" in task.options) {
            throw new Error("`sourceMap` option is deprecated. Use `sourceMaps` instead.");
          }
          if ("sourceMaps" in task.options === false) {
            task.options.sourceMaps = !!task.sourceMap;
          }
          Object.assign(task.options, taskOpts);
          if (dynamicOpts) dynamicOpts(task.options, task);
          if (task.externalHelpers) {
            (task.options.plugins ??= []).push(["external-helpers", {
              helperVersion: EXTERNAL_HELPERS_VERSION
            }]);
          }
          const throwMsg = task.options.throws;
          if (throwMsg) {
            delete task.options.throws;
            await assert.rejects(runTask, function (err) {
              assert.ok(throwMsg === true || err.message.includes(throwMsg), `
Expected Error: ${throwMsg}
Actual Error: ${err.message}`);
              return true;
            });
          } else {
            return runTask();
          }
        });
      }
    });
  }
}
const tmpDir = realpathSync.native(os.tmpdir());
const readDir = function (loc, pathFilter) {
  const files = {};
  if (fs.existsSync(loc)) {
    fs.readdirSync(loc, {
      withFileTypes: true,
      recursive: true
    }).filter(dirent => dirent.isFile() && pathFilter(dirent.name)).forEach(dirent => {
      const fullpath = path.join(dirent.parentPath, dirent.name);
      files[path.relative(loc, fullpath)] = readFile(fullpath);
    });
  }
  return files;
};
const outputFileSync = function (filePath, data) {
  fs.mkdirSync(path.dirname(filePath), {
    recursive: true
  });
  fs.writeFileSync(filePath, data);
};
function deleteDir(path) {
  fs.rmSync(path, {
    force: true,
    recursive: true
  });
}
const pathFilter = function (x) {
  return path.basename(x) !== ".DS_Store";
};
const assertTest = function (stdout, stderr, ipcMessage, opts, tmpDir) {
  const expectStderr = opts.stderr.trim();
  stderr = stderr.trim();
  stderr = stderr.replace(/\\\\/g, "/");
  stderr = stderr.replace(/\\/g, "/");
  try {
    if (opts.stderr) {
      if (opts.stderrContains) {
        expect(stderr).toContain(expectStderr);
      } else {
        expect(stderr).toBe(expectStderr);
      }
    } else if (stderr) {
      throw new Error("stderr:\n" + stderr);
    }
  } catch (e) {
    if (!process.env.OVERWRITE) throw e;
    console.log(`Updated test file: ${opts.stderrPath}`);
    outputFileSync(opts.stderrPath, stderr + "\n");
  }
  const expectStdout = opts.stdout.trim();
  stdout = stdout.trim();
  stdout = stdout.replace(/\\\\/g, "/");
  stdout = stdout.replace(/\\/g, "/");
  try {
    if (opts.stdout) {
      if (opts.stdoutContains) {
        expect(stdout).toContain(expectStdout);
      } else {
        expect(stdout).toBe(expectStdout);
      }
    } else if (stdout) {
      throw new Error("stdout:\n" + stdout);
    }
  } catch (e) {
    if (!process.env.OVERWRITE) throw e;
    console.log(`Updated test file: ${opts.stdoutPath}`);
    outputFileSync(opts.stdoutPath, stdout + "\n");
  }
  if (opts.ipc) {
    expect(ipcMessage).toEqual(opts.ipcMessage);
  }
  if (opts.outFiles) {
    const actualFiles = readDir(tmpDir, pathFilter);
    Object.keys(actualFiles).forEach(function (filename) {
      try {
        if (filename !== ".babelrc" && filename !== ".babelignore" && !Object.hasOwn(opts.inFiles, filename)) {
          const expected = opts.outFiles[filename];
          const actual = actualFiles[filename];
          expect(actual).toBe(expected || "");
        }
      } catch (e) {
        if (!process.env.OVERWRITE) {
          e.message += "\n at " + filename;
          throw e;
        }
        const expectedLoc = path.join(opts.testLoc, "out-files", filename);
        console.log(`Updated test file: ${expectedLoc}`);
        outputFileSync(expectedLoc, actualFiles[filename]);
      }
    });
    Object.keys(opts.outFiles).forEach(function (filename) {
      expect(actualFiles).toHaveProperty([filename]);
    });
  }
};
export function buildParallelProcessTests(name, tests) {
  return function (curr, total) {
    const sliceLength = Math.ceil(tests.length / total);
    const sliceStart = curr * sliceLength;
    const sliceEnd = sliceStart + sliceLength;
    const testsSlice = tests.slice(sliceStart, sliceEnd);
    describe(`${name} [${curr}/${total}]`, function () {
      it("dummy", () => {});
      for (const test of testsSlice) {
        (test.skip ? it.skip : it)(test.suiteName + " " + test.testName, test.fn);
      }
    });
  };
}
const rootUrl = new URL("../../..", import.meta.url);
function resolveRootDirOrRootUrlToken(arg) {
  return arg.replace("<rootDir>", fileURLToPath(rootUrl)).replace("<rootUrl>", rootUrl.href.slice(0, -1));
}
export function buildProcessTests(dir, beforeHook, afterHook) {
  if (dir instanceof URL) dir = fileURLToPath(dir);
  const tests = [];
  fs.readdirSync(dir).forEach(function (suiteName) {
    if (suiteName.startsWith(".") || suiteName === "package.json") return;
    const suiteLoc = path.join(dir, suiteName);
    fs.readdirSync(suiteLoc).forEach(function (testName) {
      if (testName.startsWith(".")) return;
      const testLoc = path.join(suiteLoc, testName);
      let opts = {
        args: [],
        stdout: "",
        stderr: "",
        stdin: "",
        stdoutPath: "",
        stderrPath: "",
        testLoc: "",
        outFiles: {},
        inFiles: {}
      };
      const optionsLoc = path.join(testLoc, "options.json");
      if (fs.existsSync(optionsLoc)) {
        const taskOpts = JSON.parse(readFileSync(optionsLoc, "utf8"));
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
        opts = {
          args: [],
          ...taskOpts
        };
      }
      const executorLoc = path.join(testLoc, "executor.js");
      if (fs.existsSync(executorLoc)) {
        opts.executor = executorLoc;
      }
      opts.stderrPath = path.join(testLoc, "stderr.txt");
      opts.stdoutPath = path.join(testLoc, "stdout.txt");
      for (const key of ["stdout", "stdin", "stderr"]) {
        const loc = path.join(testLoc, key + ".txt");
        if (fs.existsSync(loc)) {
          opts[key] = readFile(loc);
        } else {
          opts[key] = opts[key] || "";
        }
      }
      opts.testLoc = testLoc;
      opts.outFiles = readDir(path.join(testLoc, "out-files"), pathFilter);
      opts.inFiles = readDir(path.join(testLoc, "in-files"), pathFilter);
      const babelrcLoc = path.join(testLoc, ".babelrc");
      const babelIgnoreLoc = path.join(testLoc, ".babelignore");
      if (fs.existsSync(babelrcLoc)) {
        opts.inFiles[".babelrc"] = readFile(babelrcLoc);
      } else if (!opts.noBabelrc) {
        opts.inFiles[".babelrc"] = "{}";
      }
      if (fs.existsSync(babelIgnoreLoc)) {
        opts.inFiles[".babelignore"] = readFile(babelIgnoreLoc);
      }
      const skip = opts.minNodeVersion && parseInt(process.versions.node, 10) < opts.minNodeVersion || opts.BABEL_8_BREAKING === false;
      const test = {
        suiteName,
        testName,
        skip,
        opts,
        fn: function (callback) {
          const tmpLoc = path.join(tmpDir, "babel-process-test", createHash("sha1").update(testLoc).digest("hex"));
          deleteDir(tmpLoc);
          fs.mkdirSync(tmpLoc, {
            recursive: true
          });
          const {
            inFiles
          } = opts;
          for (const filename of Object.keys(inFiles)) {
            outputFileSync(path.join(tmpLoc, filename), inFiles[filename]);
          }
          try {
            beforeHook(test, tmpLoc);
            let args = [];
            if (opts.executor) {
              args.push("--require", path.join(dirname, "./exit-loader.cjs"));
            }
            if (test.binLoc) {
              args.push(test.binLoc);
            }
            args = args.concat(opts.args).map(arg => resolveRootDirOrRootUrlToken(arg));
            const env = {
              ...process.env,
              FORCE_COLOR: "false",
              ...(parseInt(process.versions.node) >= 22 && {
                NODE_OPTIONS: "--disable-warning=ExperimentalWarning"
              }),
              ...opts.env
            };
            const child = spawn(process.execPath, args, {
              env,
              cwd: tmpLoc,
              stdio: opts.executor || opts.ipc ? ["pipe", "pipe", "pipe", "ipc"] : "pipe"
            });
            let stderr = "";
            let stdout = "";
            let ipcMessage;
            child.on("close", function () {
              let err;
              try {
                const result = afterHook ? afterHook(test, tmpLoc, stdout, stderr) : {
                  stdout,
                  stderr
                };
                assertTest(result.stdout, result.stderr, ipcMessage, opts, tmpLoc);
              } catch (e) {
                err = e;
              } finally {
                try {
                  deleteDir(tmpLoc);
                } catch (error) {
                  console.error(error);
                }
              }
              if (err) {
                err.message = args.map(arg => `"${arg}"`).join(" ") + ": " + err.message;
              }
              callback(err);
            });
            if (opts.ipc) {
              child.on("message", function (message) {
                ipcMessage = message;
              });
            }
            if (opts.stdin) {
              child.stdin.write(opts.stdin);
              child.stdin.end();
            }
            const captureOutput = proc => {
              proc.stderr.on("data", function (chunk) {
                stderr += chunk;
              });
              proc.stdout.on("data", function (chunk) {
                stdout += chunk;
              });
            };
            if (opts.executor) {
              const executor = spawn(process.execPath, [opts.executor], {
                cwd: tmpLoc
              });
              child.stdout.pipe(executor.stdin);
              child.stderr.pipe(executor.stdin);
              executor.on("close", function () {
                child.send("exit");
              });
              captureOutput(executor);
            } else {
              captureOutput(child);
            }
          } catch (e) {
            deleteDir(tmpLoc);
            throw e;
          }
        }
      };
      tests.push(test);
    });
  });
  tests.sort(function (testA, testB) {
    const nameA = testA.suiteName + "/" + testA.testName;
    const nameB = testB.suiteName + "/" + testB.testName;
    return nameA.localeCompare(nameB);
  });
  return tests;
}