import { types as t } from "@babel/core";
export function hoist(funPath) {
  t.assertFunction(funPath.node);
  const vars = {
    __proto__: null
  };
  function varDeclToExpr({
    node: vdec
  }, includeIdentifiers) {
    t.assertVariableDeclaration(vdec);
    const exprs = [];
    vdec.declarations.forEach(function (dec) {
      vars[dec.id.name] = t.identifier(dec.id.name);
      if (dec.init) {
        exprs.push(t.assignmentExpression("=", dec.id, dec.init));
      } else if (includeIdentifiers) {
        exprs.push(dec.id);
      }
    });
    if (exprs.length === 0) return null;
    if (exprs.length === 1) return exprs[0];
    return t.sequenceExpression(exprs);
  }
  funPath.get("body").traverse({
    VariableDeclaration: {
      exit: function (path) {
        const expr = varDeclToExpr(path, false);
        if (expr === null) {
          path.remove();
        } else {
          for (const name of Object.keys(vars)) {
            path.scope.removeBinding(name);
          }
          path.replaceWith(t.expressionStatement(expr));
        }
        path.skip();
      }
    },
    ForStatement: function (path) {
      const init = path.get("init");
      if (init.isVariableDeclaration()) {
        const expr = varDeclToExpr(init, false);
        if (expr) {
          init.replaceWith(expr);
        } else {
          init.remove();
        }
      }
    },
    ForXStatement: function (path) {
      const left = path.get("left");
      if (left.isVariableDeclaration()) {
        left.replaceWith(varDeclToExpr(left, true));
      }
    },
    FunctionDeclaration: function (path) {
      const node = path.node;
      vars[node.id.name] = node.id;
      const assignment = t.expressionStatement(t.assignmentExpression("=", t.cloneNode(node.id), t.functionExpression(path.scope.generateUidIdentifierBasedOnNode(node), node.params, node.body, node.generator, node.async)));
      if (path.parentPath.isBlockStatement()) {
        path.parentPath.unshiftContainer("body", assignment);
        path.remove();
      } else {
        path.replaceWith(assignment);
        path.scope.removeBinding(node.id.name);
      }
      path.skip();
    },
    FunctionExpression: function (path) {
      path.skip();
    },
    ArrowFunctionExpression: function (path) {
      path.skip();
    }
  });
  const paramNames = {
    __proto__: null
  };
  funPath.get("params").forEach(function (paramPath) {
    const param = paramPath.node;
    if (t.isIdentifier(param)) {
      paramNames[param.name] = param;
    } else {}
  });
  const declarations = [];
  Object.keys(vars).forEach(function (name) {
    if (!Object.hasOwn(paramNames, name)) {
      declarations.push(t.variableDeclarator(vars[name], null));
    }
  });
  return declarations;
}