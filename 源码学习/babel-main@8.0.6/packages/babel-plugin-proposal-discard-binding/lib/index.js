import { OptionValidator } from "@babel/helper-validator-option";
import { declare } from "@babel/helper-plugin-utils";
import { hasVoidPatternInVariableDeclaration, handleUsingNamedEvaluation, removeTrailingVoidPatternsFromParams, transformVoidPattern, transformVoidPatternInLVal } from "./utils.js";
const v = new OptionValidator("@babel/plugin-proposal-discard-binding");
function validatePluginOptions(options) {
  v.validateTopLevelOptions(options, {
    syntaxType: "syntaxType"
  });
  const {
    syntaxType
  } = options;
  v.invariant(syntaxType === "void", "'.syntaxType' option required, representing the discard binding. " + "Currently, the only supported value is 'void'.");
  return options;
}
export default declare(function ({
  assertVersion,
  assumption,
  traverse
}, options) {
  assertVersion("8.0.6");
  options = validatePluginOptions(options);
  const ignoreFunctionLength = assumption("ignoreFunctionLength");
  return {
    name: "proposal-discard-binding",
    manipulateOptions: (_, p) => p.plugins.push(["discardBinding", options]),
    visitor: traverse.explode({
      ExportNamedDeclaration(path) {
        const declarationPath = path.get("declaration");
        if (!declarationPath.isVariableDeclaration()) return;
        if (!hasVoidPatternInVariableDeclaration(declarationPath)) return;
        path.splitExportDeclaration();
      },
      VoidPattern(path) {
        transformVoidPattern(path);
      },
      Function(path) {
        if (ignoreFunctionLength) {
          removeTrailingVoidPatternsFromParams(path);
        }
      },
      AssignmentExpression(path) {
        const leftPath = path.get("left");
        if (leftPath.isLVal()) {
          transformVoidPatternInLVal(leftPath);
        }
      },
      VariableDeclaration(path) {
        for (const declarationPath of path.get("declarations")) {
          transformVoidPatternInLVal(declarationPath.get("id"));
        }
      },
      "BlockStatement|StaticBlock"(path) {
        for (const statementPath of path.get("body")) {
          if (statementPath.isVariableDeclaration()) {
            const kind = statementPath.node.kind;
            if (kind === "using" || kind === "await using") {
              for (const declarationPath of statementPath.get("declarations")) {
                const idPath = declarationPath.get("id");
                if (idPath.isVoidPattern()) {
                  transformVoidPattern(idPath);
                  handleUsingNamedEvaluation(declarationPath.get("init"));
                }
              }
            }
          }
        }
      }
    })
  };
});