import isBabelPluginFactory from "../utils/is-babel-plugin-factory.js";
function getReturnValue(node) {
  const {
    body
  } = node;
  if (body.type === "BlockStatement") {
    const returnNode = body.body.find(n => n.type === "ReturnStatement");
    return returnNode?.argument;
  }
  return body;
}
export default {
  meta: {
    schema: []
  },
  create(context) {
    let pluginFound = false;
    return {
      FunctionDeclaration: functionVisitor,
      FunctionExpression: functionVisitor,
      ArrowFunctionExpression: functionVisitor,
      "Program:exit"(node) {
        if (!pluginFound) {
          context.report({
            node,
            message: "This file does not export a Babel plugin."
          });
        }
      }
    };
    function functionVisitor(node) {
      if (pluginFound || !isBabelPluginFactory(node, context.sourceCode.getScope(node))) {
        return;
      }
      const returnValue = getReturnValue(node);
      if (!returnValue || returnValue.type !== "ObjectExpression") return;
      pluginFound = true;
      if (!returnValue.properties.some(p => p.type === "Property" && p.key.type === "Identifier" && p.key.name === "name")) {
        context.report({
          node: returnValue,
          message: "This Babel plugin doesn't have a 'name' property."
        });
      }
    }
  }
};