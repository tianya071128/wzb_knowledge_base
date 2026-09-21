import { types as t } from "@babel/core";
export default function replaceShorthandObjectMethod(path) {
  if (!path.node || !t.isFunction(path.node)) {
    throw new Error("replaceShorthandObjectMethod can only be called on Function AST node paths.");
  }
  if (!t.isObjectMethod(path.node)) {
    return path;
  }
  if (!path.node.generator) {
    return path;
  }
  const parameters = path.node.params.map(function (param) {
    return t.cloneNode(param);
  });
  const functionExpression = t.functionExpression(null, parameters, t.cloneNode(path.node.body), path.node.generator, path.node.async);
  return path.replaceWith(t.objectProperty(t.cloneNode(path.node.key), functionExpression, path.node.computed, false))[0].get("value");
}