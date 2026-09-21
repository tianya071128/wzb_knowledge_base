import { SHOULD_SKIP, SHOULD_STOP } from "./index.js";
import * as t from "@babel/types";
export function _call(fns) {
  if (!fns) return false;
  for (const fn of fns) {
    if (!fn) continue;
    const node = this.node;
    if (!node) return true;
    const ret = fn.call(this.state, this, this.state);
    if (ret && typeof ret === "object" && typeof ret.then === "function") {
      throw new Error(`You appear to be using a plugin with an async traversal visitor, ` + `which your current version of Babel does not support. ` + `If you're using a published plugin, you may need to upgrade ` + `your @babel/core version.`);
    }
    if (ret) {
      throw new Error(`Unexpected return value from visitor method ${fn}`);
    }
    if (this.node !== node) return true;
    if (this._traverseFlags > 0) return true;
  }
  return false;
}
export function isDenylisted() {
  return !!this.opts.denylist?.includes(this.node.type);
}
export function skip() {
  this.shouldSkip = true;
}
export function skipKey(key) {
  if (this.skipKeys == null) {
    this.skipKeys = {};
  }
  this.skipKeys[key] = true;
}
export function stop() {
  this._traverseFlags |= SHOULD_SKIP | SHOULD_STOP;
}
export function _forceSetScope() {
  let path = this.parentPath;
  if ((this.key === "key" || this.listKey === "decorators") && path.isMethod() || this.key === "discriminant" && path.isSwitchStatement()) {
    path = path.parentPath;
  }
  let target;
  while (path && !target) {
    target = path.scope;
    path = path.parentPath;
  }
  this.scope = this.getScope(target);
  this.scope?.init();
}
export function setScope() {
  if (this.opts?.noScope) return;
  let path = this.parentPath;
  if ((this.key === "key" || this.listKey === "decorators") && path.isMethod() || this.key === "discriminant" && path.isSwitchStatement()) {
    path = path.parentPath;
  }
  let target;
  while (path && !target) {
    if (path.opts?.noScope) return;
    target = path.scope;
    path = path.parentPath;
  }
  this.scope = this.getScope(target);
  this.scope?.init();
}
export function setContext(context) {
  if (this.skipKeys != null) {
    this.skipKeys = {};
  }
  this._traverseFlags = 0;
  if (context) {
    this.context = context;
    this.state = context.state;
    this.opts = context.opts;
  }
  setScope.call(this);
  return this;
}
export function resync() {
  if (this.removed) return;
  if (this.parentPath) {
    this.parent = this.parentPath.node;
  }
  if (this.parent && this.inList) {
    const newContainer = this.parent[this.listKey];
    if (this.container !== newContainer) {
      this.container = newContainer || null;
    }
  }
  if (this.container && this.node !== this.container[this.key]) {
    let key = -1;
    if (Array.isArray(this.container)) {
      key = this.container.indexOf(this.node);
    } else {
      for (key of Object.keys(this.container)) {
        if (this.container[key] === this.node) {
          break;
        }
      }
    }
    if (key === -1) {
      this.key = null;
    } else {
      _setKey.call(this, key);
    }
  }
}
export function popContext() {
  this.contexts.pop();
  if (this.contexts.length > 0) {
    this.setContext(this.contexts[this.contexts.length - 1]);
  } else {
    this.setContext(undefined);
  }
}
export function pushContext(context) {
  this.contexts.push(context);
  this.setContext(context);
}
export function setup(parentPath, container, listKey, key) {
  this.listKey = listKey;
  this.container = container;
  this.parentPath = parentPath || this.parentPath;
  _setKey.call(this, key);
}
function _setKey(key) {
  this.key = key;
  this.node = this.container[this.key];
  this.type = this.node?.type ?? null;
}
export function requeue(pathToQueue = this) {
  if (pathToQueue.removed) return;
  pathToQueue.shouldSkip = false;
  const contexts = this.contexts;
  for (const context of contexts) {
    context.maybeQueue(pathToQueue);
  }
}
export function requeueComputedKeyAndDecorators() {
  const {
    context,
    node
  } = this;
  if (!t.isPrivate(node) && node.computed) {
    context.maybeQueue(this.get("key"));
  }
  if (node.decorators) {
    for (const decorator of this.get("decorators")) {
      context.maybeQueue(decorator);
    }
  }
}
export function _getQueueContexts() {
  let path = this;
  let contexts = this.contexts;
  while (!contexts.length) {
    path = path.parentPath;
    if (!path) break;
    contexts = path.contexts;
  }
  return contexts;
}