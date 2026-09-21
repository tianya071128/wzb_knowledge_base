export const FEATURES = Object.freeze({
  unicodeFlag: 1 << 0,
  dotAllFlag: 1 << 1,
  unicodePropertyEscape: 1 << 2,
  namedCaptureGroups: 1 << 3,
  unicodeSetsFlag_syntax: 1 << 4,
  unicodeSetsFlag: 1 << 5,
  duplicateNamedCaptureGroups: 1 << 6,
  modifiers: 1 << 7
});
export const featuresKey = "@babel/plugin-regexp-features/featuresKey";
export const runtimeKey = "@babel/plugin-regexp-features/runtimeKey";
export function enableFeature(features, feature) {
  return features | feature;
}
export function hasFeature(features, feature) {
  return !!(features & feature);
}