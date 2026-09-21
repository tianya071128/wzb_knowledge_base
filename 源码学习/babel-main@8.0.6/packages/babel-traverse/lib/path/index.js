import * as virtualTypes from "./lib/virtual-types.js";
import { createDebug } from "obug";
import traverse from "../index.js";
import Scope from "../scope/index.js";
import * as _t from "@babel/types";
const {
  validate
} = _t;
import * as t from "@babel/types";
import * as cache from "../cache.js";
import generator from "@babel/generator";
import * as NodePath_ancestry from "./ancestry.js";
import * as NodePath_inference from "./inference/index.js";
import * as NodePath_replacement from "./replacement.js";
import * as NodePath_evaluation from "./evaluation.js";
import * as NodePath_conversion from "./conversion.js";
import * as NodePath_introspection from "./introspection.js";
import * as NodePath_context from "./context.js";
import * as NodePath_removal from "./removal.js";
import * as NodePath_modification from "./modification.js";
import * as NodePath_family from "./family.js";
import * as NodePath_comments from "./comments.js";
import * as NodePath_virtual_types_validator from "./lib/virtual-types-validator.js";
import { setup } from "./context.js";
const debug = createDebug("babel");
export const REMOVED = 1 << 0;
export const SHOULD_STOP = 1 << 1;
export const SHOULD_SKIP = 1 << 2;
const NodePath_Final = class NodePath {
  constructor(hub, parent) {
    this.parent = parent;
    this.hub = hub;
    this.data = null;
    this.context = null;
    this.scope = null;
  }
  contexts = [];
  state = null;
  _traverseFlags = 0;
  get removed() {
    return (this._traverseFlags & 1) > 0;
  }
  set removed(v) {
    if (v) this._traverseFlags |= 1;else this._traverseFlags &= -2;
  }
  get shouldStop() {
    return (this._traverseFlags & 2) > 0;
  }
  set shouldStop(v) {
    if (v) this._traverseFlags |= 2;else this._traverseFlags &= -3;
  }
  get shouldSkip() {
    return (this._traverseFlags & 4) > 0;
  }
  set shouldSkip(v) {
    if (v) this._traverseFlags |= 4;else this._traverseFlags &= -5;
  }
  skipKeys = null;
  parentPath = null;
  container = null;
  listKey = null;
  key = null;
  node = null;
  type = null;
  _store = null;
  static get({
    hub,
    parentPath,
    parent,
    container,
    listKey,
    key
  }) {
    if (!hub && parentPath) {
      hub = parentPath.hub;
    }
    if (!parent) {
      throw new Error("To get a node path the parent needs to exist");
    }
    const targetNode = container[key];
    const paths = cache.getOrCreateCachedPaths(parent, parentPath);
    let path = paths.get(targetNode);
    if (!path) {
      path = new NodePath(hub, parent);
      if (targetNode) paths.set(targetNode, path);
    }
    setup.call(path, parentPath, container, listKey, key);
    return path;
  }
  getScope(scope) {
    return this.isScope() ? new Scope(this) : scope;
  }
  setData(key, val) {
    if (this.data == null) {
      this.data = Object.create(null);
    }
    return this.data[key] = val;
  }
  getData(key, def) {
    if (this.data == null) {
      this.data = Object.create(null);
    }
    let val = this.data[key];
    if (val === undefined && def !== undefined) val = this.data[key] = def;
    return val;
  }
  hasNode() {
    return this.node != null;
  }
  buildCodeFrameError(msg, Error = SyntaxError) {
    return this.hub.buildError(this.node, msg, Error);
  }
  traverse(visitor, state) {
    traverse(this.node, visitor, this.scope, state, this);
  }
  set(key, node) {
    validate(this.node, key, node);
    this.node[key] = node;
  }
  getPathLocation() {
    const parts = [];
    let path = this;
    do {
      let key = path.key;
      if (path.inList) key = `${path.listKey}[${key}]`;
      parts.unshift(key);
    } while (path = path.parentPath);
    return parts.join(".");
  }
  debug(message) {
    if (!debug.enabled) return;
    debug(`${this.getPathLocation()} ${this.type}: ${message}`);
  }
  toString() {
    return generator(this.node).code;
  }
  get inList() {
    return !!this.listKey;
  }
  set inList(inList) {
    if (!inList) {
      this.listKey = null;
    }
  }
  get parentKey() {
    return this.listKey || this.key;
  }
};
const methods = {
  findParent: NodePath_ancestry.findParent,
  find: NodePath_ancestry.find,
  getFunctionParent: NodePath_ancestry.getFunctionParent,
  getStatementParent: NodePath_ancestry.getStatementParent,
  getEarliestCommonAncestorFrom: NodePath_ancestry.getEarliestCommonAncestorFrom,
  getDeepestCommonAncestorFrom: NodePath_ancestry.getDeepestCommonAncestorFrom,
  getAncestry: NodePath_ancestry.getAncestry,
  isAncestor: NodePath_ancestry.isAncestor,
  isDescendant: NodePath_ancestry.isDescendant,
  inType: NodePath_ancestry.inType,
  getTypeAnnotation: NodePath_inference.getTypeAnnotation,
  isBaseType: NodePath_inference.isBaseType,
  couldBeBaseType: NodePath_inference.couldBeBaseType,
  baseTypeStrictlyMatches: NodePath_inference.baseTypeStrictlyMatches,
  isGenericType: NodePath_inference.isGenericType,
  replaceWithMultiple: NodePath_replacement.replaceWithMultiple,
  replaceWithSourceString: NodePath_replacement.replaceWithSourceString,
  replaceWith: NodePath_replacement.replaceWith,
  replaceExpressionWithStatements: NodePath_replacement.replaceExpressionWithStatements,
  replaceInline: NodePath_replacement.replaceInline,
  evaluateTruthy: NodePath_evaluation.evaluateTruthy,
  evaluate: NodePath_evaluation.evaluate,
  ensureBlock: NodePath_conversion.ensureBlock,
  unwrapFunctionEnvironment: NodePath_conversion.unwrapFunctionEnvironment,
  arrowFunctionToExpression: NodePath_conversion.arrowFunctionToExpression,
  splitExportDeclaration: NodePath_conversion.splitExportDeclaration,
  ensureFunctionName: NodePath_conversion.ensureFunctionName,
  matchesPattern: NodePath_introspection.matchesPattern,
  isStatic: NodePath_introspection.isStatic,
  isNodeType: NodePath_introspection.isNodeType,
  canHaveVariableDeclarationOrExpression: NodePath_introspection.canHaveVariableDeclarationOrExpression,
  canSwapBetweenExpressionAndStatement: NodePath_introspection.canSwapBetweenExpressionAndStatement,
  isCompletionRecord: NodePath_introspection.isCompletionRecord,
  isStatementOrBlock: NodePath_introspection.isStatementOrBlock,
  referencesImport: NodePath_introspection.referencesImport,
  getSource: NodePath_introspection.getSource,
  willIMaybeExecuteBefore: NodePath_introspection.willIMaybeExecuteBefore,
  _guessExecutionStatusRelativeTo: NodePath_introspection._guessExecutionStatusRelativeTo,
  resolve: NodePath_introspection.resolve,
  isConstantExpression: NodePath_introspection.isConstantExpression,
  isInStrictMode: NodePath_introspection.isInStrictMode,
  isDenylisted: NodePath_context.isDenylisted,
  skip: NodePath_context.skip,
  skipKey: NodePath_context.skipKey,
  stop: NodePath_context.stop,
  setContext: NodePath_context.setContext,
  requeue: NodePath_context.requeue,
  requeueComputedKeyAndDecorators: NodePath_context.requeueComputedKeyAndDecorators,
  remove: NodePath_removal.remove,
  insertBefore: NodePath_modification.insertBefore,
  insertAfter: NodePath_modification.insertAfter,
  unshiftContainer: NodePath_modification.unshiftContainer,
  pushContainer: NodePath_modification.pushContainer,
  getOpposite: NodePath_family.getOpposite,
  getCompletionRecords: NodePath_family.getCompletionRecords,
  getSibling: NodePath_family.getSibling,
  getPrevSibling: NodePath_family.getPrevSibling,
  getNextSibling: NodePath_family.getNextSibling,
  getAllNextSiblings: NodePath_family.getAllNextSiblings,
  getAllPrevSiblings: NodePath_family.getAllPrevSiblings,
  get: NodePath_family.get,
  getAssignmentIdentifiers: NodePath_family.getAssignmentIdentifiers,
  getBindingIdentifiers: NodePath_family.getBindingIdentifiers,
  getOuterBindingIdentifiers: NodePath_family.getOuterBindingIdentifiers,
  getBindingIdentifierPaths: NodePath_family.getBindingIdentifierPaths,
  getOuterBindingIdentifierPaths: NodePath_family.getOuterBindingIdentifierPaths,
  shareCommentsWithSiblings: NodePath_comments.shareCommentsWithSiblings,
  addComment: NodePath_comments.addComment,
  addComments: NodePath_comments.addComments
};
Object.assign(NodePath_Final.prototype, methods);
for (const type of t.TYPES) {
  const typeKey = `is${type}`;
  const fn = t[typeKey];
  NodePath_Final.prototype[typeKey] = function (opts) {
    return fn(this.node, opts);
  };
  NodePath_Final.prototype[`assert${type}`] = function (opts) {
    if (!fn(this.node, opts)) {
      throw new TypeError(`Expected node path of type ${type}`);
    }
  };
}
Object.assign(NodePath_Final.prototype, NodePath_virtual_types_validator);
for (const type of Object.keys(virtualTypes)) {
  if (type.startsWith("_")) continue;
  if (!t.TYPES.includes(type)) t.TYPES.push(type);
}
export { NodePath_Final as default };