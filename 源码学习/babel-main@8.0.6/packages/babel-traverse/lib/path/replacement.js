import { codeFrameColumns } from "@babel/code-frame";
import traverse from "../index.js";
import NodePath from "./index.js";
import { getCachedPaths } from "../cache.js";
import { _verifyNodeList, _containerInsertAfter } from "./modification.js";
import { parse } from "@babel/parser";
import * as _t from "@babel/types";
const {
  FUNCTION_TYPES,
  arrowFunctionExpression,
  assignmentExpression,
  awaitExpression,
  blockStatement,
  buildUndefinedNode,
  callExpression,
  cloneNode,
  conditionalExpression,
  expressionStatement,
  getBindingIdentifiers,
  identifier,
  inheritLeadingComments,
  inheritTrailingComments,
  inheritsComments,
  isBlockStatement,
  isEmptyStatement,
  isExpression,
  isExpressionStatement,
  isIfStatement,
  isProgram,
  isStatement,
  isVariableDeclaration,
  removeComments,
  returnStatement,
  sequenceExpression,
  validate,
  yieldExpression
} = _t;
import { resync, setScope } from "./context.js";
export function replaceWithMultiple(nodes) {
  resync.call(this);
  const verifiedNodes = _verifyNodeList.call(this, nodes);
  inheritLeadingComments(verifiedNodes[0], this.node);
  inheritTrailingComments(verifiedNodes[verifiedNodes.length - 1], this.node);
  getCachedPaths(this)?.delete(this.node);
  this.node = this.container[this.key] = null;
  const paths = this.insertAfter(nodes);
  if (this.node) {
    this.requeue();
  } else {
    this.remove();
  }
  return paths;
}
export function replaceWithSourceString(replacement) {
  resync.call(this);
  let ast;
  try {
    replacement = `(${replacement})`;
    ast = parse(replacement);
  } catch (err) {
    const loc = err.loc;
    if (loc) {
      err.message += " - make sure this is an expression.\n" + codeFrameColumns(replacement, {
        start: {
          line: loc.line,
          column: loc.column
        }
      });
      err.code = "BABEL_REPLACE_SOURCE_ERROR";
    }
    throw err;
  }
  const expressionAST = ast.program.body[0].expression;
  traverse.removeProperties(expressionAST);
  return this.replaceWith(expressionAST);
}
export function replaceWith(replacementPath) {
  resync.call(this);
  if (this.removed) {
    throw new Error("You can't replace this node, we've already removed it");
  }
  let replacement = replacementPath instanceof NodePath ? replacementPath.node : replacementPath;
  if (!replacement) {
    throw new Error("You passed `path.replaceWith()` a falsy node, use `path.remove()` instead");
  }
  if (this.node === replacement) {
    return [this];
  }
  if (this.isProgram() && !isProgram(replacement)) {
    throw new Error("You can only replace a Program root node with another Program node");
  }
  if (Array.isArray(replacement)) {
    throw new Error("Don't use `path.replaceWith()` with an array of nodes, use `path.replaceWithMultiple()`");
  }
  if (typeof replacement === "string") {
    throw new Error("Don't use `path.replaceWith()` with a source string, use `path.replaceWithSourceString()`");
  }
  let nodePath = "";
  if (this.isNodeType("Statement") && isExpression(replacement)) {
    if (!this.canHaveVariableDeclarationOrExpression() && !this.canSwapBetweenExpressionAndStatement(replacement) && !this.parentPath.isExportDefaultDeclaration()) {
      replacement = expressionStatement(replacement);
      nodePath = "expression";
    }
  }
  if (this.isNodeType("Expression") && isStatement(replacement)) {
    if (!this.canHaveVariableDeclarationOrExpression() && !this.canSwapBetweenExpressionAndStatement(replacement)) {
      return this.replaceExpressionWithStatements([replacement]);
    }
  }
  const oldNode = this.node;
  if (oldNode) {
    inheritsComments(replacement, oldNode);
    removeComments(oldNode);
  }
  _replaceWith.call(this, replacement);
  this.type = replacement.type;
  setScope.call(this);
  this.requeue();
  return [nodePath ? this.get(nodePath) : this];
}
export function _replaceWith(node) {
  if (!this.container) {
    throw new ReferenceError("Container is falsy");
  }
  if (this.inList) {
    validate(this.parent, this.key, [node]);
  } else {
    validate(this.parent, this.key, node);
  }
  this.debug(`Replace with ${node?.type}`);
  getCachedPaths(this)?.set(node, this).delete(this.node);
  this.node = node;
  this.container[this.key] = node;
}
export function replaceExpressionWithStatements(nodes) {
  resync.call(this);
  const declars = [];
  const nodesAsSingleExpression = gatherSequenceExpressions(nodes, declars);
  if (nodesAsSingleExpression) {
    for (const id of declars) this.scope.push({
      id
    });
    return this.replaceWith(nodesAsSingleExpression)[0].get("expressions");
  }
  const functionParent = this.getFunctionParent();
  const isParentAsync = functionParent?.node.async;
  const isParentGenerator = functionParent?.node.generator;
  const container = arrowFunctionExpression([], blockStatement(nodes));
  this.replaceWith(callExpression(container, []));
  const callee = this.get("callee");
  callee.get("body").scope.hoistVariables(id => this.scope.push({
    id
  }));
  const completionRecords = callee.getCompletionRecords();
  for (const path of completionRecords) {
    if (!path.isExpressionStatement()) continue;
    const loop = path.findParent(path => path.isLoop());
    if (loop) {
      let uid = loop.getData("expressionReplacementReturnUid");
      if (!uid) {
        uid = callee.scope.generateDeclaredUidIdentifier("ret");
        callee.get("body").pushContainer("body", returnStatement(cloneNode(uid)));
        loop.setData("expressionReplacementReturnUid", uid);
      } else {
        uid = identifier(uid.name);
      }
      path.get("expression").replaceWith(assignmentExpression("=", cloneNode(uid), path.node.expression));
    } else {
      path.replaceWith(returnStatement(path.node.expression));
    }
  }
  callee.arrowFunctionToExpression();
  const newCallee = callee;
  const needToAwaitFunction = isParentAsync && traverse.hasType(newCallee.node.body, "AwaitExpression", FUNCTION_TYPES);
  const needToYieldFunction = isParentGenerator && traverse.hasType(newCallee.node.body, "YieldExpression", FUNCTION_TYPES);
  if (needToAwaitFunction) {
    newCallee.set("async", true);
    if (!needToYieldFunction) {
      this.replaceWith(awaitExpression(this.node));
    }
  }
  if (needToYieldFunction) {
    newCallee.set("generator", true);
    this.replaceWith(yieldExpression(this.node, true));
  }
  return newCallee.get("body.body");
}
function gatherSequenceExpressions(nodes, declars) {
  const exprs = [];
  let ensureLastUndefined = true;
  for (const node of nodes) {
    if (!isEmptyStatement(node)) {
      ensureLastUndefined = false;
    }
    if (isExpression(node)) {
      exprs.push(node);
    } else if (isExpressionStatement(node)) {
      exprs.push(node.expression);
    } else if (isVariableDeclaration(node)) {
      if (node.kind !== "var") return;
      for (const declar of node.declarations) {
        const bindings = getBindingIdentifiers(declar);
        for (const key of Object.keys(bindings)) {
          declars.push(cloneNode(bindings[key]));
        }
        if (declar.init) {
          exprs.push(assignmentExpression("=", declar.id, declar.init));
        }
      }
      ensureLastUndefined = true;
    } else if (isIfStatement(node)) {
      const consequent = node.consequent ? gatherSequenceExpressions([node.consequent], declars) : buildUndefinedNode();
      const alternate = node.alternate ? gatherSequenceExpressions([node.alternate], declars) : buildUndefinedNode();
      if (!consequent || !alternate) return;
      exprs.push(conditionalExpression(node.test, consequent, alternate));
    } else if (isBlockStatement(node)) {
      const body = gatherSequenceExpressions(node.body, declars);
      if (!body) return;
      exprs.push(body);
    } else if (isEmptyStatement(node)) {
      if (nodes.indexOf(node) === 0) {
        ensureLastUndefined = true;
      }
    } else {
      return;
    }
  }
  if (ensureLastUndefined) exprs.push(buildUndefinedNode());
  if (exprs.length === 1) {
    return exprs[0];
  } else {
    return sequenceExpression(exprs);
  }
}
export function replaceInline(nodes) {
  resync.call(this);
  if (Array.isArray(nodes)) {
    if (Array.isArray(this.container)) {
      nodes = _verifyNodeList.call(this, nodes);
      const paths = _containerInsertAfter.call(this, nodes);
      this.remove();
      return paths;
    } else {
      return this.replaceWithMultiple(nodes);
    }
  } else {
    return this.replaceWith(nodes);
  }
}