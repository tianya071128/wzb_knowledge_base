import * as t from "@babel/types";
import { traverseNode } from "../../traverse-node.js";
import { explode } from "../../visitors.js";
import * as _t from "@babel/types";
const {
  getAssignmentIdentifiers
} = _t;
let renameVisitor;
const getRenameVisitor = () => renameVisitor ??= explode({
  ReferencedIdentifier({
    node
  }, state) {
    if (node.name === state.oldName) {
      node.name = state.newName;
    }
  },
  Scope(path, state) {
    if (!path.scope.bindingIdentifierEquals(state.oldName, state.binding.identifier)) {
      path.skip();
      if (path.isMethod()) {
        path.requeueComputedKeyAndDecorators();
      }
      if (path.isSwitchStatement()) {
        path.context.maybeQueue(path.get("discriminant"));
      }
    }
  },
  ObjectProperty({
    node,
    scope
  }, state) {
    const {
      name
    } = node.key;
    if (node.shorthand && (name === state.oldName || name === state.newName) && scope.getBindingIdentifier(name) === state.binding.identifier) {
      node.shorthand = false;
    }
  },
  "AssignmentExpression|Declaration|VariableDeclarator"(path, state) {
    if (path.isVariableDeclaration()) return;
    const ids = path.isAssignmentExpression() ? getAssignmentIdentifiers(path.node) : path.getOuterBindingIdentifiers();
    for (const name in ids) {
      if (name === state.oldName) ids[name].name = state.newName;
    }
  }
});
export default class Renamer {
  constructor(binding, oldName, newName) {
    this.newName = newName;
    this.oldName = oldName;
    this.binding = binding;
  }
  maybeConvertFromExportDeclaration(parentDeclar) {
    const maybeExportDeclar = parentDeclar.parentPath;
    if (!maybeExportDeclar.isExportDeclaration()) {
      return;
    }
    if (maybeExportDeclar.isExportDefaultDeclaration()) {
      const {
        declaration
      } = maybeExportDeclar.node;
      if (t.isDeclaration(declaration) && !declaration.id) {
        return;
      }
    }
    if (maybeExportDeclar.isExportAllDeclaration()) {
      return;
    }
    maybeExportDeclar.splitExportDeclaration();
  }
  maybeConvertFromClassFunctionDeclaration(path) {
    return path;
  }
  maybeConvertFromClassFunctionExpression(path) {
    return path;
  }
  rename() {
    const {
      binding,
      oldName,
      newName
    } = this;
    const {
      scope,
      path
    } = binding;
    const parentDeclar = path.find(path => path.isDeclaration() || path.isFunctionExpression() || path.isClassExpression());
    if (parentDeclar) {
      const bindingIds = parentDeclar.getOuterBindingIdentifiers();
      if (bindingIds[oldName] === binding.identifier) {
        this.maybeConvertFromExportDeclaration(parentDeclar);
      }
    }
    const blockToTraverse = scope.block;
    const skipKeys = {
      discriminant: true
    };
    if (t.isMethod(blockToTraverse)) {
      if (blockToTraverse.computed) {
        skipKeys.key = true;
      }
      if (!t.isObjectMethod(blockToTraverse)) {
        skipKeys.decorators = true;
      }
    }
    traverseNode(blockToTraverse, getRenameVisitor(), scope, this, scope.path, skipKeys);
    scope.removeOwnBinding(oldName);
    scope.bindings[newName] = binding;
    this.binding.identifier.name = newName;
    if (parentDeclar) {
      this.maybeConvertFromClassFunctionDeclaration(path);
      this.maybeConvertFromClassFunctionExpression(path);
    }
  }
}