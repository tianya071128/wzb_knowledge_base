import { transformFromAstSync as babelTransformFromAstSync, transformFromAstAsync as babelTransformFromAstAsync, transformSync as babelTransformSync, transformAsync as babelTransformAsync, buildExternalHelpers as babelBuildExternalHelpers } from "@babel/core";
import { all } from "./generated/plugins.js";
import preset2015 from "./preset-es2015.js";
import presetStage0 from "./preset-stage-0.js";
import presetStage1 from "./preset-stage-1.js";
import presetStage2 from "./preset-stage-2.js";
import presetStage3 from "./preset-stage-3.js";
import presetEnv from "@babel/preset-env";
import presetFlow from "@babel/preset-flow";
import presetReact from "@babel/preset-react";
import presetTypescript from "@babel/preset-typescript";
import { runScripts } from "./transformScriptTags.js";
export * as packages from "./packages.js";
import legacyPluginAliases from "../../babel-compat-data/scripts/data/legacy-plugin-aliases.mjs";
for (const name in legacyPluginAliases) {
  all[legacyPluginAliases[name]] = all[name];
}
all["proposal-unicode-sets-regex"] = all["transform-unicode-sets-regex"];
export const availablePlugins = {};
registerPlugins(all);
export const availablePresets = {
  env: presetEnv,
  es2015: preset2015,
  es2016: () => {
    return {
      plugins: [availablePlugins["transform-exponentiation-operator"]]
    };
  },
  es2017: () => {
    return {
      plugins: [availablePlugins["transform-async-to-generator"]]
    };
  },
  react: presetReact,
  "stage-0": presetStage0,
  "stage-1": presetStage1,
  "stage-2": presetStage2,
  "stage-3": presetStage3,
  "es2015-loose": {
    presets: [[preset2015, {
      loose: true
    }]]
  },
  "es2015-no-commonjs": {
    presets: [[preset2015, {
      modules: false
    }]]
  },
  typescript: presetTypescript,
  flow: presetFlow
};
const isArray = Array.isArray || (arg => Object.prototype.toString.call(arg) === "[object Array]");
function loadBuiltin(builtinTable, name) {
  if (isArray(name) && typeof name[0] === "string") {
    if (Object.hasOwn(builtinTable, name[0])) {
      return [builtinTable[name[0]]].concat(name.slice(1));
    }
    return;
  } else if (typeof name === "string") {
    return builtinTable[name];
  }
  return name;
}
function getPluginOrPresetName(item) {
  if (typeof item === "string") {
    return item;
  } else if (isArray(item)) {
    return getPluginOrPresetName(item[0]);
  }
  return JSON.stringify(item);
}
function processOptions(options) {
  const presets = (options.presets || []).map(presetName => {
    const preset = loadBuiltin(availablePresets, presetName);
    if (preset) {
      if (isArray(preset) && typeof preset[0] === "object" && Object.hasOwn(preset[0], "buildPreset")) {
        preset[0] = {
          ...preset[0],
          buildPreset: preset[0].buildPreset
        };
      }
    } else {
      throw new Error(`Invalid preset specified in Babel options: "${getPluginOrPresetName(presetName)}"`);
    }
    return preset;
  });
  const plugins = (options.plugins || []).map(pluginName => {
    const plugin = loadBuiltin(availablePlugins, pluginName);
    if (!plugin) {
      throw new Error(`Invalid plugin specified in Babel options: "${getPluginOrPresetName(pluginName)}"`);
    }
    return plugin;
  });
  return {
    babelrc: false,
    ...options,
    presets,
    plugins
  };
}
export function transform(code, options) {
  return babelTransformSync(code, processOptions(options));
}
export function transformAsync(code, options) {
  return babelTransformAsync(code, processOptions(options));
}
export function transformFromAst(ast, code, options) {
  return babelTransformFromAstSync(ast, code, processOptions(options));
}
export function transformFromAstAsync(ast, code, options) {
  return babelTransformFromAstAsync(ast, code, processOptions(options));
}
export const buildExternalHelpers = babelBuildExternalHelpers;
export function registerPlugin(name, plugin) {
  if (Object.hasOwn(availablePlugins, name)) {
    console.warn(`A plugin named "${name}" is already registered, it will be overridden`);
  }
  availablePlugins[name] = plugin;
}
export function registerPlugins(newPlugins) {
  Object.keys(newPlugins).forEach(name => registerPlugin(name, newPlugins[name]));
}
export function registerPreset(name, preset) {
  if (Object.hasOwn(availablePresets, name)) {
    if (name === "env") {
      console.warn("@babel/preset-env is now included in @babel/standalone, please remove @babel/preset-env-standalone");
    } else {
      console.warn(`A preset named "${name}" is already registered, it will be overridden`);
    }
  }
  availablePresets[name] = preset;
}
export function registerPresets(newPresets) {
  Object.keys(newPresets).forEach(name => registerPreset(name, newPresets[name]));
}
export const version = VERSION;
function onDOMContentLoaded() {
  transformScriptTags();
}
if (typeof window !== "undefined" && window?.addEventListener) {
  window.addEventListener("DOMContentLoaded", onDOMContentLoaded, false);
}
export function transformScriptTags(scriptTags) {
  runScripts(transform, scriptTags);
}
export function disableScriptTags() {
  window.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
}