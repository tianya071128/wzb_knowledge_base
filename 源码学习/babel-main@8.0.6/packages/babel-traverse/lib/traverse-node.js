import TraversalContext from "./context.js";
import { Hub } from "./index.js";
import NodePath from "./path/index.js";
import * as _t from "@babel/types";
const {
  VISITOR_KEYS
} = _t;
import { _call, popContext, pushContext, resync } from "./path/context.js";
function _visitPaths(ctx, paths) {
  ctx.queue = paths;
  ctx.priorityQueue = [];
  const visited = new Set();
  let stop = false;
  let visitIndex = 0;
  for (; visitIndex < paths.length;) {
    const path = paths[visitIndex];
    visitIndex++;
    resync.call(path);
    if (path.contexts.length === 0 || path.contexts[path.contexts.length - 1] !== ctx) {
      pushContext.call(path, ctx);
    }
    if (path.key === null) continue;
    const {
      node
    } = path;
    if (visited.has(node)) continue;
    if (node) visited.add(node);
    if (_visit(ctx, path)) {
      stop = true;
      break;
    }
    if (ctx.priorityQueue.length) {
      stop = _visitPaths(ctx, ctx.priorityQueue);
      ctx.priorityQueue = [];
      ctx.queue = paths;
      if (stop) break;
    }
  }
  for (let i = 0; i < visitIndex; i++) {
    popContext.call(paths[i]);
  }
  ctx.queue = null;
  return stop;
}
function _visit(ctx, path) {
  const node = path.node;
  if (!node) {
    return false;
  }
  const opts = ctx.opts;
  const denylist = opts.denylist;
  if (denylist?.includes(node.type)) {
    return false;
  }
  if (opts.shouldSkip?.(path)) {
    return false;
  }
  if (path.shouldSkip) return path.shouldStop;
  if (_call.call(path, opts.enter)) return path.shouldStop;
  if (path.node) {
    if (_call.call(path, opts[node.type]?.enter)) return path.shouldStop;
  }
  path.shouldStop = traverseNode(path.node, opts, path.scope, ctx.state, path, path.skipKeys);
  if (path.node) {
    if (_call.call(path, opts.exit)) return path.shouldStop;
  }
  if (path.node) {
    _call.call(path, opts[node.type]?.exit);
  }
  return path.shouldStop;
}
export function traverseNode(node, opts, scope, state, path, skipKeys, visitSelf) {
  const keys = VISITOR_KEYS[node.type];
  if (!keys?.length) return false;
  const ctx = new TraversalContext(opts, state);
  if (visitSelf) {
    if (skipKeys?.[path.parentKey]) return false;
    return _visitPaths(ctx, [path]);
  }
  const hub = path == null ? node.type === "Program" || node.type === "File" ? new Hub() : undefined : path.hub;
  for (const key of keys) {
    if (skipKeys?.[key]) continue;
    const prop = node[key];
    if (!prop) continue;
    if (Array.isArray(prop)) {
      if (!prop.length) continue;
      const paths = [];
      for (let i = 0; i < prop.length; i++) {
        const childPath = NodePath.get({
          parentPath: path,
          parent: node,
          container: prop,
          key: i,
          listKey: key,
          hub
        });
        paths.push(childPath);
      }
      if (_visitPaths(ctx, paths)) return true;
    } else {
      if (_visitPaths(ctx, [NodePath.get({
        parentPath: path,
        parent: node,
        container: node,
        key,
        listKey: null,
        hub
      })])) {
        return true;
      }
    }
  }
  return false;
}