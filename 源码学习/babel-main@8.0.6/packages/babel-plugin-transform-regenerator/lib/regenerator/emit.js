import assert from "node:assert";
import * as leap from "./leap.js";
import * as meta from "./meta.js";
import * as util from "./util.js";
import { types as t } from "@babel/core";
const PENDING_LOCATION = Number.MAX_VALUE;
function getDeclError(node) {
  return new Error("all declarations should have been transformed into " + "assignments before the Exploder began its work: " + JSON.stringify(node));
}
const catchParamVisitor = {
  Identifier: function (path, state) {
    if (path.node.name === state.catchParamName && util.isReference(path)) {
      path.replaceWith(state.getSafeParam());
    }
  },
  Scope: function (path, state) {
    if (path.scope.hasOwnBinding(state.catchParamName)) {
      path.skip();
    }
  }
};
export class Emitter {
  nextTempId;
  contextId;
  index;
  indexMap;
  listing;
  returns;
  lastReferenceIndex = 0;
  marked;
  insertedLocs;
  finalLoc;
  tryEntries;
  leapManager;
  scope;
  vars;
  pluginPass;
  constructor(contextId, scope, vars, pluginPass) {
    this.pluginPass = pluginPass;
    this.scope = scope;
    this.vars = vars;
    this.nextTempId = 0;
    this.contextId = contextId;
    this.listing = [];
    this.index = 0;
    this.indexMap = new Map([[0, 0]]);
    this.returns = new Set();
    this.lastReferenceIndex = 0;
    this.marked = [true];
    this.insertedLocs = new Set();
    this.finalLoc = this.loc();
    this.tryEntries = [];
    this.leapManager = new leap.LeapManager(this);
  }
  loc() {
    const l = t.numericLiteral(PENDING_LOCATION);
    this.insertedLocs.add(l);
    return l;
  }
  getInsertedLocs() {
    return this.insertedLocs;
  }
  getContextId() {
    return t.cloneNode(this.contextId);
  }
  getIndex() {
    if (!this.indexMap.has(this.listing.length)) {
      this.indexMap.set(this.listing.length, ++this.index);
    }
    return this.index;
  }
  mark(loc) {
    if (loc.value === PENDING_LOCATION) {
      loc.value = this.getIndex();
    } else {
      assert.strictEqual(loc.value, this.index);
    }
    this.marked[this.listing.length] = true;
    if (loc.value > this.lastReferenceIndex) {
      this.lastReferenceIndex = loc.value;
    }
    return loc;
  }
  emit(node) {
    if (t.isExpression(node)) {
      node = t.expressionStatement(node);
    }
    t.assertStatement(node);
    this.listing.push(node);
  }
  emitAssign(lhs, rhs) {
    this.emit(this.assign(lhs, rhs));
    return lhs;
  }
  assign(lhs, rhs) {
    return t.expressionStatement(t.assignmentExpression("=", t.cloneNode(lhs), rhs));
  }
  contextProperty(name) {
    const computed = name === "catch";
    return t.memberExpression(this.getContextId(), computed ? t.stringLiteral(name) : t.identifier(name), !!computed);
  }
  clearPendingException(tryLoc, assignee) {
    const catchCall = t.callExpression(this.contextProperty("catch"), [t.cloneNode(tryLoc)]);
    if (assignee) {
      this.emitAssign(assignee, catchCall);
    } else {
      this.emit(catchCall);
    }
  }
  jump(toLoc) {
    this.emitAssign(this.contextProperty("n"), toLoc);
    this.emit(t.breakStatement());
  }
  jumpIf(test, toLoc) {
    this.emit(t.ifStatement(test, t.blockStatement([this.assign(this.contextProperty("n"), toLoc), t.breakStatement()])));
  }
  jumpIfNot(test, toLoc) {
    let negatedTest;
    if (t.isUnaryExpression(test) && test.operator === "!") {
      negatedTest = test.argument;
    } else {
      negatedTest = t.unaryExpression("!", test);
    }
    this.emit(t.ifStatement(negatedTest, t.blockStatement([this.assign(this.contextProperty("n"), toLoc), t.breakStatement()])));
  }
  makeContextTempVar() {
    return this.contextProperty("t" + this.nextTempId++);
  }
  makeTempVar() {
    const id = this.scope.generateUidIdentifier("t");
    this.vars.push(t.variableDeclarator(id));
    return t.cloneNode(id);
  }
  getContextFunction() {
    return t.functionExpression(null, [this.getContextId()], t.blockStatement([this.getDispatchLoop()]), false, false);
  }
  getDispatchLoop() {
    const self = this;
    const cases = [];
    let current;
    let alreadyEnded = false;
    self.listing.forEach(function (stmt, i) {
      if (self.marked[i]) {
        cases.push(t.switchCase(t.numericLiteral(self.indexMap.get(i)), current = []));
        alreadyEnded = false;
      }
      if (!alreadyEnded) {
        current.push(stmt);
        if (t.isCompletionStatement(stmt)) alreadyEnded = true;
      }
    });
    this.finalLoc.value = this.getIndex();
    if (this.lastReferenceIndex === this.index || !this.returns.has(this.listing.length)) {
      cases.push(t.switchCase(this.finalLoc, [t.returnStatement(t.callExpression(this.contextProperty("a"), [t.numericLiteral(2)]))]));
    }
    return t.whileStatement(t.numericLiteral(1), t.switchStatement(this.tryEntries.length === 0 ? this.contextProperty("n") : t.assignmentExpression("=", this.contextProperty("p"), this.contextProperty("n")), cases));
  }
  getTryLocsList() {
    if (this.tryEntries.length === 0) {
      return null;
    }
    let lastLocValue = 0;
    const arrayExpression = t.arrayExpression(this.tryEntries.map(function (tryEntry) {
      const thisLocValue = tryEntry.firstLoc.value;
      assert.ok(thisLocValue >= lastLocValue, "try entries out of order");
      lastLocValue = thisLocValue;
      const ce = tryEntry.catchEntry;
      const fe = tryEntry.finallyEntry;
      const locs = [tryEntry.firstLoc, ce ? ce.firstLoc : null];
      if (fe) {
        locs[2] = fe.firstLoc;
        locs[3] = fe.afterLoc;
      }
      return t.arrayExpression(locs.map(loc => loc && t.cloneNode(loc)));
    }));
    arrayExpression.elements.reverse();
    return arrayExpression;
  }
  explode(path, ignoreResult) {
    const node = path.node;
    const self = this;
    if (t.isDeclaration(node)) throw getDeclError(node);
    if (path.isStatement()) return self.explodeStatement(path);
    if (path.isExpression()) return self.explodeExpression(path, ignoreResult);
    switch (node.type) {
      case "VariableDeclarator":
        throw getDeclError(node);
      case "ObjectProperty":
      case "SwitchCase":
      case "CatchClause":
        throw new Error(node.type + " nodes should be handled by their parents");
      default:
        throw new Error("unknown Node of type " + JSON.stringify(node.type));
    }
  }
  explodeStatement(path, labelId = null) {
    const stmt = path.node;
    const self = this;
    let before, after, head;
    if (path.isBlockStatement()) {
      path.get("body").forEach(function (path) {
        self.explodeStatement(path);
      });
      return;
    }
    if (!meta.containsLeap(stmt)) {
      self.emit(stmt);
      return;
    }
    switch (path.type) {
      case "ExpressionStatement":
        self.explodeExpression(path.get("expression"), true);
        break;
      case "LabeledStatement":
        after = this.loc();
        self.leapManager.withEntry(new leap.LabeledEntry(after, path.node.label), function () {
          self.explodeStatement(path.get("body"), path.node.label);
        });
        self.mark(after);
        break;
      case "WhileStatement":
        before = this.loc();
        after = this.loc();
        self.mark(before);
        self.jumpIfNot(self.explodeExpression(path.get("test")), after);
        self.leapManager.withEntry(new leap.LoopEntry(after, before, labelId), function () {
          self.explodeStatement(path.get("body"));
        });
        self.jump(before);
        self.mark(after);
        break;
      case "DoWhileStatement":
        const first = this.loc();
        const test = this.loc();
        after = this.loc();
        self.mark(first);
        self.leapManager.withEntry(new leap.LoopEntry(after, test, labelId), function () {
          self.explode(path.get("body"));
        });
        self.mark(test);
        self.jumpIf(self.explodeExpression(path.get("test")), first);
        self.mark(after);
        break;
      case "ForStatement":
        head = this.loc();
        const update = this.loc();
        after = this.loc();
        if (path.node.init) {
          self.explode(path.get("init"), true);
        }
        self.mark(head);
        if (path.node.test) {
          self.jumpIfNot(self.explodeExpression(path.get("test")), after);
        } else {}
        self.leapManager.withEntry(new leap.LoopEntry(after, update, labelId), function () {
          self.explodeStatement(path.get("body"));
        });
        self.mark(update);
        if (path.node.update) {
          self.explode(path.get("update"), true);
        }
        self.jump(head);
        self.mark(after);
        break;
      case "TypeCastExpression":
        return self.explodeExpression(path.get("expression"));
      case "ForInStatement":
        head = this.loc();
        after = this.loc();
        const keyIterNextFn = self.makeTempVar();
        const helper = this.pluginPass.addHelper("regeneratorKeys");
        self.emitAssign(keyIterNextFn, t.callExpression(helper, [self.explodeExpression(path.get("right"))]));
        self.mark(head);
        const keyInfoTmpVar = self.makeTempVar();
        self.jumpIf(t.memberExpression(t.assignmentExpression("=", keyInfoTmpVar, t.callExpression(t.cloneNode(keyIterNextFn), [])), t.identifier("done"), false), after);
        self.emitAssign(path.node.left, t.memberExpression(t.cloneNode(keyInfoTmpVar), t.identifier("value"), false));
        self.leapManager.withEntry(new leap.LoopEntry(after, head, labelId), function () {
          self.explodeStatement(path.get("body"));
        });
        self.jump(head);
        self.mark(after);
        break;
      case "BreakStatement":
        self.emitAbruptCompletion({
          type: 3,
          target: self.leapManager.getBreakLoc(path.node.label)
        });
        break;
      case "ContinueStatement":
        self.emitAbruptCompletion({
          type: 3,
          target: self.leapManager.getContinueLoc(path.node.label)
        });
        break;
      case "SwitchStatement":
        const disc = self.emitAssign(self.makeTempVar(), self.explodeExpression(path.get("discriminant")));
        after = this.loc();
        const defaultLoc = this.loc();
        let condition = defaultLoc;
        const caseLocs = [];
        const cases = path.node.cases || [];
        for (let i = cases.length - 1; i >= 0; --i) {
          const c = cases[i];
          if (c.test) {
            condition = t.conditionalExpression(t.binaryExpression("===", t.cloneNode(disc), c.test), caseLocs[i] = this.loc(), condition);
          } else {
            caseLocs[i] = defaultLoc;
          }
        }
        const discriminant = path.get("discriminant");
        discriminant.replaceWith(condition);
        self.jump(self.explodeExpression(discriminant));
        self.leapManager.withEntry(new leap.SwitchEntry(after), function () {
          path.get("cases").forEach(function (casePath) {
            const i = casePath.key;
            self.mark(caseLocs[i]);
            casePath.get("consequent").forEach(function (path) {
              self.explodeStatement(path);
            });
          });
        });
        self.mark(after);
        if (defaultLoc.value === PENDING_LOCATION) {
          self.mark(defaultLoc);
          assert.strictEqual(after.value, defaultLoc.value);
        }
        break;
      case "IfStatement":
        const elseLoc = path.node.alternate && this.loc();
        after = this.loc();
        self.jumpIfNot(self.explodeExpression(path.get("test")), elseLoc || after);
        self.explodeStatement(path.get("consequent"));
        if (elseLoc) {
          self.jump(after);
          self.mark(elseLoc);
          self.explodeStatement(path.get("alternate"));
        }
        self.mark(after);
        break;
      case "ReturnStatement":
        self.emitAbruptCompletion({
          type: 2,
          value: self.explodeExpression(path.get("argument"))
        });
        break;
      case "WithStatement":
        throw new Error("WithStatement not supported in generator functions.");
      case "TryStatement":
        after = this.loc();
        const handler = path.node.handler;
        const catchLoc = handler && this.loc();
        const catchEntry = catchLoc && new leap.CatchEntry(catchLoc, handler.param);
        const finallyLoc = path.node.finalizer && this.loc();
        const finallyEntry = finallyLoc && new leap.FinallyEntry(finallyLoc, after);
        const tryEntry = new leap.TryEntry(self.getUnmarkedCurrentLoc(), catchEntry, finallyEntry);
        self.tryEntries.push(tryEntry);
        self.updateContextPrevLoc(tryEntry.firstLoc);
        self.leapManager.withEntry(tryEntry, () => {
          self.explodeStatement(path.get("block"));
          if (catchLoc) {
            const body = path.node.block.body;
            if (finallyLoc) {
              self.jump(finallyLoc);
            } else if (body.length && body[body.length - 1].type === "ReturnStatement") {
              after = null;
            } else {
              self.jump(after);
            }
            self.updateContextPrevLoc(self.mark(catchLoc));
            const bodyPath = path.get("handler.body");
            const safeParam = self.makeTempVar();
            this.emitAssign(safeParam, self.contextProperty("v"));
            bodyPath.traverse(catchParamVisitor, {
              getSafeParam: () => t.cloneNode(safeParam),
              catchParamName: handler.param.name
            });
            self.leapManager.withEntry(catchEntry, function () {
              self.explodeStatement(bodyPath);
            });
          }
          if (finallyLoc) {
            self.updateContextPrevLoc(self.mark(finallyLoc));
            self.leapManager.withEntry(finallyEntry, function () {
              self.explodeStatement(path.get("finalizer"));
            });
            self.emit(t.returnStatement(t.callExpression(self.contextProperty("f"), [finallyEntry.firstLoc])));
          }
        });
        if (after) self.mark(after);
        break;
      case "ThrowStatement":
        self.emit(t.throwStatement(self.explodeExpression(path.get("argument"))));
        break;
      case "ClassDeclaration":
        self.emit(self.explodeClass(path));
        break;
      default:
        throw new Error("unknown Statement of type " + JSON.stringify(stmt.type));
    }
  }
  emitAbruptCompletion(record) {
    const abruptArgs = [t.numericLiteral(record.type)];
    if (record.type === 3) {
      abruptArgs[1] = this.insertedLocs.has(record.target) ? record.target : t.cloneNode(record.target);
    } else if (record.type === 2) {
      if (record.value) {
        abruptArgs[1] = t.cloneNode(record.value);
      }
    }
    this.emit(t.returnStatement(t.callExpression(this.contextProperty("a"), abruptArgs)));
    if (record.type === 2) {
      this.returns.add(this.listing.length);
    }
  }
  getUnmarkedCurrentLoc() {
    return t.numericLiteral(this.getIndex());
  }
  updateContextPrevLoc(loc) {
    if (loc) {
      if (loc.value === PENDING_LOCATION) {
        loc.value = this.getIndex();
      } else {
        assert.strictEqual(loc.value, this.index);
      }
    } else {
      loc = this.getUnmarkedCurrentLoc();
    }
    this.emitAssign(this.contextProperty("p"), loc);
  }
  explodeViaTempVar(tempVar, childPath, hasLeapingChildren, ignoreChildResult) {
    assert.ok(!ignoreChildResult || !tempVar, "Ignoring the result of a child expression but forcing it to " + "be assigned to a temporary variable?");
    let result = this.explodeExpression(childPath, ignoreChildResult);
    if (ignoreChildResult) {} else if (tempVar || hasLeapingChildren && !t.isLiteral(result)) {
      result = this.emitAssign(tempVar || this.makeTempVar(), result);
    }
    return result;
  }
  explodeExpression(path, ignoreResult) {
    const expr = path.node;
    if (!expr) {
      return expr;
    }
    const self = this;
    let result;
    let after;
    function finish(expr) {
      if (ignoreResult) {
        self.emit(expr);
      }
      return expr;
    }
    if (!meta.containsLeap(expr)) {
      return finish(expr);
    }
    const hasLeapingChildren = meta.containsLeapInChildren(expr);
    switch (path.type) {
      case "MemberExpression":
        return finish(t.memberExpression(self.explodeExpression(path.get("object")), path.node.computed ? self.explodeViaTempVar(null, path.get("property"), hasLeapingChildren) : path.node.property, path.node.computed));
      case "CallExpression":
        const calleePath = path.get("callee");
        const argsPath = path.get("arguments");
        let newCallee;
        let newArgs;
        let lastLeapingArgIndex = argsPath.length - 1;
        while (lastLeapingArgIndex >= 0 && !meta.containsLeap(argsPath[lastLeapingArgIndex].node)) {
          lastLeapingArgIndex--;
        }
        let injectFirstArg = null;
        if (t.isMemberExpression(calleePath.node)) {
          if (lastLeapingArgIndex !== -1) {
            const newObject = self.explodeViaTempVar(self.makeTempVar(), calleePath.get("object"), hasLeapingChildren);
            const newProperty = calleePath.node.computed ? self.explodeViaTempVar(null, calleePath.get("property"), hasLeapingChildren) : calleePath.node.property;
            injectFirstArg = newObject;
            newCallee = t.memberExpression(t.memberExpression(t.cloneNode(newObject), newProperty, calleePath.node.computed), t.identifier("call"), false);
          } else {
            newCallee = self.explodeExpression(calleePath);
          }
        } else {
          newCallee = self.explodeViaTempVar(null, calleePath, hasLeapingChildren);
          if (t.isMemberExpression(newCallee)) {
            newCallee = t.sequenceExpression([t.numericLiteral(0), t.cloneNode(newCallee)]);
          }
        }
        if (lastLeapingArgIndex !== -1) {
          newArgs = argsPath.map((argPath, index) => index >= lastLeapingArgIndex ? self.explodeExpression(argPath) : self.explodeViaTempVar(null, argPath, hasLeapingChildren));
          if (injectFirstArg) newArgs.unshift(injectFirstArg);
          newArgs = newArgs.map(arg => t.cloneNode(arg));
        } else {
          newArgs = path.node.arguments;
        }
        return finish(t.callExpression(newCallee, newArgs));
      case "NewExpression":
        return finish(t.newExpression(self.explodeViaTempVar(null, path.get("callee"), hasLeapingChildren), path.get("arguments").map(function (argPath) {
          return self.explodeViaTempVar(null, argPath, hasLeapingChildren);
        })));
      case "ObjectExpression":
        return finish(t.objectExpression(path.get("properties").map(function (propPath) {
          if (propPath.isObjectProperty()) {
            return t.objectProperty(propPath.node.key, self.explodeViaTempVar(null, propPath.get("value"), hasLeapingChildren), propPath.node.computed);
          } else {
            return propPath.node;
          }
        })));
      case "ArrayExpression":
        return finish(t.arrayExpression(path.get("elements").map(function (elemPath) {
          if (!elemPath.node) {
            return null;
          }
          if (elemPath.isSpreadElement()) {
            return t.spreadElement(self.explodeViaTempVar(null, elemPath.get("argument"), hasLeapingChildren));
          } else {
            return self.explodeViaTempVar(null, elemPath, hasLeapingChildren);
          }
        })));
      case "SequenceExpression":
        const lastIndex = path.node.expressions.length - 1;
        path.get("expressions").forEach(function (exprPath) {
          if (exprPath.key === lastIndex) {
            result = self.explodeExpression(exprPath, ignoreResult);
          } else {
            self.explodeExpression(exprPath, true);
          }
        });
        return result;
      case "LogicalExpression":
        after = this.loc();
        if (!ignoreResult) {
          result = self.makeTempVar();
        }
        const left = self.explodeViaTempVar(result, path.get("left"), hasLeapingChildren);
        if (path.node.operator === "&&") {
          self.jumpIfNot(left, after);
        } else {
          assert.strictEqual(path.node.operator, "||");
          self.jumpIf(left, after);
        }
        self.explodeViaTempVar(result, path.get("right"), hasLeapingChildren, ignoreResult);
        self.mark(after);
        return result;
      case "ConditionalExpression":
        const elseLoc = this.loc();
        after = this.loc();
        const test = self.explodeExpression(path.get("test"));
        self.jumpIfNot(test, elseLoc);
        if (!ignoreResult) {
          result = self.makeTempVar();
        }
        self.explodeViaTempVar(result, path.get("consequent"), hasLeapingChildren, ignoreResult);
        self.jump(after);
        self.mark(elseLoc);
        self.explodeViaTempVar(result, path.get("alternate"), hasLeapingChildren, ignoreResult);
        self.mark(after);
        return result;
      case "UnaryExpression":
        return finish(t.unaryExpression(path.node.operator, self.explodeExpression(path.get("argument")), !!path.node.prefix));
      case "BinaryExpression":
        return finish(t.binaryExpression(path.node.operator, self.explodeViaTempVar(null, path.get("left"), hasLeapingChildren), self.explodeViaTempVar(null, path.get("right"), hasLeapingChildren)));
      case "AssignmentExpression":
        if (path.node.operator === "=") {
          return finish(t.assignmentExpression(path.node.operator, self.explodeExpression(path.get("left")), self.explodeExpression(path.get("right"))));
        }
        const lhs = self.explodeExpression(path.get("left"));
        const temp = self.emitAssign(self.makeTempVar(), lhs);
        return finish(t.assignmentExpression("=", t.cloneNode(lhs), t.assignmentExpression(path.node.operator, t.cloneNode(temp), self.explodeExpression(path.get("right")))));
      case "UpdateExpression":
        return finish(t.updateExpression(path.node.operator, self.explodeExpression(path.get("argument")), path.node.prefix));
      case "YieldExpression":
        after = this.loc();
        const arg = path.node.argument && self.explodeExpression(path.get("argument"));
        if (arg && path.node.delegate) {
          const ret = t.returnStatement(t.callExpression(self.contextProperty("d"), [t.callExpression(this.pluginPass.addHelper("regeneratorValues"), [arg]), after]));
          ret.loc = expr.loc;
          self.emit(ret);
          self.mark(after);
          return self.contextProperty("v");
        }
        self.emitAssign(self.contextProperty("n"), after);
        const ret = t.returnStatement(t.cloneNode(arg) || null);
        ret.loc = expr.loc;
        self.emit(ret);
        self.mark(after);
        return self.contextProperty("v");
      case "AwaitExpression":
        {
          after = this.loc();
          const arg = self.explodeExpression(path.get("argument"));
          self.emitAssign(self.contextProperty("n"), after);
          const helper = self.pluginPass.addHelper("awaitAsyncGenerator");
          const ret = t.returnStatement(t.cloneNode(t.callExpression(helper, [arg])) || null);
          ret.loc = expr.loc;
          self.emit(ret);
          self.mark(after);
          return self.contextProperty("v");
        }
      case "ClassExpression":
        return finish(self.explodeClass(path));
      default:
        throw new Error("unknown Expression of type " + JSON.stringify(expr.type));
    }
  }
  explodeClass(path) {
    const explodingChildren = [];
    if (path.node.superClass) {
      explodingChildren.push(path.get("superClass"));
    }
    path.get("body.body").forEach(member => {
      if (member.node.computed) {
        explodingChildren.push(member.get("key"));
      }
    });
    const hasLeapingChildren = explodingChildren.some(child => meta.containsLeap(child.node));
    for (let i = 0; i < explodingChildren.length; i++) {
      const child = explodingChildren[i];
      const isLast = i === explodingChildren.length - 1;
      if (isLast) {
        child.replaceWith(this.explodeExpression(child));
      } else {
        child.replaceWith(this.explodeViaTempVar(null, child, hasLeapingChildren));
      }
    }
    return path.node;
  }
}