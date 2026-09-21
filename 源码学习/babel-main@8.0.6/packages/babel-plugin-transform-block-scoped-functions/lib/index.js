import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";
export default declare(api => {
  api.assertVersion("8.0.6");
  function transformStatementList(parentPath, paths) {
    const isInStrictMode = parentPath.isInStrictMode();
    for (const path of paths) {
      if (!path.isFunctionDeclaration()) continue;
      const useLet = isInStrictMode || path.node.async || path.node.generator || path.getData("@babel/plugin-transform-async-generator-functions/async_generator_function");
      const func = path.node;
      const declar = t.variableDeclaration(useLet ? "let" : "var", [t.variableDeclarator(func.id, t.toExpression(func))]);
      declar._blockHoist = 2;
      func.id = null;
      path.replaceWith(declar);
    }
  }
  const visitor = {
    BlockStatement(path) {
      const {
        node,
        parent
      } = path;
      if (t.isFunction(parent, {
        body: node
      }) || t.isExportDeclaration(parent)) {
        return;
      }
      transformStatementList(path, path.get("body"));
    },
    SwitchStatement(path) {
      const {
        node
      } = path;
      const fns = [];
      for (const caseNode of node.cases) {
        const {
          consequent
        } = caseNode;
        for (let i = consequent.length - 1; i >= 0; i--) {
          if (t.isFunctionDeclaration(consequent[i])) {
            fns.push(consequent[i]);
            consequent.splice(i, 1);
          }
        }
      }
      if (!fns.length) return;
      path.replaceWith(t.blockStatement([t.variableDeclaration("let", fns.map(fn => t.variableDeclarator(t.cloneNode(fn.id), t.toExpression(fn)))), node]));
    }
  };
  return {
    name: "transform-block-scoped-functions",
    visitor: {
      ...visitor,
      Loop(path) {
        path.traverse(visitor);
      }
    }
  };
});