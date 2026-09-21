import { isLessThan, isValid } from "verkit";
import { OptionValidator } from "@babel/helper-validator-option";
import { unreleasedLabels } from "./targets.js";
const versionRegExp = /^(?:\d+|\d(?:\d?[^\d\n\r\u2028\u2029]\d+|\d{2,}(?:[^\d\n\r\u2028\u2029]\d+)?))$/;
const v = new OptionValidator("@babel/helper-compilation-targets");
export function semverMin(first, second) {
  return first && isLessThan(first, second) ? first : second;
}
export function semverify(version) {
  if (typeof version === "string" && isValid(version)) {
    return version;
  }
  v.invariant(typeof version === "number" || typeof version === "string" && versionRegExp.test(version), `'${version}' is not a valid version`);
  version = version.toString();
  let pos = 0;
  let num = 0;
  while ((pos = version.indexOf(".", pos + 1)) > 0) {
    num++;
  }
  return version + ".0".repeat(2 - num);
}
export function isUnreleasedVersion(version, env) {
  const unreleasedLabel = unreleasedLabels[env];
  return !!unreleasedLabel && unreleasedLabel === version.toString().toLowerCase();
}
export function getLowestUnreleased(a, b, env) {
  const unreleasedLabel = unreleasedLabels[env];
  if (a === unreleasedLabel) {
    return b;
  }
  if (b === unreleasedLabel) {
    return a;
  }
  return semverMin(a, b);
}
export function getHighestUnreleased(a, b, env) {
  return getLowestUnreleased(a, b, env) === a ? b : a;
}
export function getLowestImplementedVersion(plugin, environment) {
  const result = plugin[environment];
  if (!result && environment === "android") {
    return plugin.chrome;
  }
  return result;
}