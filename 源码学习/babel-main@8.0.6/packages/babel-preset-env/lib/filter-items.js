import { isLessThan } from "verkit";
import { minVersions } from "./available-plugins.js";
export function addProposalSyntaxPlugins(items, proposalSyntaxPlugins) {
  proposalSyntaxPlugins.forEach(plugin => {
    items.add(plugin);
  });
}
export function removeUnnecessaryItems(items, overlapping) {
  items.forEach(item => {
    overlapping[item]?.forEach(name => items.delete(name));
  });
}
export function removeUnsupportedItems(items, babelVersion) {
  items.forEach(item => {
    if (Object.hasOwn(minVersions, item) && isLessThan(babelVersion, minVersions[item])) {
      items.delete(item);
    }
  });
}