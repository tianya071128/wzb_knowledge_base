export function File(node) {
  if (node.program) {
    this.print(node.program.interpreter);
  }
  this.print(node.program);
}
export function Program(node) {
  this.printInnerComments(false);
  const directivesLen = node.directives?.length;
  if (directivesLen) {
    const newline = node.body.length ? 2 : 1;
    this.printSequence(node.directives, undefined, undefined, newline);
    if (!node.directives[directivesLen - 1].trailingComments?.length) {
      this.newline(newline);
    }
  }
  this.printSequence(node.body);
}
export function BlockStatement(node) {
  this.tokenChar(123);
  const oldNoLineTerminatorAfterNode = this.enterDelimited();
  const directivesLen = node.directives?.length;
  if (directivesLen) {
    const newline = node.body.length ? 2 : 1;
    this.printSequence(node.directives, true, true, newline);
    if (!node.directives[directivesLen - 1].trailingComments?.length) {
      this.newline(newline);
    }
  }
  this.printSequence(node.body, true, true);
  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
  this.rightBrace(node);
}
export function Directive(node) {
  this.print(node.value);
  this.semicolon();
}
const unescapedSingleQuoteRE = /(?:^|[^\\])(?:\\\\)*'/;
const unescapedDoubleQuoteRE = /(?:^|[^\\])(?:\\\\)*"/;
export function DirectiveLiteral(node) {
  const raw = this.getPossibleRaw(node);
  if (!this.format.minified && raw !== undefined) {
    this.token(raw);
    return;
  }
  const {
    value
  } = node;
  if (!unescapedDoubleQuoteRE.test(value)) {
    this.token(`"${value}"`);
  } else if (!unescapedSingleQuoteRE.test(value)) {
    this.token(`'${value}'`);
  } else {
    throw new Error("Malformed AST: it is not possible to print a directive containing" + " both unescaped single and double quotes.");
  }
}
export function InterpreterDirective(node) {
  this.token(`#!${node.value}`);
  this._newline();
}
export function Placeholder(node) {
  this.token("%%");
  this.print(node.name);
  this.token("%%");
  if (node.expectedNode === "Statement") {
    this.semicolon();
  }
}