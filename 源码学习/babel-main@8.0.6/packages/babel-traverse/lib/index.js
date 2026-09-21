import "./path/context.js";
import * as visitors from "./visitors.js";
import * as _t from "@babel/types";
const {
  VISITOR_KEYS,
  removeProperties,
  traverseFast
} = _t;
import * as cache from "./cache.js";
import { traverseNode } from "./traverse-node.js";
export { default as NodePath } from "./path/index.js";
export { default as Scope } from "./scope/index.js";
export { default as Hub } from "./hub.js";
export { visitors };
function traverse(parent, opts = {}, scope, state, parentPath, visitSelf) {
  if (!parent) return;
  if (!opts.noScope && !scope) {
    if (parent.type !== "Program" && parent.type !== "File") {
      throw new Error("You must pass a scope and parentPath unless traversing a Program/File. " + `Instead of that you tried to traverse a ${parent.type} node without ` + "passing scope and parentPath.");
    }
  }
  if (!parentPath && visitSelf) {
    throw new Error("visitSelf can only be used when providing a NodePath.");
  }
  if (!VISITOR_KEYS[parent.type]) {
    return;
  }
  visitors.explode(opts);
  traverseNode(parent, opts, scope, state, parentPath, undefined, visitSelf);
}
export default traverse;
traverse.visitors = visitors;
traverse.verify = visitors.verify;
traverse.explode = visitors.explode;
traverse.cheap = function (node, enter) {
  traverseFast(node, enter);
  return;
};
traverse.node = function (node, opts, scope, state, path, skipKeys) {
  traverseNode(node, opts, scope, state, path, skipKeys);
};
traverse.clearNode = function (node, opts) {
  removeProperties(node, opts);
};
traverse.removeProperties = function (tree, opts) {
  traverseFast(tree, traverse.clearNode, opts);
  return tree;
};
traverse.hasType = function (tree, type, denylistTypes) {
  if (denylistTypes?.includes(tree.type)) return false;
  if (tree.type === type) return true;
  return traverseFast(tree, function (node) {
    if (denylistTypes?.includes(node.type)) {
      return traverseFast.skip;
    }
    if (node.type === type) {
      return traverseFast.stop;
    }
  });
};
traverse.cache = cache;