import { types as t, template } from "@babel/core";
function isPureVoid(node) {
  return t.isUnaryExpression(node) && node.operator === "void" && t.isPureish(node.argument);
}
export function unshiftForXStatementBody(statementPath, newStatements) {
  statementPath.ensureBlock();
  const {
    scope,
    node
  } = statementPath;
  const bodyScopeBindings = statementPath.get("body").scope.bindings;
  const hasShadowedBlockScopedBindings = Object.keys(bodyScopeBindings).some(name => scope.hasBinding(name));
  if (hasShadowedBlockScopedBindings) {
    node.body = t.blockStatement([...newStatements, node.body]);
  } else {
    node.body.body.unshift(...newStatements);
  }
}
function hasArrayRest(pattern) {
  return pattern.elements.some(elem => t.isRestElement(elem));
}
function hasObjectRest(pattern) {
  return pattern.properties.some(prop => t.isRestElement(prop));
}
const STOP_TRAVERSAL = {};
const arrayUnpackVisitor = (node, ancestors, state) => {
  if (!ancestors.length) {
    return;
  }
  if (t.isIdentifier(node) && t.isReferenced(node, ancestors[ancestors.length - 1].node) && state.bindings[node.name]) {
    state.deopt = true;
    throw STOP_TRAVERSAL;
  }
};
export class DestructuringTransformer {
  blockHoist;
  operator;
  arrayRefSet;
  nodes;
  scope;
  kind;
  iterableIsArray;
  arrayLikeIsIterable;
  objectRestNoSymbols;
  useBuiltIns;
  addHelper;
  constructor(opts) {
    this.blockHoist = opts.blockHoist;
    this.operator = opts.operator;
    this.arrayRefSet = new Set();
    this.nodes = opts.nodes || [];
    this.scope = opts.scope;
    this.kind = opts.kind;
    this.iterableIsArray = opts.iterableIsArray;
    this.arrayLikeIsIterable = opts.arrayLikeIsIterable;
    this.objectRestNoSymbols = opts.objectRestNoSymbols;
    this.useBuiltIns = opts.useBuiltIns;
    this.addHelper = opts.addHelper;
  }
  getExtendsHelper() {
    return this.useBuiltIns ? t.memberExpression(t.identifier("Object"), t.identifier("assign")) : this.addHelper("extends");
  }
  buildVariableAssignment(id, init) {
    let op = this.operator;
    if (t.isMemberExpression(id) || t.isOptionalMemberExpression(id)) op = "=";
    let node;
    if (op) {
      node = t.expressionStatement(t.assignmentExpression(op, id, t.cloneNode(init) || t.buildUndefinedNode()));
    } else {
      let nodeInit;
      if (this.kind === "const" && init === null) {
        nodeInit = t.buildUndefinedNode();
      } else {
        nodeInit = t.cloneNode(init);
      }
      node = t.variableDeclaration(this.kind, [t.variableDeclarator(id, nodeInit)]);
    }
    node._blockHoist = this.blockHoist;
    return node;
  }
  buildVariableDeclaration(id, init) {
    const declar = t.variableDeclaration("var", [t.variableDeclarator(t.cloneNode(id), t.cloneNode(init))]);
    declar._blockHoist = this.blockHoist;
    return declar;
  }
  push(id, _init) {
    const init = t.cloneNode(_init);
    if (t.isObjectPattern(id)) {
      this.pushObjectPattern(id, init);
    } else if (t.isArrayPattern(id)) {
      this.pushArrayPattern(id, init);
    } else if (t.isAssignmentPattern(id)) {
      this.pushAssignmentPattern(id, init);
    } else {
      this.nodes.push(this.buildVariableAssignment(id, init));
    }
  }
  toArray(node, count) {
    if (this.iterableIsArray || t.isIdentifier(node) && this.arrayRefSet.has(node.name)) {
      return node;
    } else {
      const {
        scope,
        arrayLikeIsIterable
      } = this;
      if (t.isIdentifier(node)) {
        const binding = scope.getBinding(node.name);
        if (binding?.constant && binding.path.isGenericType("Array")) {
          return node;
        }
      }
      if (t.isArrayExpression(node)) {
        return node;
      }
      if (t.isIdentifier(node, {
        name: "arguments"
      })) {
        return template.expression.ast`
          Array.prototype.slice.call(${node})
        `;
      }
      let helperName;
      const args = [node];
      if (typeof count === "number") {
        args.push(t.numericLiteral(count));
        helperName = "slicedToArray";
      } else {
        helperName = "toArray";
      }
      if (arrayLikeIsIterable) {
        args.unshift(scope.path.hub.addHelper(helperName));
        helperName = "maybeArrayLike";
      }
      return t.callExpression(scope.path.hub.addHelper(helperName), args);
    }
  }
  pushAssignmentPattern({
    left,
    right
  }, valueRef) {
    if (isPureVoid(valueRef)) {
      this.push(left, right);
      return;
    }
    const tempId = this.scope.generateUidIdentifierBasedOnNode(valueRef);
    this.nodes.push(this.buildVariableDeclaration(tempId, valueRef));
    const tempConditional = t.conditionalExpression(t.binaryExpression("===", t.cloneNode(tempId), t.buildUndefinedNode()), right, t.cloneNode(tempId));
    if (t.isPattern(left)) {
      let patternId;
      let node;
      if (this.kind === "const" || this.kind === "let") {
        patternId = this.scope.generateUidIdentifier(tempId.name);
        node = this.buildVariableDeclaration(patternId, tempConditional);
      } else {
        patternId = tempId;
        node = t.expressionStatement(t.assignmentExpression("=", t.cloneNode(tempId), tempConditional));
      }
      this.nodes.push(node);
      this.push(left, patternId);
    } else {
      this.nodes.push(this.buildVariableAssignment(left, tempConditional));
    }
  }
  pushObjectRest(pattern, objRef, spreadProp, spreadPropIndex) {
    const value = buildObjectExcludingKeys(pattern.properties.slice(0, spreadPropIndex), objRef, this.scope, name => this.addHelper(name), this.objectRestNoSymbols, this.useBuiltIns);
    this.nodes.push(this.buildVariableAssignment(spreadProp.argument, value));
  }
  pushObjectProperty(prop, propRef) {
    if (t.isLiteral(prop.key)) prop.computed = true;
    const pattern = prop.value;
    const objRef = t.memberExpression(t.cloneNode(propRef), prop.key, prop.computed);
    if (t.isPattern(pattern)) {
      this.push(pattern, objRef);
    } else {
      this.nodes.push(this.buildVariableAssignment(pattern, objRef));
    }
  }
  pushObjectPattern(pattern, objRef) {
    if (!pattern.properties.length) {
      this.nodes.push(t.expressionStatement(t.callExpression(this.addHelper("objectDestructuringEmpty"), isPureVoid(objRef) ? [] : [objRef])));
      return;
    }
    if (pattern.properties.length > 1 && !this.scope.isStatic(objRef)) {
      const temp = this.scope.generateUidIdentifierBasedOnNode(objRef);
      this.nodes.push(this.buildVariableDeclaration(temp, objRef));
      objRef = temp;
    }
    if (hasObjectRest(pattern)) {
      let copiedPattern;
      for (let i = 0; i < pattern.properties.length; i++) {
        const prop = pattern.properties[i];
        if (t.isRestElement(prop)) {
          break;
        }
        const key = prop.key;
        if (prop.computed && !this.scope.isPure(key)) {
          const name = this.scope.generateUidIdentifierBasedOnNode(key);
          this.nodes.push(this.buildVariableDeclaration(name, key));
          if (!copiedPattern) {
            copiedPattern = pattern = {
              ...pattern,
              properties: pattern.properties.slice()
            };
          }
          copiedPattern.properties[i] = {
            ...prop,
            key: name
          };
        }
      }
    }
    for (let i = 0; i < pattern.properties.length; i++) {
      const prop = pattern.properties[i];
      if (t.isRestElement(prop)) {
        this.pushObjectRest(pattern, objRef, prop, i);
      } else {
        this.pushObjectProperty(prop, objRef);
      }
    }
  }
  canUnpackArrayPattern(pattern, arr) {
    if (!t.isArrayExpression(arr)) return false;
    if (pattern.elements.length > arr.elements.length) return false;
    if (pattern.elements.length < arr.elements.length && !hasArrayRest(pattern)) {
      return false;
    }
    for (const elem of pattern.elements) {
      if (!elem) return false;
      if (t.isMemberExpression(elem)) return false;
    }
    for (const elem of arr.elements) {
      if (t.isSpreadElement(elem)) return false;
      if (t.isCallExpression(elem)) return false;
      if (t.isMemberExpression(elem)) return false;
    }
    const bindings = t.getBindingIdentifiers(pattern);
    const state = {
      deopt: false,
      bindings
    };
    try {
      t.traverse(arr, arrayUnpackVisitor, state);
    } catch (e) {
      if (e !== STOP_TRAVERSAL) throw e;
    }
    return !state.deopt;
  }
  pushUnpackedArrayPattern(pattern, arr) {
    const holeToUndefined = el => el ?? t.buildUndefinedNode();
    for (let i = 0; i < pattern.elements.length; i++) {
      const elem = pattern.elements[i];
      if (t.isRestElement(elem)) {
        this.push(elem.argument, t.arrayExpression(arr.elements.slice(i).map(holeToUndefined)));
      } else {
        this.push(elem, holeToUndefined(arr.elements[i]));
      }
    }
  }
  pushArrayPattern(pattern, arrayRef) {
    if (arrayRef === null) {
      this.nodes.push(t.expressionStatement(t.callExpression(this.addHelper("objectDestructuringEmpty"), [])));
      return;
    }
    if (!pattern.elements) return;
    if (this.canUnpackArrayPattern(pattern, arrayRef)) {
      this.pushUnpackedArrayPattern(pattern, arrayRef);
      return;
    }
    const count = !hasArrayRest(pattern) && pattern.elements.length;
    const toArray = this.toArray(arrayRef, count);
    if (t.isIdentifier(toArray)) {
      arrayRef = toArray;
    } else {
      arrayRef = this.scope.generateUidIdentifierBasedOnNode(arrayRef);
      this.arrayRefSet.add(arrayRef.name);
      this.nodes.push(this.buildVariableDeclaration(arrayRef, toArray));
    }
    for (let i = 0; i < pattern.elements.length; i++) {
      const elem = pattern.elements[i];
      if (!elem) continue;
      if (t.isRestElement(elem)) {
        this.push(elem.argument, t.callExpression(t.memberExpression(t.callExpression(this.scope.path.hub.addHelper("arrayLikeToArray"), [arrayRef]), t.identifier("slice")), [t.numericLiteral(i)]));
      } else {
        this.push(elem, t.memberExpression(arrayRef, t.numericLiteral(i), true));
      }
    }
  }
  init(pattern, ref) {
    if (!t.isArrayExpression(ref) && !t.isMemberExpression(ref)) {
      const memo = this.scope.maybeGenerateMemoised(ref, true);
      if (memo) {
        this.nodes.push(this.buildVariableDeclaration(memo, t.cloneNode(ref)));
        ref = memo;
      }
    }
    this.push(pattern, ref);
    return this.nodes;
  }
}
export function buildObjectExcludingKeys(excludedKeys, objRef, scope, addHelper, objectRestNoSymbols, useBuiltIns) {
  const keys = [];
  let allLiteral = true;
  let hasTemplateLiteral = false;
  for (let i = 0; i < excludedKeys.length; i++) {
    const prop = excludedKeys[i];
    const key = prop.key;
    if (t.isIdentifier(key) && !prop.computed) {
      keys.push(t.stringLiteral(key.name));
    } else if (t.isTemplateLiteral(key)) {
      keys.push(t.cloneNode(key));
      hasTemplateLiteral = true;
    } else if (t.isLiteral(key)) {
      keys.push(t.stringLiteral(String(key.value)));
    } else if (t.isPrivateName(key)) {} else {
      keys.push(t.cloneNode(key));
      allLiteral = false;
    }
  }
  let value;
  if (keys.length === 0) {
    const extendsHelper = useBuiltIns ? t.memberExpression(t.identifier("Object"), t.identifier("assign")) : addHelper("extends");
    value = t.callExpression(extendsHelper, [t.objectExpression([]), t.sequenceExpression([t.callExpression(addHelper("objectDestructuringEmpty"), [t.cloneNode(objRef)]), t.cloneNode(objRef)])]);
  } else {
    let keyExpression = t.arrayExpression(keys);
    if (!allLiteral) {
      keyExpression = t.callExpression(t.memberExpression(keyExpression, t.identifier("map")), [addHelper("toPropertyKey")]);
    } else if (!hasTemplateLiteral && !t.isProgram(scope.block)) {
      const programScope = scope.getProgramParent();
      const id = programScope.generateUidIdentifier("excluded");
      programScope.push({
        id,
        init: keyExpression,
        kind: "const"
      });
      keyExpression = t.cloneNode(id);
    }
    value = t.callExpression(addHelper(`objectWithoutProperties${objectRestNoSymbols ? "Loose" : ""}`), [t.cloneNode(objRef), keyExpression]);
  }
  return value;
}
export function convertVariableDeclaration(path, addHelper, arrayLikeIsIterable, iterableIsArray, objectRestNoSymbols, useBuiltIns) {
  const {
    node,
    scope
  } = path;
  const nodeKind = node.kind;
  const nodeLoc = node.loc;
  const nodes = [];
  for (let i = 0; i < node.declarations.length; i++) {
    const declar = node.declarations[i];
    const patternId = declar.init;
    const pattern = declar.id;
    const destructuring = new DestructuringTransformer({
      blockHoist: node._blockHoist,
      nodes: nodes,
      scope: scope,
      kind: node.kind,
      iterableIsArray,
      arrayLikeIsIterable,
      useBuiltIns,
      objectRestNoSymbols,
      addHelper
    });
    if (t.isPattern(pattern)) {
      destructuring.init(pattern, patternId);
      if (+i !== node.declarations.length - 1) {
        t.inherits(nodes[nodes.length - 1], declar);
      }
    } else {
      nodes.push(t.inherits(destructuring.buildVariableAssignment(pattern, patternId), declar));
    }
  }
  let tail = null;
  let nodesOut = [];
  for (const node of nodes) {
    if (t.isVariableDeclaration(node)) {
      if (tail !== null) {
        tail.declarations.push(...node.declarations);
        continue;
      } else {
        node.kind = nodeKind;
        tail = node;
      }
    } else {
      tail = null;
    }
    if (!node.loc) {
      node.loc = nodeLoc;
    }
    nodesOut.push(node);
  }
  if (nodesOut.length === 2 && t.isVariableDeclaration(nodesOut[0]) && t.isExpressionStatement(nodesOut[1]) && t.isCallExpression(nodesOut[1].expression) && nodesOut[0].declarations.length === 1 && t.isIdentifier(nodesOut[1].expression.arguments[0], {
    name: nodesOut[0].declarations[0].id.name
  })) {
    const expr = nodesOut[1].expression;
    expr.arguments = [nodesOut[0].declarations[0].init];
    nodesOut = [expr];
  } else {
    if (t.isForStatement(path.parent, {
      init: node
    }) && !nodesOut.some(v => t.isVariableDeclaration(v))) {
      for (let i = 0; i < nodesOut.length; i++) {
        const node = nodesOut[i];
        if (t.isExpressionStatement(node)) {
          nodesOut[i] = node.expression;
        }
      }
    }
  }
  if (nodesOut.length === 1) {
    path.replaceWith(nodesOut[0]);
  } else {
    path.replaceWithMultiple(nodesOut);
  }
  scope.crawl();
}
export function convertAssignmentExpression(path, addHelper, arrayLikeIsIterable, iterableIsArray, objectRestNoSymbols, useBuiltIns) {
  const {
    node,
    scope,
    parentPath
  } = path;
  const nodes = [];
  const destructuring = new DestructuringTransformer({
    operator: node.operator,
    scope: scope,
    nodes: nodes,
    arrayLikeIsIterable,
    iterableIsArray,
    objectRestNoSymbols,
    useBuiltIns,
    addHelper
  });
  let ref;
  if (!parentPath.isExpressionStatement() && !parentPath.isSequenceExpression() || path.isCompletionRecord()) {
    ref = scope.generateUidIdentifierBasedOnNode(node.right, "ref");
    nodes.push(t.variableDeclaration("var", [t.variableDeclarator(ref, node.right)]));
    if (t.isArrayExpression(node.right)) {
      destructuring.arrayRefSet.add(ref.name);
    }
  }
  destructuring.init(node.left, ref || node.right);
  if (ref) {
    if (parentPath.isArrowFunctionExpression()) {
      path.replaceWith(t.blockStatement([]));
      nodes.push(t.returnStatement(t.cloneNode(ref)));
    } else {
      nodes.push(t.expressionStatement(t.cloneNode(ref)));
    }
  }
  path.replaceWithMultiple(nodes);
  scope.crawl();
}