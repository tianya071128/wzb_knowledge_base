import * as _t from "@babel/types";
const {
  VISITOR_KEYS
} = _t;
import { NodePath } from "../index.js";
import { explode } from "../visitors.js";
import { _forceSetScope } from "../path/context.js";
export default function traverseForScope(path, visitors, state) {
  const exploded = explode(visitors);
  if (exploded.enter || exploded.exit) {
    throw new Error("Should not be used with enter/exit visitors.");
  }
  _traverse(path.parentPath, path.parent, path.node, path.container, path.key, path.listKey, path.hub, path);
  function _traverse(parentPath, parent, node, container, key, listKey, hub, inPath) {
    if (!node) {
      return;
    }
    const path = inPath || NodePath.get({
      hub,
      parentPath,
      parent,
      container,
      listKey,
      key
    });
    _forceSetScope.call(path);
    const visitor = exploded[node.type];
    if (visitor?.enter) {
      for (const visit of visitor.enter) {
        visit.call(state, path, state);
      }
    }
    if (path.shouldSkip) {
      return;
    }
    const keys = VISITOR_KEYS[node.type];
    if (!keys?.length) {
      return;
    }
    for (const key of keys) {
      const prop = node[key];
      if (!prop) continue;
      if (Array.isArray(prop)) {
        for (let i = 0; i < prop.length; i++) {
          const value = prop[i];
          _traverse(path, node, value, prop, i, key);
        }
      } else {
        _traverse(path, node, prop, node, key, null);
      }
    }
    if (visitor?.exit) {
      for (const visit of visitor.exit) {
        visit.call(state, path, state);
      }
    }
  }
}