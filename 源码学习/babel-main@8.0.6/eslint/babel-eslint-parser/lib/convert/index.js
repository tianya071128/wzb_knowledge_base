import convertTokens from "./convertTokens.js";
import convertComments from "./convertComments.js";
import convertAST from "./convertAST.js";
export function convertFile(ast, code, tokLabels, visitorKeys) {
  ast.tokens = convertTokens(ast.tokens, code, tokLabels);
  convertComments(ast.comments);
  convertAST(ast, visitorKeys);
  return ast;
}
export function convertError(err) {
  if (err instanceof SyntaxError) {
    err.lineNumber = err.loc.line;
    err.column = err.loc.column;
  }
  return err;
}
//# sourceMappingURL=index.js.map
