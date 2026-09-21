import shallowEqual from "./shallowEqual.js";
export default function isType(type, node, opts) {
  return node?.type === type && (opts == null || shallowEqual(node, opts));
}