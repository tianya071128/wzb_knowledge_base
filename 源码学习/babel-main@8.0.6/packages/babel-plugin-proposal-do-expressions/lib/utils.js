import { traverse, types as t } from "@babel/core";
const mergeVisitors = traverse.visitors.merge;
function throwError(path) {
  throw path.buildCodeFrameError("This control flow escape from do expression is not supported.");
}
const controlFlowVisitor = {
  FunctionParent(path) {
    path.skip();
  },
  "SwitchStatement|Loop"(_, state) {
    state.break.add(null);
    state.continue.add(null);
  },
  LabeledStatement(path, state) {
    const name = path.node.label.name;
    state.break.add(name);
  },
  BreakStatement(path, state) {
    if (!state.break.has(path.node.label?.name ?? null)) {
      throwError(path);
    }
  },
  ContinueStatement(path, state) {
    if (!state.continue.has(path.node.label?.name ?? null)) {
      throwError(path);
    }
  },
  ReturnStatement(path, state) {
    state.returnPath = path;
  }
};
export function collectControlFlowStatements(path) {
  const state = {
    break: new Set(),
    continue: new Set(),
    returnPath: null
  };
  path.traverse(controlFlowVisitor, state);
  return state;
}
export function wrapDoExpressionInIIFE(path) {
  const state = {
    break: new Set(),
    continue: new Set(),
    returnPath: null
  };
  path.traverse(mergeVisitors([{
    DoExpression(path) {
      const body = path.node.body.body;
      if (body.length) {
        path.replaceExpressionWithStatements(body);
      } else {
        path.replaceWith(t.buildUndefinedNode());
      }
    }
  }, controlFlowVisitor]), state);
  if (state.returnPath) {
    throwError(state.returnPath);
  }
}