import { isLessThan, normalize } from "verkit";
import { logPlugin } from "./debug.js";
import { addProposalSyntaxPlugins, removeUnnecessaryItems, removeUnsupportedItems } from "./filter-items.js";
import moduleTransformations from "./module-transformations.js";
import normalizeOptions from "./normalize-options.js";
import { pluginSyntaxMap, proposalPlugins, proposalSyntaxPlugins } from "./shipped-proposals.js";
import { plugins as pluginsList, pluginsBugfixes as pluginsBugfixesList, overlappingPlugins } from "./plugins-compat-data.js";
import pluginCoreJS3 from "babel-plugin-polyfill-corejs3";
import getTargets, { prettifyTargets, filterItems } from "@babel/helper-compilation-targets";
import availablePlugins from "./available-plugins.js";
import { declarePreset } from "@babel/helper-plugin-utils";
export function isPluginRequired(targets, support) {
  throw new Error("`isPluginRequired` has been removed in Babel 8. Please use `isRequired` from `@babel/helper-compilation-targets` instead.");
}
function filterStageFromList(list, stageList) {
  return Object.keys(list).reduce((result, item) => {
    if (!stageList.has(item)) {
      result[item] = list[item];
    }
    return result;
  }, {});
}
const pluginsListWithProposals = Object.assign({}, pluginsList, pluginsBugfixesList);
const pluginsListWithoutProposals = filterStageFromList(pluginsListWithProposals, proposalPlugins);
const getPlugin = pluginName => {
  const plugin = availablePlugins[pluginName]();
  if (!plugin) {
    throw new Error(`Could not find plugin "${pluginName}". Ensure there is an entry in ./available-plugins.js for it.`);
  }
  return plugin;
};
export const transformIncludesAndExcludes = opts => {
  return opts.reduce((result, opt) => {
    const target = /^(?:es|es6|es7|esnext|web)\./.test(opt) ? "builtIns" : "plugins";
    result[target].add(opt);
    return result;
  }, {
    all: opts,
    plugins: new Set(),
    builtIns: new Set()
  });
};
function getSpecialModulesPluginNames(modules, shouldTransformDynamicImport) {
  const modulesPluginNames = [];
  if (modules) {
    modulesPluginNames.push(moduleTransformations[modules]);
  }
  if (shouldTransformDynamicImport) {
    if (modules && modules !== "umd") {
      modulesPluginNames.push("transform-dynamic-import");
    } else {
      console.warn("Dynamic import can only be transformed when transforming ES" + " modules to AMD, CommonJS or SystemJS.");
    }
  }
  return modulesPluginNames;
}
const getCoreJSOptions = ({
  useBuiltIns,
  corejs,
  polyfillTargets,
  include,
  exclude,
  proposals,
  shippedProposals,
  debug
}) => ({
  method: `${useBuiltIns}-global`,
  version: corejs ? normalize(corejs) : undefined,
  targets: polyfillTargets,
  include,
  exclude,
  proposals,
  shippedProposals,
  debug,
  "#__secret_key__@babel/preset-env__compatibility": {
    noRuntimeName: true
  }
});
function getLocalTargets(optionsTargets, ignoreBrowserslistConfig, configPath, browserslistEnv, api) {
  if (optionsTargets?.esmodules && optionsTargets.browsers) {
    console.warn(`
@babel/preset-env: esmodules and browsers targets have been specified together.
\`browsers\` target, \`${optionsTargets.browsers.toString()}\` will be ignored.
`);
  }
  return getTargets(optionsTargets, {
    ignoreBrowserslistConfig,
    configPath,
    browserslistEnv,
    onBrowserslistConfigFound(config) {
      api.addExternalDependency(config);
    }
  });
}
function supportsStaticESM(caller) {
  return caller?.supportsStaticESM ?? true;
}
function supportsDynamicImport(caller) {
  return caller?.supportsDynamicImport ?? true;
}
function supportsExportNamespaceFrom(caller) {
  return caller?.supportsExportNamespaceFrom ?? null;
}
export default declarePreset((api, opts) => {
  api.assertVersion("8.0.6");
  const babelTargets = api.targets();
  if ("loose" in opts || "spec" in opts) {
    throw new Error("@babel/preset-env: The 'loose' and 'spec' options have been removed, " + "and you should configure granular compiler assumptions instead. See " + "https://babeljs.io/assumptions for more information.");
  }
  const {
    configPath,
    debug,
    exclude: optionsExclude,
    forceAllTransforms,
    ignoreBrowserslistConfig,
    include: optionsInclude,
    modules: optionsModules,
    shippedProposals,
    targets: optionsTargets,
    useBuiltIns,
    corejs: {
      version: corejs,
      proposals
    },
    browserslistEnv
  } = normalizeOptions(opts);
  let targets = babelTargets;
  if (isLessThan(api.version, "7.13.0") || opts.targets || opts.configPath || opts.browserslistEnv || opts.ignoreBrowserslistConfig) {
    targets = getLocalTargets(optionsTargets, ignoreBrowserslistConfig, configPath, browserslistEnv, api);
  }
  const transformTargets = forceAllTransforms ? {} : targets;
  const include = transformIncludesAndExcludes(optionsInclude);
  const exclude = transformIncludesAndExcludes(optionsExclude);
  const compatData = shippedProposals ? pluginsListWithProposals : pluginsListWithoutProposals;
  const modules = optionsModules === "auto" ? api.caller(supportsStaticESM) ? false : "commonjs" : optionsModules;
  const shouldTransformDynamicImport = optionsModules === "auto" ? !api.caller(supportsDynamicImport) : !!modules;
  if (!exclude.plugins.has("transform-export-namespace-from") && (modules !== false || optionsModules === "auto" && !api.caller(supportsExportNamespaceFrom))) {
    include.plugins.add("transform-export-namespace-from");
  }
  const pluginNames = filterItems(compatData, include.plugins, exclude.plugins, transformTargets, getSpecialModulesPluginNames(modules, shouldTransformDynamicImport), undefined, pluginSyntaxMap);
  if (shippedProposals) {
    addProposalSyntaxPlugins(pluginNames, proposalSyntaxPlugins);
  }
  removeUnsupportedItems(pluginNames, api.version);
  removeUnnecessaryItems(pluginNames, overlappingPlugins);
  const polyfillPlugins = useBuiltIns ? [[pluginCoreJS3, getCoreJSOptions({
    useBuiltIns,
    corejs,
    polyfillTargets: targets,
    include: include.builtIns,
    exclude: exclude.builtIns,
    proposals,
    shippedProposals,
    debug
  })]] : [];
  const pluginUseBuiltIns = useBuiltIns !== false;
  const plugins = Array.from(pluginNames).map(pluginName => {
    return [getPlugin(pluginName), {
      useBuiltIns: pluginUseBuiltIns
    }];
  }).concat(polyfillPlugins);
  if (debug) {
    console.log("@babel/preset-env: `DEBUG` option");
    console.log("\nUsing targets:");
    console.log(JSON.stringify(prettifyTargets(targets), null, 2));
    console.log(`\nUsing modules transform: ${optionsModules.toString()}`);
    console.log("\nUsing plugins:");
    pluginNames.forEach(pluginName => {
      logPlugin(pluginName, targets, compatData);
    });
    if (!useBuiltIns) {
      console.log("\nUsing polyfills: No polyfills were added, since the `useBuiltIns` option was not set.");
    }
  }
  return {
    plugins
  };
});