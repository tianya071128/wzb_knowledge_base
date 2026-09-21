import { hooks } from "./lib/removal-hooks.js";
import { getCachedPaths } from "../cache.js";
import { _replaceWith } from "./replacement.js";
import { REMOVED, SHOULD_SKIP } from "./index.js";
import * as t from "@babel/types";
import { updateSiblingKeys } from "./modification.js";
import { resync } from "./context.js";
export function remove() {
  _assertUnremoved.call(this);
  resync.call(this);
  const handledByHook = this.parentPath && hooks.some(fn => fn(this, this.parentPath));
  if (!handledByHook) {
    if (this.node && !this.opts?.noScope) {
      const bindings = t.getBindingIdentifiers(this.node, false, false, true);
      Object.keys(bindings).forEach(name => this.scope.removeBinding(name));
    }
    this.shareCommentsWithSiblings();
    if (Array.isArray(this.container)) {
      this.container.splice(this.key, 1);
      updateSiblingKeys.call(this, this.key, -1);
    } else {
      _replaceWith.call(this, null);
    }
  }
  this._traverseFlags |= SHOULD_SKIP | REMOVED;
  if (this.parent) {
    getCachedPaths(this)?.delete(this.node);
  }
  this.node = null;
}
export function _assertUnremoved() {
  if (this.removed) {
    throw this.buildCodeFrameError("NodePath has been removed so is read-only.");
  }
}