export function JSXAttribute(node) {
  this.print(node.name);
  if (node.value) {
    this.tokenChar(61);
    this.print(node.value);
  }
}
export function JSXIdentifier(node) {
  this.word(node.name);
}
export function JSXNamespacedName(node) {
  this.print(node.namespace);
  this.tokenChar(58);
  this.print(node.name);
}
export function JSXMemberExpression(node) {
  this.print(node.object);
  this.tokenChar(46);
  this.print(node.property);
}
export function JSXSpreadAttribute(node) {
  this.tokenChar(123);
  this.token("...");
  this.print(node.argument);
  this.rightBrace(node);
}
export function JSXExpressionContainer(node) {
  this.tokenChar(123);
  this.print(node.expression);
  this.rightBrace(node);
}
export function JSXSpreadChild(node) {
  this.tokenChar(123);
  this.token("...");
  this.print(node.expression);
  this.rightBrace(node);
}
export function JSXText(node) {
  const raw = this.getPossibleRaw(node);
  if (raw !== undefined) {
    this.token(raw, true);
  } else {
    this.token(node.value, true);
  }
}
export function JSXElement(node) {
  const open = node.openingElement;
  this.print(open);
  if (open.selfClosing) return;
  this.indent();
  for (const child of node.children) {
    this.print(child);
  }
  this.dedent();
  this.print(node.closingElement);
}
function spaceSeparator() {
  this.space();
}
export function JSXOpeningElement(node) {
  this.tokenChar(60);
  this.print(node.name);
  this.print(node.typeArguments);
  if (node.attributes.length > 0) {
    this.space();
    this.printJoin(node.attributes, undefined, undefined, spaceSeparator);
  }
  if (node.selfClosing) {
    this.space();
    this.tokenChar(47);
  }
  this.tokenChar(62);
}
export function JSXClosingElement(node) {
  this.tokenChar(60);
  this.tokenChar(47);
  this.print(node.name);
  this.tokenChar(62);
}
export function JSXEmptyExpression() {
  this.printInnerComments();
}
export function JSXFragment(node) {
  this.print(node.openingFragment);
  this.indent();
  for (const child of node.children) {
    this.print(child);
  }
  this.dedent();
  this.print(node.closingFragment);
}
export function JSXOpeningFragment() {
  this.tokenChar(60);
  this.tokenChar(62);
}
export function JSXClosingFragment() {
  this.token("</");
  this.tokenChar(62);
}