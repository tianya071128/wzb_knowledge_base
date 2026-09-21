import path from "node:path";
import child_process from "node:child_process";
import { fileURLToPath } from "node:url";
import getV8FlagsRaw from "v8flags";
import { splitArgs, nodeFlagsWithValue } from "./split-args.js";
import { program } from "./program-setup.js";
function getV8Flags() {
  function getNormalizedV8Flag(arg) {
    const matches = /--(?:no)?(.+)/.exec(arg);
    if (matches) {
      return `--${matches[1].replace(/_/g, "-")}`;
    }
    return arg;
  }
  return new Promise((resolve, reject) => {
    getV8FlagsRaw((err, flags) => {
      if (err) {
        reject(err);
        return;
      }
      const flagsSet = new Set(flags.map(getNormalizedV8Flag));
      resolve(test => flagsSet.has(getNormalizedV8Flag(test)) || process.allowedNodeEnvironmentFlags.has(test));
    });
  });
}
const babelNodePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "_babel-node");
(async () => {
  const babelOptions = new Set([]);
  const babelOptionsWithValue = new Set([]);
  for (const option of program.options) {
    const hasValue = option.flags.includes("[");
    if (option.short) {
      babelOptions.add(option.short);
      if (hasValue) babelOptionsWithValue.add(option.short);
    }
    if (option.long) {
      babelOptions.add(option.long);
      if (hasValue) babelOptionsWithValue.add(option.long);
    }
  }
  const {
    programArgs,
    fileName,
    userArgs,
    explicitSeparator
  } = splitArgs(process.argv.slice(2), babelOptionsWithValue);
  const babelArgs = [];
  const nodeArgs = [];
  for (let i = 0; i < programArgs.length; i++) {
    const arg = programArgs[i];
    const list = babelOptions.has(arg.split("=")[0]) ? babelArgs : nodeArgs;
    list.push(arg);
    if (i + 1 < programArgs.length && !programArgs[i + 1].startsWith("-")) {
      list.push(programArgs[++i]);
    }
  }
  if (!explicitSeparator) {
    const isV8flag = await getV8Flags();
    const ambiguousArgsNames = [];
    const ambiguousArgs = [];
    let unambiguousArgs = null;
    for (let i = 0; i < userArgs.length; i++) {
      const [arg, value] = userArgs[i].split("=");
      if (babelOptions.has(arg) || isV8flag(arg)) {
        unambiguousArgs ??= userArgs.slice(0, i);
        ambiguousArgsNames.push(arg);
        ambiguousArgs.push(userArgs[i]);
        if (value === undefined && (babelOptionsWithValue.has(arg) || nodeFlagsWithValue.has(arg)) && i + 1 < userArgs.length) {
          ambiguousArgs.push(userArgs[++i]);
        }
      } else {
        unambiguousArgs?.push(userArgs[i]);
      }
    }
    if (ambiguousArgsNames.length > 0) {
      const them = ambiguousArgsNames.length === 1 ? "it" : "them";
      const they = ambiguousArgsNames.length === 1 ? "it" : "they";
      const are = ambiguousArgsNames.length === 1 ? "is" : "are";
      console.warn(`Warning: ${ambiguousArgsNames.join(", ")} ${are} a valid option for Babel or Node.js, ` + `but ${they} ${are} defined after the script name. Up to Babel 7 ${they} would have ` + `been passed to Babel, while now ${they} ${are} passed to the script itself.\n` + `  If the intention is to pass ${them} to Babel, move ${them} before the filename:\n` + `    babel-node ${programArgs.join(" ")} ${ambiguousArgs.join(" ")} ${fileName} ${unambiguousArgs.join(" ")}\n` + `  If passing ${them} to the script is intended, you can silence this warning by explicitly ` + `using the -- separator before the script name:\n` + `    babel-node ${programArgs.join(" ")} -- ${fileName} ${userArgs.join(" ")}`);
    }
  }
  await spawn([...nodeArgs, "--", babelNodePath, ...babelArgs, "--", fileName, ...userArgs]);
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
async function spawn(args) {
  try {
    const {
      default: kexec
    } = await import("kexec");
    kexec(process.argv[0], args);
  } catch (err) {
    if (err.code !== "ERR_MODULE_NOT_FOUND" && err.code !== "MODULE_NOT_FOUND" && err.code !== "UNDECLARED_DEPENDENCY") {
      throw err;
    }
    const shouldPassthroughIPC = process.send !== undefined;
    const proc = child_process.spawn(process.argv[0], args, {
      stdio: shouldPassthroughIPC ? ["inherit", "inherit", "inherit", "ipc"] : "inherit"
    });
    proc.on("exit", function (code, signal) {
      process.on("exit", function () {
        if (signal) {
          process.kill(process.pid, signal);
        } else {
          process.exitCode = code ?? undefined;
        }
      });
    });
    if (shouldPassthroughIPC) {
      proc.on("message", message => process.send(message));
    }
    process.on("SIGINT", () => proc.kill("SIGINT"));
    process.on("SIGTERM", () => proc.kill("SIGTERM"));
  }
}