import { types as t } from "@babel/core";
const leapTypes = new Set(["YieldExpression", "AwaitExpression", "BreakStatement", "ContinueStatement", "ReturnStatement", "ThrowStatement"]);
export function containsLeap(node) {
  if (!node) return false;
  if (node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
    return false;
  }
  if (leapTypes.has(node.type)) return true;
  return containsLeapInChildren(node);
}
const containsLeapInChildrenCache = new WeakMap();
export function containsLeapInChildren(node) {
  if (containsLeapInChildrenCache.has(node)) {
    return containsLeapInChildrenCache.get(node);
  }
  const keys = t.VISITOR_KEYS[node.type];
  if (keys) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const child = node[key];
      if (Array.isArray(child)) {
        if (child.some(containsLeap)) {
          containsLeapInChildrenCache.set(node, true);
          return true;
        }
      } else if (t.isNode(child)) {
        if (containsLeap(child)) {
          containsLeapInChildrenCache.set(node, true);
          return true;
        }
      }
    }
  }
  containsLeapInChildrenCache.set(node, false);
  return false;
}