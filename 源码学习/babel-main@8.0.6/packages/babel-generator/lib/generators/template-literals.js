export function TaggedTemplateExpression(node) {
  this.print(node.tag);
  this.print(node.typeArguments);
  this.print(node.quasi);
}
export function TemplateElement() {
  throw new Error("TemplateElement printing is handled in TemplateLiteral");
}
export function _printTemplate(node, substitutions) {
  const quasis = node.quasis;
  let partRaw = "`";
  for (let i = 0; i < quasis.length - 1; i++) {
    partRaw += quasis[i].value.raw;
    this.token(partRaw + "${", true);
    this.print(substitutions[i]);
    partRaw = "}";
  }
  partRaw += quasis[quasis.length - 1].value.raw;
  this.token(partRaw + "`", true);
}
export function TemplateLiteral(node) {
  _printTemplate.call(this, node, node.expressions);
}