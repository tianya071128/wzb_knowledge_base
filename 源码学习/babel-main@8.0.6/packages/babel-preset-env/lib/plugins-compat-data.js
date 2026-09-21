import originalPlugins from "@babel/compat-data/plugins" with { type: "json" };
import originalPluginsBugfixes from "@babel/compat-data/plugin-bugfixes" with { type: "json" };
import originalOverlappingPlugins from "@babel/compat-data/overlapping-plugins" with { type: "json" };
import availablePlugins from "./available-plugins.js";
const keys = Object.keys;
export const plugins = filterAvailable(originalPlugins);
export const pluginsBugfixes = filterAvailable(originalPluginsBugfixes);
export const overlappingPlugins = filterAvailable(originalOverlappingPlugins);
function filterAvailable(data) {
  const result = {};
  for (const plugin of keys(data)) {
    if (Object.hasOwn(availablePlugins, plugin)) {
      result[plugin] = data[plugin];
    }
  }
  return result;
}