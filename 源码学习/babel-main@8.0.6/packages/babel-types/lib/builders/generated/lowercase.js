import * as _validate from "../../validators/validate.js";
import deprecationWarning from "../../utils/deprecationWarning.js";
import * as utils from "../../definitions/utils.js";
const {
  validateInternal: validate
} = _validate;
const {
  NODE_FIELDS
} = utils;
export function arrayExpression(elements) {
  const node = {
    type: "ArrayExpression",
    elements
  };
  const defs = NODE_FIELDS.ArrayExpression;
  validate(defs.elements, node, "elements", elements, 1);
  return node;
}
export function assignmentExpression(operator, left, right) {
  const node = {
    type: "AssignmentExpression",
    operator,
    left,
    right
  };
  const defs = NODE_FIELDS.AssignmentExpression;
  validate(defs.operator, node, "operator", operator);
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function binaryExpression(operator, left, right) {
  const node = {
    type: "BinaryExpression",
    operator,
    left,
    right
  };
  const defs = NODE_FIELDS.BinaryExpression;
  validate(defs.operator, node, "operator", operator);
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function interpreterDirective(value) {
  const node = {
    type: "InterpreterDirective",
    value
  };
  const defs = NODE_FIELDS.InterpreterDirective;
  validate(defs.value, node, "value", value);
  return node;
}
export function directive(value) {
  const node = {
    type: "Directive",
    value
  };
  const defs = NODE_FIELDS.Directive;
  validate(defs.value, node, "value", value, 1);
  return node;
}
export function directiveLiteral(value) {
  const node = {
    type: "DirectiveLiteral",
    value
  };
  const defs = NODE_FIELDS.DirectiveLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function blockStatement(body, directives = []) {
  const node = {
    type: "BlockStatement",
    body,
    directives
  };
  const defs = NODE_FIELDS.BlockStatement;
  validate(defs.body, node, "body", body, 1);
  validate(defs.directives, node, "directives", directives, 1);
  return node;
}
export function breakStatement(label = null) {
  const node = {
    type: "BreakStatement",
    label
  };
  const defs = NODE_FIELDS.BreakStatement;
  validate(defs.label, node, "label", label, 1);
  return node;
}
export function callExpression(callee, _arguments) {
  const node = {
    type: "CallExpression",
    callee,
    arguments: _arguments
  };
  const defs = NODE_FIELDS.CallExpression;
  validate(defs.callee, node, "callee", callee, 1);
  validate(defs.arguments, node, "arguments", _arguments, 1);
  return node;
}
export function catchClause(param = null, body) {
  const node = {
    type: "CatchClause",
    param,
    body
  };
  const defs = NODE_FIELDS.CatchClause;
  validate(defs.param, node, "param", param, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function conditionalExpression(test, consequent, alternate) {
  const node = {
    type: "ConditionalExpression",
    test,
    consequent,
    alternate
  };
  const defs = NODE_FIELDS.ConditionalExpression;
  validate(defs.test, node, "test", test, 1);
  validate(defs.consequent, node, "consequent", consequent, 1);
  validate(defs.alternate, node, "alternate", alternate, 1);
  return node;
}
export function continueStatement(label = null) {
  const node = {
    type: "ContinueStatement",
    label
  };
  const defs = NODE_FIELDS.ContinueStatement;
  validate(defs.label, node, "label", label, 1);
  return node;
}
export function debuggerStatement() {
  return {
    type: "DebuggerStatement"
  };
}
export function doWhileStatement(test, body) {
  const node = {
    type: "DoWhileStatement",
    test,
    body
  };
  const defs = NODE_FIELDS.DoWhileStatement;
  validate(defs.test, node, "test", test, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function emptyStatement() {
  return {
    type: "EmptyStatement"
  };
}
export function expressionStatement(expression) {
  const node = {
    type: "ExpressionStatement",
    expression
  };
  const defs = NODE_FIELDS.ExpressionStatement;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function file(program, comments = null, tokens = null) {
  const node = {
    type: "File",
    program,
    comments,
    tokens
  };
  const defs = NODE_FIELDS.File;
  validate(defs.program, node, "program", program, 1);
  validate(defs.comments, node, "comments", comments, 1);
  validate(defs.tokens, node, "tokens", tokens);
  return node;
}
export function forInStatement(left, right, body) {
  const node = {
    type: "ForInStatement",
    left,
    right,
    body
  };
  const defs = NODE_FIELDS.ForInStatement;
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function forStatement(init = null, test = null, update = null, body) {
  const node = {
    type: "ForStatement",
    init,
    test,
    update,
    body
  };
  const defs = NODE_FIELDS.ForStatement;
  validate(defs.init, node, "init", init, 1);
  validate(defs.test, node, "test", test, 1);
  validate(defs.update, node, "update", update, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function functionDeclaration(id = null, params, body, generator = false, async = false) {
  const node = {
    type: "FunctionDeclaration",
    id,
    params,
    body,
    generator,
    async
  };
  const defs = NODE_FIELDS.FunctionDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.generator, node, "generator", generator);
  validate(defs.async, node, "async", async);
  return node;
}
export function functionExpression(id = null, params, body, generator = false, async = false) {
  const node = {
    type: "FunctionExpression",
    id,
    params,
    body,
    generator,
    async
  };
  const defs = NODE_FIELDS.FunctionExpression;
  validate(defs.id, node, "id", id, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.generator, node, "generator", generator);
  validate(defs.async, node, "async", async);
  return node;
}
export function identifier(name) {
  const node = {
    type: "Identifier",
    name
  };
  const defs = NODE_FIELDS.Identifier;
  validate(defs.name, node, "name", name);
  return node;
}
export function ifStatement(test, consequent, alternate = null) {
  const node = {
    type: "IfStatement",
    test,
    consequent,
    alternate
  };
  const defs = NODE_FIELDS.IfStatement;
  validate(defs.test, node, "test", test, 1);
  validate(defs.consequent, node, "consequent", consequent, 1);
  validate(defs.alternate, node, "alternate", alternate, 1);
  return node;
}
export function labeledStatement(label, body) {
  const node = {
    type: "LabeledStatement",
    label,
    body
  };
  const defs = NODE_FIELDS.LabeledStatement;
  validate(defs.label, node, "label", label, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function stringLiteral(value) {
  const node = {
    type: "StringLiteral",
    value
  };
  const defs = NODE_FIELDS.StringLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function numericLiteral(value) {
  const node = {
    type: "NumericLiteral",
    value
  };
  const defs = NODE_FIELDS.NumericLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function nullLiteral() {
  return {
    type: "NullLiteral"
  };
}
export function booleanLiteral(value) {
  const node = {
    type: "BooleanLiteral",
    value
  };
  const defs = NODE_FIELDS.BooleanLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function regExpLiteral(pattern, flags = "") {
  const node = {
    type: "RegExpLiteral",
    pattern,
    flags
  };
  const defs = NODE_FIELDS.RegExpLiteral;
  validate(defs.pattern, node, "pattern", pattern);
  validate(defs.flags, node, "flags", flags);
  return node;
}
export function logicalExpression(operator, left, right) {
  const node = {
    type: "LogicalExpression",
    operator,
    left,
    right
  };
  const defs = NODE_FIELDS.LogicalExpression;
  validate(defs.operator, node, "operator", operator);
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function memberExpression(object, property, computed = false) {
  const node = {
    type: "MemberExpression",
    object,
    property,
    computed
  };
  const defs = NODE_FIELDS.MemberExpression;
  validate(defs.object, node, "object", object, 1);
  validate(defs.property, node, "property", property, 1);
  validate(defs.computed, node, "computed", computed);
  return node;
}
export function newExpression(callee, _arguments) {
  const node = {
    type: "NewExpression",
    callee,
    arguments: _arguments
  };
  const defs = NODE_FIELDS.NewExpression;
  validate(defs.callee, node, "callee", callee, 1);
  validate(defs.arguments, node, "arguments", _arguments, 1);
  return node;
}
export function program(body, directives = [], sourceType = "script", interpreter = null) {
  const node = {
    type: "Program",
    body,
    directives,
    sourceType,
    interpreter
  };
  const defs = NODE_FIELDS.Program;
  validate(defs.body, node, "body", body, 1);
  validate(defs.directives, node, "directives", directives, 1);
  validate(defs.sourceType, node, "sourceType", sourceType);
  validate(defs.interpreter, node, "interpreter", interpreter, 1);
  return node;
}
export function objectExpression(properties) {
  const node = {
    type: "ObjectExpression",
    properties
  };
  const defs = NODE_FIELDS.ObjectExpression;
  validate(defs.properties, node, "properties", properties, 1);
  return node;
}
export function objectMethod(kind, key, params, body, computed = false, generator = false, async = false) {
  const node = {
    type: "ObjectMethod",
    kind,
    key,
    params,
    body,
    computed,
    generator,
    async
  };
  const defs = NODE_FIELDS.ObjectMethod;
  validate(defs.kind, node, "kind", kind);
  validate(defs.key, node, "key", key, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.generator, node, "generator", generator);
  validate(defs.async, node, "async", async);
  return node;
}
export function objectProperty(key, value, computed = false, shorthand = false) {
  const node = {
    type: "ObjectProperty",
    key,
    value,
    computed,
    shorthand
  };
  const defs = NODE_FIELDS.ObjectProperty;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.shorthand, node, "shorthand", shorthand);
  return node;
}
export function restElement(argument) {
  const node = {
    type: "RestElement",
    argument
  };
  const defs = NODE_FIELDS.RestElement;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function returnStatement(argument = null) {
  const node = {
    type: "ReturnStatement",
    argument
  };
  const defs = NODE_FIELDS.ReturnStatement;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function sequenceExpression(expressions) {
  const node = {
    type: "SequenceExpression",
    expressions
  };
  const defs = NODE_FIELDS.SequenceExpression;
  validate(defs.expressions, node, "expressions", expressions, 1);
  return node;
}
export function parenthesizedExpression(expression) {
  const node = {
    type: "ParenthesizedExpression",
    expression
  };
  const defs = NODE_FIELDS.ParenthesizedExpression;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function switchCase(test = null, consequent) {
  const node = {
    type: "SwitchCase",
    test,
    consequent
  };
  const defs = NODE_FIELDS.SwitchCase;
  validate(defs.test, node, "test", test, 1);
  validate(defs.consequent, node, "consequent", consequent, 1);
  return node;
}
export function switchStatement(discriminant, cases) {
  const node = {
    type: "SwitchStatement",
    discriminant,
    cases
  };
  const defs = NODE_FIELDS.SwitchStatement;
  validate(defs.discriminant, node, "discriminant", discriminant, 1);
  validate(defs.cases, node, "cases", cases, 1);
  return node;
}
export function thisExpression() {
  return {
    type: "ThisExpression"
  };
}
export function throwStatement(argument) {
  const node = {
    type: "ThrowStatement",
    argument
  };
  const defs = NODE_FIELDS.ThrowStatement;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function tryStatement(block, handler = null, finalizer = null) {
  const node = {
    type: "TryStatement",
    block,
    handler,
    finalizer
  };
  const defs = NODE_FIELDS.TryStatement;
  validate(defs.block, node, "block", block, 1);
  validate(defs.handler, node, "handler", handler, 1);
  validate(defs.finalizer, node, "finalizer", finalizer, 1);
  return node;
}
export function unaryExpression(operator, argument, prefix = true) {
  const node = {
    type: "UnaryExpression",
    operator,
    argument,
    prefix
  };
  const defs = NODE_FIELDS.UnaryExpression;
  validate(defs.operator, node, "operator", operator);
  validate(defs.argument, node, "argument", argument, 1);
  validate(defs.prefix, node, "prefix", prefix);
  return node;
}
export function updateExpression(operator, argument, prefix = false) {
  const node = {
    type: "UpdateExpression",
    operator,
    argument,
    prefix
  };
  const defs = NODE_FIELDS.UpdateExpression;
  validate(defs.operator, node, "operator", operator);
  validate(defs.argument, node, "argument", argument, 1);
  validate(defs.prefix, node, "prefix", prefix);
  return node;
}
export function variableDeclaration(kind, declarations) {
  const node = {
    type: "VariableDeclaration",
    kind,
    declarations
  };
  const defs = NODE_FIELDS.VariableDeclaration;
  validate(defs.kind, node, "kind", kind);
  validate(defs.declarations, node, "declarations", declarations, 1);
  return node;
}
export function variableDeclarator(id, init = null) {
  const node = {
    type: "VariableDeclarator",
    id,
    init
  };
  const defs = NODE_FIELDS.VariableDeclarator;
  validate(defs.id, node, "id", id, 1);
  validate(defs.init, node, "init", init, 1);
  return node;
}
export function whileStatement(test, body) {
  const node = {
    type: "WhileStatement",
    test,
    body
  };
  const defs = NODE_FIELDS.WhileStatement;
  validate(defs.test, node, "test", test, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function withStatement(object, body) {
  const node = {
    type: "WithStatement",
    object,
    body
  };
  const defs = NODE_FIELDS.WithStatement;
  validate(defs.object, node, "object", object, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function assignmentPattern(left, right) {
  const node = {
    type: "AssignmentPattern",
    left,
    right
  };
  const defs = NODE_FIELDS.AssignmentPattern;
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function arrayPattern(elements) {
  const node = {
    type: "ArrayPattern",
    elements
  };
  const defs = NODE_FIELDS.ArrayPattern;
  validate(defs.elements, node, "elements", elements, 1);
  return node;
}
export function arrowFunctionExpression(params, body, async = false) {
  const node = {
    type: "ArrowFunctionExpression",
    params,
    body,
    async
  };
  const defs = NODE_FIELDS.ArrowFunctionExpression;
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.async, node, "async", async);
  return node;
}
export function classBody(body) {
  const node = {
    type: "ClassBody",
    body
  };
  const defs = NODE_FIELDS.ClassBody;
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function classExpression(id = null, superClass = null, body, decorators = null) {
  const node = {
    type: "ClassExpression",
    id,
    superClass,
    body,
    decorators
  };
  const defs = NODE_FIELDS.ClassExpression;
  validate(defs.id, node, "id", id, 1);
  validate(defs.superClass, node, "superClass", superClass, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.decorators, node, "decorators", decorators, 1);
  return node;
}
export function classDeclaration(id = null, superClass = null, body, decorators = null) {
  const node = {
    type: "ClassDeclaration",
    id,
    superClass,
    body,
    decorators
  };
  const defs = NODE_FIELDS.ClassDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.superClass, node, "superClass", superClass, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.decorators, node, "decorators", decorators, 1);
  return node;
}
export function exportAllDeclaration(source, attributes = null) {
  const node = {
    type: "ExportAllDeclaration",
    source,
    attributes
  };
  const defs = NODE_FIELDS.ExportAllDeclaration;
  validate(defs.source, node, "source", source, 1);
  validate(defs.attributes, node, "attributes", attributes, 1);
  return node;
}
export function exportDefaultDeclaration(declaration) {
  const node = {
    type: "ExportDefaultDeclaration",
    declaration
  };
  const defs = NODE_FIELDS.ExportDefaultDeclaration;
  validate(defs.declaration, node, "declaration", declaration, 1);
  return node;
}
export function exportNamedDeclaration(declaration = null, specifiers = [], source = null, attributes = null) {
  const node = {
    type: "ExportNamedDeclaration",
    declaration,
    specifiers,
    source,
    attributes
  };
  const defs = NODE_FIELDS.ExportNamedDeclaration;
  validate(defs.declaration, node, "declaration", declaration, 1);
  validate(defs.specifiers, node, "specifiers", specifiers, 1);
  validate(defs.source, node, "source", source, 1);
  validate(defs.attributes, node, "attributes", attributes, 1);
  return node;
}
export function exportSpecifier(local, exported) {
  const node = {
    type: "ExportSpecifier",
    local,
    exported
  };
  const defs = NODE_FIELDS.ExportSpecifier;
  validate(defs.local, node, "local", local, 1);
  validate(defs.exported, node, "exported", exported, 1);
  return node;
}
export function forOfStatement(left, right, body, _await = false) {
  const node = {
    type: "ForOfStatement",
    left,
    right,
    body,
    await: _await
  };
  const defs = NODE_FIELDS.ForOfStatement;
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.await, node, "await", _await);
  return node;
}
export function importDeclaration(specifiers, source, attributes = null) {
  const node = {
    type: "ImportDeclaration",
    specifiers,
    source,
    attributes
  };
  const defs = NODE_FIELDS.ImportDeclaration;
  validate(defs.specifiers, node, "specifiers", specifiers, 1);
  validate(defs.source, node, "source", source, 1);
  validate(defs.attributes, node, "attributes", attributes, 1);
  return node;
}
export function importDefaultSpecifier(local) {
  const node = {
    type: "ImportDefaultSpecifier",
    local
  };
  const defs = NODE_FIELDS.ImportDefaultSpecifier;
  validate(defs.local, node, "local", local, 1);
  return node;
}
export function importNamespaceSpecifier(local) {
  const node = {
    type: "ImportNamespaceSpecifier",
    local
  };
  const defs = NODE_FIELDS.ImportNamespaceSpecifier;
  validate(defs.local, node, "local", local, 1);
  return node;
}
export function importSpecifier(local, imported) {
  const node = {
    type: "ImportSpecifier",
    local,
    imported
  };
  const defs = NODE_FIELDS.ImportSpecifier;
  validate(defs.local, node, "local", local, 1);
  validate(defs.imported, node, "imported", imported, 1);
  return node;
}
export function metaProperty(meta, property) {
  const node = {
    type: "MetaProperty",
    meta,
    property
  };
  const defs = NODE_FIELDS.MetaProperty;
  validate(defs.meta, node, "meta", meta, 1);
  validate(defs.property, node, "property", property, 1);
  return node;
}
export function classMethod(kind = "method", key, params, body, computed = false, _static = false, generator = false, async = false) {
  const node = {
    type: "ClassMethod",
    kind,
    key,
    params,
    body,
    computed,
    static: _static,
    generator,
    async
  };
  const defs = NODE_FIELDS.ClassMethod;
  validate(defs.kind, node, "kind", kind);
  validate(defs.key, node, "key", key, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.static, node, "static", _static);
  validate(defs.generator, node, "generator", generator);
  validate(defs.async, node, "async", async);
  return node;
}
export function objectPattern(properties) {
  const node = {
    type: "ObjectPattern",
    properties
  };
  const defs = NODE_FIELDS.ObjectPattern;
  validate(defs.properties, node, "properties", properties, 1);
  return node;
}
export function spreadElement(argument) {
  const node = {
    type: "SpreadElement",
    argument
  };
  const defs = NODE_FIELDS.SpreadElement;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
function _super() {
  return {
    type: "Super"
  };
}
export { _super as super };
export function taggedTemplateExpression(tag, quasi) {
  const node = {
    type: "TaggedTemplateExpression",
    tag,
    quasi
  };
  const defs = NODE_FIELDS.TaggedTemplateExpression;
  validate(defs.tag, node, "tag", tag, 1);
  validate(defs.quasi, node, "quasi", quasi, 1);
  return node;
}
export function templateElement(value, tail = false) {
  const node = {
    type: "TemplateElement",
    value,
    tail
  };
  const defs = NODE_FIELDS.TemplateElement;
  validate(defs.value, node, "value", value);
  validate(defs.tail, node, "tail", tail);
  return node;
}
export function templateLiteral(quasis, expressions) {
  const node = {
    type: "TemplateLiteral",
    quasis,
    expressions
  };
  const defs = NODE_FIELDS.TemplateLiteral;
  validate(defs.quasis, node, "quasis", quasis, 1);
  validate(defs.expressions, node, "expressions", expressions, 1);
  return node;
}
export function yieldExpression(argument = null, delegate = false) {
  const node = {
    type: "YieldExpression",
    argument,
    delegate
  };
  const defs = NODE_FIELDS.YieldExpression;
  validate(defs.argument, node, "argument", argument, 1);
  validate(defs.delegate, node, "delegate", delegate);
  return node;
}
export function awaitExpression(argument) {
  const node = {
    type: "AwaitExpression",
    argument
  };
  const defs = NODE_FIELDS.AwaitExpression;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function importExpression(source, options = null) {
  const node = {
    type: "ImportExpression",
    source,
    options
  };
  const defs = NODE_FIELDS.ImportExpression;
  validate(defs.source, node, "source", source, 1);
  validate(defs.options, node, "options", options, 1);
  return node;
}
function _import() {
  return {
    type: "Import"
  };
}
export { _import as import };
export function bigIntLiteral(value) {
  const node = {
    type: "BigIntLiteral",
    value
  };
  const defs = NODE_FIELDS.BigIntLiteral;
  validate(defs.value, node, "value", value);
  return node;
}
export function exportNamespaceSpecifier(exported) {
  const node = {
    type: "ExportNamespaceSpecifier",
    exported
  };
  const defs = NODE_FIELDS.ExportNamespaceSpecifier;
  validate(defs.exported, node, "exported", exported, 1);
  return node;
}
export function optionalMemberExpression(object, property, computed = false, optional) {
  const node = {
    type: "OptionalMemberExpression",
    object,
    property,
    computed,
    optional
  };
  const defs = NODE_FIELDS.OptionalMemberExpression;
  validate(defs.object, node, "object", object, 1);
  validate(defs.property, node, "property", property, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.optional, node, "optional", optional);
  return node;
}
export function optionalCallExpression(callee, _arguments, optional) {
  const node = {
    type: "OptionalCallExpression",
    callee,
    arguments: _arguments,
    optional
  };
  const defs = NODE_FIELDS.OptionalCallExpression;
  validate(defs.callee, node, "callee", callee, 1);
  validate(defs.arguments, node, "arguments", _arguments, 1);
  validate(defs.optional, node, "optional", optional);
  return node;
}
export function classProperty(key, value = null, typeAnnotation = null, decorators = null, computed = false, _static = false) {
  const node = {
    type: "ClassProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static
  };
  const defs = NODE_FIELDS.ClassProperty;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.decorators, node, "decorators", decorators, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.static, node, "static", _static);
  return node;
}
export function classPrivateProperty(key, value = null, decorators = null, _static = false) {
  const node = {
    type: "ClassPrivateProperty",
    key,
    value,
    decorators,
    static: _static
  };
  const defs = NODE_FIELDS.ClassPrivateProperty;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.decorators, node, "decorators", decorators, 1);
  validate(defs.static, node, "static", _static);
  return node;
}
export function classPrivateMethod(kind = "method", key, params, body, _static = false) {
  const node = {
    type: "ClassPrivateMethod",
    kind,
    key,
    params,
    body,
    static: _static,
    async: false,
    computed: false,
    generator: false
  };
  const defs = NODE_FIELDS.ClassPrivateMethod;
  validate(defs.kind, node, "kind", kind);
  validate(defs.key, node, "key", key, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.static, node, "static", _static);
  return node;
}
export function privateName(id) {
  const node = {
    type: "PrivateName",
    id
  };
  const defs = NODE_FIELDS.PrivateName;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export function staticBlock(body) {
  const node = {
    type: "StaticBlock",
    body
  };
  const defs = NODE_FIELDS.StaticBlock;
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function importAttribute(key, value) {
  const node = {
    type: "ImportAttribute",
    key,
    value
  };
  const defs = NODE_FIELDS.ImportAttribute;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  return node;
}
export function anyTypeAnnotation() {
  return {
    type: "AnyTypeAnnotation"
  };
}
export function arrayTypeAnnotation(elementType) {
  const node = {
    type: "ArrayTypeAnnotation",
    elementType
  };
  const defs = NODE_FIELDS.ArrayTypeAnnotation;
  validate(defs.elementType, node, "elementType", elementType, 1);
  return node;
}
export function booleanTypeAnnotation() {
  return {
    type: "BooleanTypeAnnotation"
  };
}
export function booleanLiteralTypeAnnotation(value) {
  const node = {
    type: "BooleanLiteralTypeAnnotation",
    value
  };
  const defs = NODE_FIELDS.BooleanLiteralTypeAnnotation;
  validate(defs.value, node, "value", value);
  return node;
}
export function nullLiteralTypeAnnotation() {
  return {
    type: "NullLiteralTypeAnnotation"
  };
}
export function classImplements(id, typeParameters = null) {
  const node = {
    type: "ClassImplements",
    id,
    typeParameters
  };
  const defs = NODE_FIELDS.ClassImplements;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
}
export function declareClass(id, typeParameters = null, _extends = null, body) {
  const node = {
    type: "DeclareClass",
    id,
    typeParameters,
    extends: _extends,
    body
  };
  const defs = NODE_FIELDS.DeclareClass;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.extends, node, "extends", _extends, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function declareFunction(id) {
  const node = {
    type: "DeclareFunction",
    id
  };
  const defs = NODE_FIELDS.DeclareFunction;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export function declareInterface(id, typeParameters = null, _extends = null, body) {
  const node = {
    type: "DeclareInterface",
    id,
    typeParameters,
    extends: _extends,
    body
  };
  const defs = NODE_FIELDS.DeclareInterface;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.extends, node, "extends", _extends, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function declareModule(id, body, kind = null) {
  const node = {
    type: "DeclareModule",
    id,
    body,
    kind
  };
  const defs = NODE_FIELDS.DeclareModule;
  validate(defs.id, node, "id", id, 1);
  validate(defs.body, node, "body", body, 1);
  validate(defs.kind, node, "kind", kind);
  return node;
}
export function declareModuleExports(typeAnnotation) {
  const node = {
    type: "DeclareModuleExports",
    typeAnnotation
  };
  const defs = NODE_FIELDS.DeclareModuleExports;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function declareTypeAlias(id, typeParameters = null, right) {
  const node = {
    type: "DeclareTypeAlias",
    id,
    typeParameters,
    right
  };
  const defs = NODE_FIELDS.DeclareTypeAlias;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function declareOpaqueType(id, typeParameters = null, supertype = null) {
  const node = {
    type: "DeclareOpaqueType",
    id,
    typeParameters,
    supertype
  };
  const defs = NODE_FIELDS.DeclareOpaqueType;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.supertype, node, "supertype", supertype, 1);
  return node;
}
export function declareVariable(id) {
  const node = {
    type: "DeclareVariable",
    id
  };
  const defs = NODE_FIELDS.DeclareVariable;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export function declareExportDeclaration(declaration = null, specifiers = null, source = null, attributes = null) {
  const node = {
    type: "DeclareExportDeclaration",
    declaration,
    specifiers,
    source,
    attributes
  };
  const defs = NODE_FIELDS.DeclareExportDeclaration;
  validate(defs.declaration, node, "declaration", declaration, 1);
  validate(defs.specifiers, node, "specifiers", specifiers, 1);
  validate(defs.source, node, "source", source, 1);
  validate(defs.attributes, node, "attributes", attributes, 1);
  return node;
}
export function declareExportAllDeclaration(source, attributes = null) {
  const node = {
    type: "DeclareExportAllDeclaration",
    source,
    attributes
  };
  const defs = NODE_FIELDS.DeclareExportAllDeclaration;
  validate(defs.source, node, "source", source, 1);
  validate(defs.attributes, node, "attributes", attributes, 1);
  return node;
}
export function declaredPredicate(value) {
  const node = {
    type: "DeclaredPredicate",
    value
  };
  const defs = NODE_FIELDS.DeclaredPredicate;
  validate(defs.value, node, "value", value, 1);
  return node;
}
export function existsTypeAnnotation() {
  return {
    type: "ExistsTypeAnnotation"
  };
}
export function functionTypeAnnotation(typeParameters = null, params, rest = null, returnType) {
  const node = {
    type: "FunctionTypeAnnotation",
    typeParameters,
    params,
    rest,
    returnType
  };
  const defs = NODE_FIELDS.FunctionTypeAnnotation;
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.rest, node, "rest", rest, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
}
export function functionTypeParam(name = null, typeAnnotation) {
  const node = {
    type: "FunctionTypeParam",
    name,
    typeAnnotation
  };
  const defs = NODE_FIELDS.FunctionTypeParam;
  validate(defs.name, node, "name", name, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function genericTypeAnnotation(id, typeParameters = null) {
  const node = {
    type: "GenericTypeAnnotation",
    id,
    typeParameters
  };
  const defs = NODE_FIELDS.GenericTypeAnnotation;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
}
export function inferredPredicate() {
  return {
    type: "InferredPredicate"
  };
}
export function interfaceExtends(id, typeParameters = null) {
  const node = {
    type: "InterfaceExtends",
    id,
    typeParameters
  };
  const defs = NODE_FIELDS.InterfaceExtends;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  return node;
}
export function interfaceDeclaration(id, typeParameters = null, _extends = null, body) {
  const node = {
    type: "InterfaceDeclaration",
    id,
    typeParameters,
    extends: _extends,
    body
  };
  const defs = NODE_FIELDS.InterfaceDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.extends, node, "extends", _extends, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function interfaceTypeAnnotation(_extends = null, body) {
  const node = {
    type: "InterfaceTypeAnnotation",
    extends: _extends,
    body
  };
  const defs = NODE_FIELDS.InterfaceTypeAnnotation;
  validate(defs.extends, node, "extends", _extends, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function intersectionTypeAnnotation(types) {
  const node = {
    type: "IntersectionTypeAnnotation",
    types
  };
  const defs = NODE_FIELDS.IntersectionTypeAnnotation;
  validate(defs.types, node, "types", types, 1);
  return node;
}
export function mixedTypeAnnotation() {
  return {
    type: "MixedTypeAnnotation"
  };
}
export function emptyTypeAnnotation() {
  return {
    type: "EmptyTypeAnnotation"
  };
}
export function nullableTypeAnnotation(typeAnnotation) {
  const node = {
    type: "NullableTypeAnnotation",
    typeAnnotation
  };
  const defs = NODE_FIELDS.NullableTypeAnnotation;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function numberLiteralTypeAnnotation(value) {
  const node = {
    type: "NumberLiteralTypeAnnotation",
    value
  };
  const defs = NODE_FIELDS.NumberLiteralTypeAnnotation;
  validate(defs.value, node, "value", value);
  return node;
}
export function bigIntLiteralTypeAnnotation(value) {
  const node = {
    type: "BigIntLiteralTypeAnnotation",
    value
  };
  const defs = NODE_FIELDS.BigIntLiteralTypeAnnotation;
  validate(defs.value, node, "value", value);
  return node;
}
export function numberTypeAnnotation() {
  return {
    type: "NumberTypeAnnotation"
  };
}
export function objectTypeAnnotation(properties, indexers = [], callProperties = [], internalSlots = [], exact = false) {
  const node = {
    type: "ObjectTypeAnnotation",
    properties,
    indexers,
    callProperties,
    internalSlots,
    exact
  };
  const defs = NODE_FIELDS.ObjectTypeAnnotation;
  validate(defs.properties, node, "properties", properties, 1);
  validate(defs.indexers, node, "indexers", indexers, 1);
  validate(defs.callProperties, node, "callProperties", callProperties, 1);
  validate(defs.internalSlots, node, "internalSlots", internalSlots, 1);
  validate(defs.exact, node, "exact", exact);
  return node;
}
export function objectTypeInternalSlot(id, value, optional, _static, method) {
  const node = {
    type: "ObjectTypeInternalSlot",
    id,
    value,
    optional,
    static: _static,
    method
  };
  const defs = NODE_FIELDS.ObjectTypeInternalSlot;
  validate(defs.id, node, "id", id, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.optional, node, "optional", optional);
  validate(defs.static, node, "static", _static);
  validate(defs.method, node, "method", method);
  return node;
}
export function objectTypeCallProperty(value) {
  const node = {
    type: "ObjectTypeCallProperty",
    value,
    static: false
  };
  const defs = NODE_FIELDS.ObjectTypeCallProperty;
  validate(defs.value, node, "value", value, 1);
  return node;
}
export function objectTypeIndexer(id = null, key, value, variance = null) {
  const node = {
    type: "ObjectTypeIndexer",
    id,
    key,
    value,
    variance,
    static: false
  };
  const defs = NODE_FIELDS.ObjectTypeIndexer;
  validate(defs.id, node, "id", id, 1);
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.variance, node, "variance", variance, 1);
  return node;
}
export function objectTypeProperty(key, value, variance = null) {
  const node = {
    type: "ObjectTypeProperty",
    key,
    value,
    variance,
    kind: "init",
    method: false,
    optional: false,
    proto: false,
    static: false
  };
  const defs = NODE_FIELDS.ObjectTypeProperty;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.variance, node, "variance", variance, 1);
  return node;
}
export function objectTypeSpreadProperty(argument) {
  const node = {
    type: "ObjectTypeSpreadProperty",
    argument
  };
  const defs = NODE_FIELDS.ObjectTypeSpreadProperty;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function opaqueType(id, typeParameters = null, supertype = null, impltype) {
  const node = {
    type: "OpaqueType",
    id,
    typeParameters,
    supertype,
    impltype
  };
  const defs = NODE_FIELDS.OpaqueType;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.supertype, node, "supertype", supertype, 1);
  validate(defs.impltype, node, "impltype", impltype, 1);
  return node;
}
export function qualifiedTypeIdentifier(id, qualification) {
  const node = {
    type: "QualifiedTypeIdentifier",
    id,
    qualification
  };
  const defs = NODE_FIELDS.QualifiedTypeIdentifier;
  validate(defs.id, node, "id", id, 1);
  validate(defs.qualification, node, "qualification", qualification, 1);
  return node;
}
export function stringLiteralTypeAnnotation(value) {
  const node = {
    type: "StringLiteralTypeAnnotation",
    value
  };
  const defs = NODE_FIELDS.StringLiteralTypeAnnotation;
  validate(defs.value, node, "value", value);
  return node;
}
export function stringTypeAnnotation() {
  return {
    type: "StringTypeAnnotation"
  };
}
export function symbolTypeAnnotation() {
  return {
    type: "SymbolTypeAnnotation"
  };
}
export function thisTypeAnnotation() {
  return {
    type: "ThisTypeAnnotation"
  };
}
export function tupleTypeAnnotation(types) {
  const node = {
    type: "TupleTypeAnnotation",
    types
  };
  const defs = NODE_FIELDS.TupleTypeAnnotation;
  validate(defs.types, node, "types", types, 1);
  return node;
}
export function typeofTypeAnnotation(argument) {
  const node = {
    type: "TypeofTypeAnnotation",
    argument
  };
  const defs = NODE_FIELDS.TypeofTypeAnnotation;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function typeAlias(id, typeParameters = null, right) {
  const node = {
    type: "TypeAlias",
    id,
    typeParameters,
    right
  };
  const defs = NODE_FIELDS.TypeAlias;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function typeAnnotation(typeAnnotation) {
  const node = {
    type: "TypeAnnotation",
    typeAnnotation
  };
  const defs = NODE_FIELDS.TypeAnnotation;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function typeCastExpression(expression, typeAnnotation) {
  const node = {
    type: "TypeCastExpression",
    expression,
    typeAnnotation
  };
  const defs = NODE_FIELDS.TypeCastExpression;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function typeParameter(name, bound = null, _default = null, variance = null) {
  const node = {
    type: "TypeParameter",
    name,
    bound,
    default: _default,
    variance
  };
  const defs = NODE_FIELDS.TypeParameter;
  validate(defs.name, node, "name", name);
  validate(defs.bound, node, "bound", bound, 1);
  validate(defs.default, node, "default", _default, 1);
  validate(defs.variance, node, "variance", variance, 1);
  return node;
}
export function typeParameterDeclaration(params) {
  const node = {
    type: "TypeParameterDeclaration",
    params
  };
  const defs = NODE_FIELDS.TypeParameterDeclaration;
  validate(defs.params, node, "params", params, 1);
  return node;
}
export function typeParameterInstantiation(params) {
  const node = {
    type: "TypeParameterInstantiation",
    params
  };
  const defs = NODE_FIELDS.TypeParameterInstantiation;
  validate(defs.params, node, "params", params, 1);
  return node;
}
export function unionTypeAnnotation(types) {
  const node = {
    type: "UnionTypeAnnotation",
    types
  };
  const defs = NODE_FIELDS.UnionTypeAnnotation;
  validate(defs.types, node, "types", types, 1);
  return node;
}
export function variance(kind) {
  const node = {
    type: "Variance",
    kind
  };
  const defs = NODE_FIELDS.Variance;
  validate(defs.kind, node, "kind", kind);
  return node;
}
export function voidTypeAnnotation() {
  return {
    type: "VoidTypeAnnotation"
  };
}
export function enumDeclaration(id, body) {
  const node = {
    type: "EnumDeclaration",
    id,
    body
  };
  const defs = NODE_FIELDS.EnumDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function enumBooleanBody(members) {
  const node = {
    type: "EnumBooleanBody",
    members,
    explicitType: false,
    hasUnknownMembers: false
  };
  const defs = NODE_FIELDS.EnumBooleanBody;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export function enumNumberBody(members) {
  const node = {
    type: "EnumNumberBody",
    members,
    explicitType: false,
    hasUnknownMembers: false
  };
  const defs = NODE_FIELDS.EnumNumberBody;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export function enumStringBody(members) {
  const node = {
    type: "EnumStringBody",
    members,
    explicitType: false,
    hasUnknownMembers: false
  };
  const defs = NODE_FIELDS.EnumStringBody;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export function enumSymbolBody(members) {
  const node = {
    type: "EnumSymbolBody",
    members,
    hasUnknownMembers: false
  };
  const defs = NODE_FIELDS.EnumSymbolBody;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export function enumBooleanMember(id, init) {
  const node = {
    type: "EnumBooleanMember",
    id,
    init
  };
  const defs = NODE_FIELDS.EnumBooleanMember;
  validate(defs.id, node, "id", id, 1);
  validate(defs.init, node, "init", init, 1);
  return node;
}
export function enumNumberMember(id, init) {
  const node = {
    type: "EnumNumberMember",
    id,
    init
  };
  const defs = NODE_FIELDS.EnumNumberMember;
  validate(defs.id, node, "id", id, 1);
  validate(defs.init, node, "init", init, 1);
  return node;
}
export function enumStringMember(id, init) {
  const node = {
    type: "EnumStringMember",
    id,
    init
  };
  const defs = NODE_FIELDS.EnumStringMember;
  validate(defs.id, node, "id", id, 1);
  validate(defs.init, node, "init", init, 1);
  return node;
}
export function enumDefaultedMember(id) {
  const node = {
    type: "EnumDefaultedMember",
    id
  };
  const defs = NODE_FIELDS.EnumDefaultedMember;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export function indexedAccessType(objectType, indexType) {
  const node = {
    type: "IndexedAccessType",
    objectType,
    indexType
  };
  const defs = NODE_FIELDS.IndexedAccessType;
  validate(defs.objectType, node, "objectType", objectType, 1);
  validate(defs.indexType, node, "indexType", indexType, 1);
  return node;
}
export function optionalIndexedAccessType(objectType, indexType) {
  const node = {
    type: "OptionalIndexedAccessType",
    objectType,
    indexType,
    optional: false
  };
  const defs = NODE_FIELDS.OptionalIndexedAccessType;
  validate(defs.objectType, node, "objectType", objectType, 1);
  validate(defs.indexType, node, "indexType", indexType, 1);
  return node;
}
export function jsxAttribute(name, value = null) {
  const node = {
    type: "JSXAttribute",
    name,
    value
  };
  const defs = NODE_FIELDS.JSXAttribute;
  validate(defs.name, node, "name", name, 1);
  validate(defs.value, node, "value", value, 1);
  return node;
}
export function jsxClosingElement(name) {
  const node = {
    type: "JSXClosingElement",
    name
  };
  const defs = NODE_FIELDS.JSXClosingElement;
  validate(defs.name, node, "name", name, 1);
  return node;
}
export function jsxElement(openingElement, closingElement = null, children) {
  const node = {
    type: "JSXElement",
    openingElement,
    closingElement,
    children
  };
  const defs = NODE_FIELDS.JSXElement;
  validate(defs.openingElement, node, "openingElement", openingElement, 1);
  validate(defs.closingElement, node, "closingElement", closingElement, 1);
  validate(defs.children, node, "children", children, 1);
  return node;
}
export function jsxEmptyExpression() {
  return {
    type: "JSXEmptyExpression"
  };
}
export function jsxExpressionContainer(expression) {
  const node = {
    type: "JSXExpressionContainer",
    expression
  };
  const defs = NODE_FIELDS.JSXExpressionContainer;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function jsxSpreadChild(expression) {
  const node = {
    type: "JSXSpreadChild",
    expression
  };
  const defs = NODE_FIELDS.JSXSpreadChild;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function jsxIdentifier(name) {
  const node = {
    type: "JSXIdentifier",
    name
  };
  const defs = NODE_FIELDS.JSXIdentifier;
  validate(defs.name, node, "name", name);
  return node;
}
export function jsxMemberExpression(object, property) {
  const node = {
    type: "JSXMemberExpression",
    object,
    property
  };
  const defs = NODE_FIELDS.JSXMemberExpression;
  validate(defs.object, node, "object", object, 1);
  validate(defs.property, node, "property", property, 1);
  return node;
}
export function jsxNamespacedName(namespace, name) {
  const node = {
    type: "JSXNamespacedName",
    namespace,
    name
  };
  const defs = NODE_FIELDS.JSXNamespacedName;
  validate(defs.namespace, node, "namespace", namespace, 1);
  validate(defs.name, node, "name", name, 1);
  return node;
}
export function jsxOpeningElement(name, attributes, selfClosing = false) {
  const node = {
    type: "JSXOpeningElement",
    name,
    attributes,
    selfClosing
  };
  const defs = NODE_FIELDS.JSXOpeningElement;
  validate(defs.name, node, "name", name, 1);
  validate(defs.attributes, node, "attributes", attributes, 1);
  validate(defs.selfClosing, node, "selfClosing", selfClosing);
  return node;
}
export function jsxSpreadAttribute(argument) {
  const node = {
    type: "JSXSpreadAttribute",
    argument
  };
  const defs = NODE_FIELDS.JSXSpreadAttribute;
  validate(defs.argument, node, "argument", argument, 1);
  return node;
}
export function jsxText(value) {
  const node = {
    type: "JSXText",
    value
  };
  const defs = NODE_FIELDS.JSXText;
  validate(defs.value, node, "value", value);
  return node;
}
export function jsxFragment(openingFragment, closingFragment, children) {
  const node = {
    type: "JSXFragment",
    openingFragment,
    closingFragment,
    children
  };
  const defs = NODE_FIELDS.JSXFragment;
  validate(defs.openingFragment, node, "openingFragment", openingFragment, 1);
  validate(defs.closingFragment, node, "closingFragment", closingFragment, 1);
  validate(defs.children, node, "children", children, 1);
  return node;
}
export function jsxOpeningFragment() {
  return {
    type: "JSXOpeningFragment"
  };
}
export function jsxClosingFragment() {
  return {
    type: "JSXClosingFragment"
  };
}
export function placeholder(expectedNode, name) {
  const node = {
    type: "Placeholder",
    expectedNode,
    name
  };
  const defs = NODE_FIELDS.Placeholder;
  validate(defs.expectedNode, node, "expectedNode", expectedNode);
  validate(defs.name, node, "name", name, 1);
  return node;
}
export function v8IntrinsicIdentifier(name) {
  const node = {
    type: "V8IntrinsicIdentifier",
    name
  };
  const defs = NODE_FIELDS.V8IntrinsicIdentifier;
  validate(defs.name, node, "name", name);
  return node;
}
export function argumentPlaceholder() {
  return {
    type: "ArgumentPlaceholder"
  };
}
export function bindExpression(object, callee) {
  const node = {
    type: "BindExpression",
    object,
    callee
  };
  const defs = NODE_FIELDS.BindExpression;
  validate(defs.object, node, "object", object, 1);
  validate(defs.callee, node, "callee", callee, 1);
  return node;
}
export function classAccessorProperty(key, value = null, typeAnnotation = null, decorators = null, computed = false, _static = false) {
  const node = {
    type: "ClassAccessorProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static
  };
  const defs = NODE_FIELDS.ClassAccessorProperty;
  validate(defs.key, node, "key", key, 1);
  validate(defs.value, node, "value", value, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.decorators, node, "decorators", decorators, 1);
  validate(defs.computed, node, "computed", computed);
  validate(defs.static, node, "static", _static);
  return node;
}
export function decorator(expression) {
  const node = {
    type: "Decorator",
    expression
  };
  const defs = NODE_FIELDS.Decorator;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function doExpression(body, async = false) {
  const node = {
    type: "DoExpression",
    body,
    async
  };
  const defs = NODE_FIELDS.DoExpression;
  validate(defs.body, node, "body", body, 1);
  validate(defs.async, node, "async", async);
  return node;
}
export function exportDefaultSpecifier(exported) {
  const node = {
    type: "ExportDefaultSpecifier",
    exported
  };
  const defs = NODE_FIELDS.ExportDefaultSpecifier;
  validate(defs.exported, node, "exported", exported, 1);
  return node;
}
export function moduleExpression(body) {
  const node = {
    type: "ModuleExpression",
    body
  };
  const defs = NODE_FIELDS.ModuleExpression;
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function topicReference() {
  return {
    type: "TopicReference"
  };
}
export function voidPattern() {
  return {
    type: "VoidPattern"
  };
}
export function tsParameterProperty(parameter) {
  const node = {
    type: "TSParameterProperty",
    parameter
  };
  const defs = NODE_FIELDS.TSParameterProperty;
  validate(defs.parameter, node, "parameter", parameter, 1);
  return node;
}
export function tsDeclareFunction(id = null, typeParameters = null, params, returnType = null) {
  const node = {
    type: "TSDeclareFunction",
    id,
    typeParameters,
    params,
    returnType,
    async: false,
    generator: false
  };
  const defs = NODE_FIELDS.TSDeclareFunction;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
}
export function tsDeclareMethod(key, typeParameters = null, params, returnType = null) {
  const node = {
    type: "TSDeclareMethod",
    key,
    typeParameters,
    params,
    returnType,
    async: false,
    computed: false,
    generator: false,
    kind: "method",
    static: false
  };
  const defs = NODE_FIELDS.TSDeclareMethod;
  validate(defs.key, node, "key", key, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
}
export function tsQualifiedName(left, right) {
  const node = {
    type: "TSQualifiedName",
    left,
    right
  };
  const defs = NODE_FIELDS.TSQualifiedName;
  validate(defs.left, node, "left", left, 1);
  validate(defs.right, node, "right", right, 1);
  return node;
}
export function tsCallSignatureDeclaration(typeParameters = null, params, returnType = null) {
  const node = {
    type: "TSCallSignatureDeclaration",
    typeParameters,
    params,
    returnType
  };
  const defs = NODE_FIELDS.TSCallSignatureDeclaration;
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
}
export function tsConstructSignatureDeclaration(typeParameters = null, params, returnType = null) {
  const node = {
    type: "TSConstructSignatureDeclaration",
    typeParameters,
    params,
    returnType
  };
  const defs = NODE_FIELDS.TSConstructSignatureDeclaration;
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
}
export function tsPropertySignature(key, typeAnnotation = null) {
  const node = {
    type: "TSPropertySignature",
    key,
    typeAnnotation,
    computed: false
  };
  const defs = NODE_FIELDS.TSPropertySignature;
  validate(defs.key, node, "key", key, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function tsMethodSignature(key, typeParameters = null, params, returnType = null) {
  const node = {
    type: "TSMethodSignature",
    key,
    typeParameters,
    params,
    returnType,
    computed: false,
    kind: "method"
  };
  const defs = NODE_FIELDS.TSMethodSignature;
  validate(defs.key, node, "key", key, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
}
export function tsIndexSignature(parameters, typeAnnotation = null) {
  const node = {
    type: "TSIndexSignature",
    parameters,
    typeAnnotation
  };
  const defs = NODE_FIELDS.TSIndexSignature;
  validate(defs.parameters, node, "parameters", parameters, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function tsAnyKeyword() {
  return {
    type: "TSAnyKeyword"
  };
}
export function tsBooleanKeyword() {
  return {
    type: "TSBooleanKeyword"
  };
}
export function tsBigIntKeyword() {
  return {
    type: "TSBigIntKeyword"
  };
}
export function tsIntrinsicKeyword() {
  return {
    type: "TSIntrinsicKeyword"
  };
}
export function tsNeverKeyword() {
  return {
    type: "TSNeverKeyword"
  };
}
export function tsNullKeyword() {
  return {
    type: "TSNullKeyword"
  };
}
export function tsNumberKeyword() {
  return {
    type: "TSNumberKeyword"
  };
}
export function tsObjectKeyword() {
  return {
    type: "TSObjectKeyword"
  };
}
export function tsStringKeyword() {
  return {
    type: "TSStringKeyword"
  };
}
export function tsSymbolKeyword() {
  return {
    type: "TSSymbolKeyword"
  };
}
export function tsUndefinedKeyword() {
  return {
    type: "TSUndefinedKeyword"
  };
}
export function tsUnknownKeyword() {
  return {
    type: "TSUnknownKeyword"
  };
}
export function tsVoidKeyword() {
  return {
    type: "TSVoidKeyword"
  };
}
export function tsThisType() {
  return {
    type: "TSThisType"
  };
}
export function tsFunctionType(typeParameters = null, params, returnType = null) {
  const node = {
    type: "TSFunctionType",
    typeParameters,
    params,
    returnType
  };
  const defs = NODE_FIELDS.TSFunctionType;
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
}
export function tsConstructorType(typeParameters = null, params, returnType = null) {
  const node = {
    type: "TSConstructorType",
    typeParameters,
    params,
    returnType
  };
  const defs = NODE_FIELDS.TSConstructorType;
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.params, node, "params", params, 1);
  validate(defs.returnType, node, "returnType", returnType, 1);
  return node;
}
export function tsTypeReference(typeName, typeArguments = null) {
  const node = {
    type: "TSTypeReference",
    typeName,
    typeArguments
  };
  const defs = NODE_FIELDS.TSTypeReference;
  validate(defs.typeName, node, "typeName", typeName, 1);
  validate(defs.typeArguments, node, "typeArguments", typeArguments, 1);
  return node;
}
export function tsTypePredicate(parameterName, typeAnnotation = null, asserts = null) {
  const node = {
    type: "TSTypePredicate",
    parameterName,
    typeAnnotation,
    asserts
  };
  const defs = NODE_FIELDS.TSTypePredicate;
  validate(defs.parameterName, node, "parameterName", parameterName, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.asserts, node, "asserts", asserts);
  return node;
}
export function tsTypeQuery(exprName, typeArguments = null) {
  const node = {
    type: "TSTypeQuery",
    exprName,
    typeArguments
  };
  const defs = NODE_FIELDS.TSTypeQuery;
  validate(defs.exprName, node, "exprName", exprName, 1);
  validate(defs.typeArguments, node, "typeArguments", typeArguments, 1);
  return node;
}
export function tsTypeLiteral(members) {
  const node = {
    type: "TSTypeLiteral",
    members
  };
  const defs = NODE_FIELDS.TSTypeLiteral;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export function tsArrayType(elementType) {
  const node = {
    type: "TSArrayType",
    elementType
  };
  const defs = NODE_FIELDS.TSArrayType;
  validate(defs.elementType, node, "elementType", elementType, 1);
  return node;
}
export function tsTupleType(elementTypes) {
  const node = {
    type: "TSTupleType",
    elementTypes
  };
  const defs = NODE_FIELDS.TSTupleType;
  validate(defs.elementTypes, node, "elementTypes", elementTypes, 1);
  return node;
}
export function tsOptionalType(typeAnnotation) {
  const node = {
    type: "TSOptionalType",
    typeAnnotation
  };
  const defs = NODE_FIELDS.TSOptionalType;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function tsRestType(typeAnnotation) {
  const node = {
    type: "TSRestType",
    typeAnnotation
  };
  const defs = NODE_FIELDS.TSRestType;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function tsNamedTupleMember(label, elementType, optional = false) {
  const node = {
    type: "TSNamedTupleMember",
    label,
    elementType,
    optional
  };
  const defs = NODE_FIELDS.TSNamedTupleMember;
  validate(defs.label, node, "label", label, 1);
  validate(defs.elementType, node, "elementType", elementType, 1);
  validate(defs.optional, node, "optional", optional);
  return node;
}
export function tsUnionType(types) {
  const node = {
    type: "TSUnionType",
    types
  };
  const defs = NODE_FIELDS.TSUnionType;
  validate(defs.types, node, "types", types, 1);
  return node;
}
export function tsIntersectionType(types) {
  const node = {
    type: "TSIntersectionType",
    types
  };
  const defs = NODE_FIELDS.TSIntersectionType;
  validate(defs.types, node, "types", types, 1);
  return node;
}
export function tsConditionalType(checkType, extendsType, trueType, falseType) {
  const node = {
    type: "TSConditionalType",
    checkType,
    extendsType,
    trueType,
    falseType
  };
  const defs = NODE_FIELDS.TSConditionalType;
  validate(defs.checkType, node, "checkType", checkType, 1);
  validate(defs.extendsType, node, "extendsType", extendsType, 1);
  validate(defs.trueType, node, "trueType", trueType, 1);
  validate(defs.falseType, node, "falseType", falseType, 1);
  return node;
}
export function tsInferType(typeParameter) {
  const node = {
    type: "TSInferType",
    typeParameter
  };
  const defs = NODE_FIELDS.TSInferType;
  validate(defs.typeParameter, node, "typeParameter", typeParameter, 1);
  return node;
}
export function tsParenthesizedType(typeAnnotation) {
  const node = {
    type: "TSParenthesizedType",
    typeAnnotation
  };
  const defs = NODE_FIELDS.TSParenthesizedType;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function tsTypeOperator(typeAnnotation, operator) {
  const node = {
    type: "TSTypeOperator",
    typeAnnotation,
    operator
  };
  const defs = NODE_FIELDS.TSTypeOperator;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.operator, node, "operator", operator);
  return node;
}
export function tsIndexedAccessType(objectType, indexType) {
  const node = {
    type: "TSIndexedAccessType",
    objectType,
    indexType
  };
  const defs = NODE_FIELDS.TSIndexedAccessType;
  validate(defs.objectType, node, "objectType", objectType, 1);
  validate(defs.indexType, node, "indexType", indexType, 1);
  return node;
}
export function tsMappedType(key, constraint, nameType = null, typeAnnotation = null) {
  const node = {
    type: "TSMappedType",
    key,
    constraint,
    nameType,
    typeAnnotation
  };
  const defs = NODE_FIELDS.TSMappedType;
  validate(defs.key, node, "key", key, 1);
  validate(defs.constraint, node, "constraint", constraint, 1);
  validate(defs.nameType, node, "nameType", nameType, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function tsTemplateLiteralType(quasis, types) {
  const node = {
    type: "TSTemplateLiteralType",
    quasis,
    types
  };
  const defs = NODE_FIELDS.TSTemplateLiteralType;
  validate(defs.quasis, node, "quasis", quasis, 1);
  validate(defs.types, node, "types", types, 1);
  return node;
}
export function tsLiteralType(literal) {
  const node = {
    type: "TSLiteralType",
    literal
  };
  const defs = NODE_FIELDS.TSLiteralType;
  validate(defs.literal, node, "literal", literal, 1);
  return node;
}
export function tsClassImplements(expression, typeArguments = null) {
  const node = {
    type: "TSClassImplements",
    expression,
    typeArguments
  };
  const defs = NODE_FIELDS.TSClassImplements;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeArguments, node, "typeArguments", typeArguments, 1);
  return node;
}
export function tsInterfaceHeritage(expression, typeArguments = null) {
  const node = {
    type: "TSInterfaceHeritage",
    expression,
    typeArguments
  };
  const defs = NODE_FIELDS.TSInterfaceHeritage;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeArguments, node, "typeArguments", typeArguments, 1);
  return node;
}
export function tsInterfaceDeclaration(id, typeParameters = null, _extends = null, body) {
  const node = {
    type: "TSInterfaceDeclaration",
    id,
    typeParameters,
    extends: _extends,
    body
  };
  const defs = NODE_FIELDS.TSInterfaceDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.extends, node, "extends", _extends, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function tsInterfaceBody(body) {
  const node = {
    type: "TSInterfaceBody",
    body
  };
  const defs = NODE_FIELDS.TSInterfaceBody;
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function tsTypeAliasDeclaration(id, typeParameters = null, typeAnnotation) {
  const node = {
    type: "TSTypeAliasDeclaration",
    id,
    typeParameters,
    typeAnnotation
  };
  const defs = NODE_FIELDS.TSTypeAliasDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.typeParameters, node, "typeParameters", typeParameters, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function tsInstantiationExpression(expression, typeArguments = null) {
  const node = {
    type: "TSInstantiationExpression",
    expression,
    typeArguments
  };
  const defs = NODE_FIELDS.TSInstantiationExpression;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeArguments, node, "typeArguments", typeArguments, 1);
  return node;
}
export function tsAsExpression(expression, typeAnnotation) {
  const node = {
    type: "TSAsExpression",
    expression,
    typeAnnotation
  };
  const defs = NODE_FIELDS.TSAsExpression;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function tsSatisfiesExpression(expression, typeAnnotation) {
  const node = {
    type: "TSSatisfiesExpression",
    expression,
    typeAnnotation
  };
  const defs = NODE_FIELDS.TSSatisfiesExpression;
  validate(defs.expression, node, "expression", expression, 1);
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function tsTypeAssertion(typeAnnotation, expression) {
  const node = {
    type: "TSTypeAssertion",
    typeAnnotation,
    expression
  };
  const defs = NODE_FIELDS.TSTypeAssertion;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function tsEnumBody(members) {
  const node = {
    type: "TSEnumBody",
    members
  };
  const defs = NODE_FIELDS.TSEnumBody;
  validate(defs.members, node, "members", members, 1);
  return node;
}
export function tsEnumDeclaration(id, body) {
  const node = {
    type: "TSEnumDeclaration",
    id,
    body
  };
  const defs = NODE_FIELDS.TSEnumDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function tsEnumMember(id, initializer = null) {
  const node = {
    type: "TSEnumMember",
    id,
    initializer
  };
  const defs = NODE_FIELDS.TSEnumMember;
  validate(defs.id, node, "id", id, 1);
  validate(defs.initializer, node, "initializer", initializer, 1);
  return node;
}
export function tsModuleDeclaration(id, body) {
  const node = {
    type: "TSModuleDeclaration",
    id,
    body,
    kind: "namespace"
  };
  const defs = NODE_FIELDS.TSModuleDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function tsModuleBlock(body) {
  const node = {
    type: "TSModuleBlock",
    body
  };
  const defs = NODE_FIELDS.TSModuleBlock;
  validate(defs.body, node, "body", body, 1);
  return node;
}
export function tsImportType(source, qualifier = null, typeArguments = null) {
  const node = {
    type: "TSImportType",
    source,
    qualifier,
    typeArguments
  };
  const defs = NODE_FIELDS.TSImportType;
  validate(defs.source, node, "source", source, 1);
  validate(defs.qualifier, node, "qualifier", qualifier, 1);
  validate(defs.typeArguments, node, "typeArguments", typeArguments, 1);
  return node;
}
export function tsImportEqualsDeclaration(id, moduleReference) {
  const node = {
    type: "TSImportEqualsDeclaration",
    id,
    moduleReference
  };
  const defs = NODE_FIELDS.TSImportEqualsDeclaration;
  validate(defs.id, node, "id", id, 1);
  validate(defs.moduleReference, node, "moduleReference", moduleReference, 1);
  return node;
}
export function tsExternalModuleReference(expression) {
  const node = {
    type: "TSExternalModuleReference",
    expression
  };
  const defs = NODE_FIELDS.TSExternalModuleReference;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function tsNonNullExpression(expression) {
  const node = {
    type: "TSNonNullExpression",
    expression
  };
  const defs = NODE_FIELDS.TSNonNullExpression;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function tsExportAssignment(expression) {
  const node = {
    type: "TSExportAssignment",
    expression
  };
  const defs = NODE_FIELDS.TSExportAssignment;
  validate(defs.expression, node, "expression", expression, 1);
  return node;
}
export function tsNamespaceExportDeclaration(id) {
  const node = {
    type: "TSNamespaceExportDeclaration",
    id
  };
  const defs = NODE_FIELDS.TSNamespaceExportDeclaration;
  validate(defs.id, node, "id", id, 1);
  return node;
}
export function tsTypeAnnotation(typeAnnotation) {
  const node = {
    type: "TSTypeAnnotation",
    typeAnnotation
  };
  const defs = NODE_FIELDS.TSTypeAnnotation;
  validate(defs.typeAnnotation, node, "typeAnnotation", typeAnnotation, 1);
  return node;
}
export function tsTypeParameterInstantiation(params) {
  const node = {
    type: "TSTypeParameterInstantiation",
    params
  };
  const defs = NODE_FIELDS.TSTypeParameterInstantiation;
  validate(defs.params, node, "params", params, 1);
  return node;
}
export function tsTypeParameterDeclaration(params) {
  const node = {
    type: "TSTypeParameterDeclaration",
    params
  };
  const defs = NODE_FIELDS.TSTypeParameterDeclaration;
  validate(defs.params, node, "params", params, 1);
  return node;
}
export function tsTypeParameter(constraint = null, _default = null, name) {
  const node = {
    type: "TSTypeParameter",
    constraint,
    default: _default,
    name
  };
  const defs = NODE_FIELDS.TSTypeParameter;
  validate(defs.constraint, node, "constraint", constraint, 1);
  validate(defs.default, node, "default", _default, 1);
  validate(defs.name, node, "name", name, 1);
  return node;
}
function NumberLiteral(value) {
  deprecationWarning("NumberLiteral", "NumericLiteral", "The node type ");
  return numericLiteral(value);
}
export { NumberLiteral as numberLiteral };
function RegexLiteral(pattern, flags = "") {
  deprecationWarning("RegexLiteral", "RegExpLiteral", "The node type ");
  return regExpLiteral(pattern, flags);
}
export { RegexLiteral as regexLiteral };
function RestProperty(argument) {
  deprecationWarning("RestProperty", "RestElement", "The node type ");
  return restElement(argument);
}
export { RestProperty as restProperty };
function SpreadProperty(argument) {
  deprecationWarning("SpreadProperty", "SpreadElement", "The node type ");
  return spreadElement(argument);
}
export { SpreadProperty as spreadProperty };