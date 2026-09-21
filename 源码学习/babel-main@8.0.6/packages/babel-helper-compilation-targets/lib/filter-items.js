import { isGreaterThan, isValid } from "verkit";
import pluginsCompatData from "@babel/compat-data/plugins" with { type: "json" };
import { getLowestImplementedVersion, isUnreleasedVersion, semverify } from "./utils.js";
export function targetsSupported(target, support) {
  const targetEnvironments = Object.keys(target);
  if (targetEnvironments.length === 0) {
    return false;
  }
  const unsupportedEnvironments = targetEnvironments.filter(environment => {
    const lowestImplementedVersion = getLowestImplementedVersion(support, environment);
    if (!lowestImplementedVersion) {
      return true;
    }
    const lowestTargetedVersion = target[environment];
    if (isUnreleasedVersion(lowestTargetedVersion, environment)) {
      return false;
    }
    if (isUnreleasedVersion(lowestImplementedVersion, environment)) {
      return true;
    }
    if (!isValid(lowestTargetedVersion.toString())) {
      throw new Error(`Invalid version passed for target "${environment}": "${lowestTargetedVersion}". ` + "Versions must be in semver format (major.minor.patch)");
    }
    return isGreaterThan(semverify(lowestImplementedVersion), lowestTargetedVersion.toString());
  });
  return unsupportedEnvironments.length === 0;
}
export function isRequired(name, targets, {
  compatData = pluginsCompatData,
  includes,
  excludes
} = {}) {
  if (excludes?.has(name)) return false;
  if (includes?.has(name)) return true;
  return !targetsSupported(targets, compatData[name]);
}
export default function filterItems(list, includes, excludes, targets, defaultIncludes, defaultExcludes, pluginSyntaxMap) {
  const result = new Set();
  const options = {
    compatData: list,
    includes,
    excludes
  };
  for (const item in list) {
    if (isRequired(item, targets, options)) {
      result.add(item);
    } else if (pluginSyntaxMap) {
      const shippedProposalsSyntax = pluginSyntaxMap.get(item);
      if (shippedProposalsSyntax) {
        result.add(shippedProposalsSyntax);
      }
    }
  }
  defaultIncludes?.forEach(item => !excludes.has(item) && result.add(item));
  defaultExcludes?.forEach(item => !includes.has(item) && result.delete(item));
  return result;
}