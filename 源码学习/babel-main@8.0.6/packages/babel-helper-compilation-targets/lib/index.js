import browserslist from "browserslist";
import { findSuggestion } from "@babel/helper-validator-option";
import browserModulesData from "@babel/compat-data/native-modules" with { type: "json" };
import flru from "flru";
import { semverify, semverMin, isUnreleasedVersion, getLowestUnreleased, getHighestUnreleased } from "./utils.js";
import { OptionValidator } from "@babel/helper-validator-option";
import { browserNameMap } from "./targets.js";
import { TargetNames } from "./options.js";
export { prettifyTargets } from "./pretty.js";
export { getInclusionReasons } from "./debug.js";
export { default as filterItems, isRequired } from "./filter-items.js";
export { unreleasedLabels } from "./targets.js";
export { TargetNames };
const ESM_SUPPORT = browserModulesData["es6.module"];
const v = new OptionValidator("@babel/helper-compilation-targets");
function validateTargetNames(targets) {
  const validTargets = Object.keys(TargetNames);
  for (const target of Object.keys(targets)) {
    if (!(target in TargetNames)) {
      throw new Error(v.formatMessage(`'${target}' is not a valid target
- Did you mean '${findSuggestion(target, validTargets)}'?`));
    }
  }
  return targets;
}
export function isBrowsersQueryValid(browsers) {
  return typeof browsers === "string" || Array.isArray(browsers) && browsers.every(b => typeof b === "string");
}
function validateBrowsers(browsers) {
  v.invariant(browsers === undefined || isBrowsersQueryValid(browsers), `'${String(browsers)}' is not a valid browserslist query`);
  return browsers;
}
function getLowestVersions(browsers) {
  return browsers.reduce((all, browser) => {
    const [browserName, browserVersion] = browser.split(" ");
    const target = browserNameMap[browserName];
    if (!target) {
      return all;
    }
    try {
      const splitVersion = browserVersion.split("-")[0].toLowerCase();
      const isSplitUnreleased = isUnreleasedVersion(splitVersion, target);
      if (!all[target]) {
        all[target] = isSplitUnreleased ? splitVersion : semverify(splitVersion);
        return all;
      }
      const version = all[target];
      const isUnreleased = isUnreleasedVersion(version, target);
      if (isUnreleased && isSplitUnreleased) {
        all[target] = getLowestUnreleased(version, splitVersion, target);
      } else if (isUnreleased) {
        all[target] = semverify(splitVersion);
      } else if (!isUnreleased && !isSplitUnreleased) {
        const parsedBrowserVersion = semverify(splitVersion);
        all[target] = semverMin(version, parsedBrowserVersion);
      }
    } catch (_) {}
    return all;
  }, {});
}
function outputDecimalWarning(decimalTargets) {
  if (!decimalTargets.length) {
    return;
  }
  console.warn("Warning, the following targets are using a decimal version:\n");
  decimalTargets.forEach(({
    target,
    value
  }) => console.warn(`  ${target}: ${value}`));
  console.warn(`
We recommend using a string for minor/patch versions to avoid numbers like 6.10
getting parsed as 6.1, which can lead to unexpected behavior.
`);
}
function semverifyTarget(target, value) {
  try {
    return semverify(value);
  } catch (e) {
    throw new Error(v.formatMessage(`'${value}' is not a valid value for 'targets.${target}'.`), {
      cause: e
    });
  }
}
function nodeTargetParser(value) {
  const parsed = value === true || value === "current" ? process.versions.node.split("-")[0] : semverifyTarget("node", value);
  return ["node", parsed];
}
function defaultTargetParser(target, value) {
  const version = isUnreleasedVersion(value, target) ? value.toLowerCase() : semverifyTarget(target, value);
  return [target, version];
}
function generateTargets(inputTargets) {
  const input = {
    ...inputTargets
  };
  delete input.esmodules;
  delete input.browsers;
  return input;
}
function resolveTargets(queries, env) {
  const resolved = browserslist(queries, {
    mobileToDesktop: true,
    env
  });
  return getLowestVersions(resolved);
}
const targetsCache = flru(64);
function resolveTargetsCached(queries, env) {
  const cacheKey = typeof queries === "string" ? queries : queries.join() + env;
  let cached = targetsCache.get(cacheKey);
  if (!cached) {
    cached = resolveTargets(queries, env);
    targetsCache.set(cacheKey, cached);
  }
  return {
    ...cached
  };
}
export default function getTargets(inputTargets = {}, options = {}) {
  let {
    browsers,
    esmodules
  } = inputTargets;
  const {
    configPath = ".",
    onBrowserslistConfigFound
  } = options;
  validateBrowsers(browsers);
  const input = generateTargets(inputTargets);
  let targets = validateTargetNames(input);
  const shouldParseBrowsers = !!browsers;
  const hasTargets = shouldParseBrowsers || Object.keys(targets).length > 0;
  const shouldSearchForConfig = !options.ignoreBrowserslistConfig && !hasTargets;
  if (!browsers && shouldSearchForConfig) {
    browsers = process.env.BROWSERSLIST;
    if (!browsers) {
      const configFile = options.configFile || process.env.BROWSERSLIST_CONFIG || browserslist.findConfigFile(configPath);
      if (configFile != null) {
        onBrowserslistConfigFound?.(configFile);
        browsers = browserslist.loadConfig({
          config: configFile,
          env: options.browserslistEnv
        });
      }
    }
    if (browsers == null) {
      browsers = ["defaults"];
    }
  }
  if (esmodules && !browsers?.length) {
    browsers = Object.keys(ESM_SUPPORT).map(browser => `${browser} >= ${ESM_SUPPORT[browser]}`).join(", ");
    esmodules = false;
  }
  if (browsers?.length) {
    const queryBrowsers = resolveTargetsCached(browsers, options.browserslistEnv);
    if (esmodules) {
      for (const browser of Object.keys(queryBrowsers)) {
        if (browser !== "deno" && browser !== "ie") {
          const esmSupportVersion = ESM_SUPPORT[browser === "opera_mobile" ? "op_mob" : browser];
          if (esmSupportVersion) {
            const version = queryBrowsers[browser];
            queryBrowsers[browser] = getHighestUnreleased(version, semverify(esmSupportVersion), browser);
          } else {
            delete queryBrowsers[browser];
          }
        } else {
          delete queryBrowsers[browser];
        }
      }
    }
    targets = Object.assign(queryBrowsers, targets);
  }
  const result = {};
  const decimalWarnings = [];
  for (const target of Object.keys(targets).sort()) {
    const value = targets[target];
    if (typeof value === "number" && value % 1 !== 0) {
      decimalWarnings.push({
        target,
        value
      });
    }
    const [parsedTarget, parsedValue] = target === "node" ? nodeTargetParser(value) : defaultTargetParser(target, value);
    if (parsedValue) {
      result[parsedTarget] = parsedValue;
    }
  }
  outputDecimalWarning(decimalWarnings);
  return result;
}