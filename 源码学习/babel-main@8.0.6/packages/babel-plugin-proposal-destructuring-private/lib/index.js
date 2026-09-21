import { declare } from "@babel/helper-plugin-utils";
import { hasPrivateKeys, hasPrivateClassElement, transformPrivateKeyDestructuring, buildVariableDeclarationFromParams } from "./util.js";
import { convertFunctionParams } from "@babel/plugin-transform-parameters";
import { unshiftForXStatementBody } from "@babel/plugin-transform-destructuring";
export default declare(function ({
  assertVersion,
  assumption,
  types: t
}) {
  assertVersion("8.0.6");
  const {
    assignmentExpression,
    assignmentPattern,
    buildUndefinedNode,
    cloneNode,
    expressionStatement,
    isExpressionStatement,
    isIdentifier,
    isSequenceExpression,
    sequenceExpression,
    variableDeclaration,
    variableDeclarator
  } = t;
  const ignoreFunctionLength = assumption("ignoreFunctionLength");
  const objectRestNoSymbols = assumption("objectRestNoSymbols");
  const privateKeyDestructuringVisitor = {
    Function(path) {
      const firstPrivateIndex = path.node.params.findIndex(param => hasPrivateKeys(param));
      if (firstPrivateIndex === -1) return;
      convertFunctionParams(path, ignoreFunctionLength, () => false);
      const {
        node,
        scope
      } = path;
      const {
        params
      } = node;
      const firstAssignmentPatternIndex = ignoreFunctionLength ? -1 : params.findIndex(param => param.type === "AssignmentPattern");
      const paramsAfterIndex = params.splice(firstPrivateIndex);
      const {
        params: transformedParams,
        variableDeclaration
      } = buildVariableDeclarationFromParams(paramsAfterIndex, scope);
      path.get("body").unshiftContainer("body", variableDeclaration);
      params.push(...transformedParams);
      if (firstAssignmentPatternIndex >= firstPrivateIndex) {
        params[firstAssignmentPatternIndex] = assignmentPattern(params[firstAssignmentPatternIndex], buildUndefinedNode());
      }
      scope.crawl();
    },
    CatchClause(path) {
      const {
        node,
        scope
      } = path;
      if (!hasPrivateKeys(node.param)) return;
      const ref = scope.generateUidIdentifier("e");
      path.get("body").unshiftContainer("body", variableDeclaration("let", [variableDeclarator(node.param, ref)]));
      node.param = cloneNode(ref);
      scope.crawl();
    },
    ForXStatement(path) {
      const {
        node,
        scope
      } = path;
      const leftPath = path.get("left");
      if (leftPath.isVariableDeclaration()) {
        const left = leftPath.node;
        if (!hasPrivateKeys(left.declarations[0].id)) return;
        const temp = scope.generateUidIdentifier("ref");
        node.left = variableDeclaration(left.kind, [variableDeclarator(temp, null)]);
        left.declarations[0].init = cloneNode(temp);
        unshiftForXStatementBody(path, [left]);
        scope.crawl();
      } else if (leftPath.isPattern()) {
        if (!hasPrivateKeys(leftPath.node)) return;
        const temp = scope.generateUidIdentifier("ref");
        node.left = variableDeclaration("const", [variableDeclarator(temp, null)]);
        const assignExpr = expressionStatement(assignmentExpression("=", leftPath.node, cloneNode(temp)));
        unshiftForXStatementBody(path, [assignExpr]);
        scope.crawl();
      }
    },
    VariableDeclaration(path, state) {
      const {
        scope,
        node
      } = path;
      const {
        declarations
      } = node;
      if (!declarations.some(declarator => hasPrivateKeys(declarator.id))) {
        return;
      }
      const newDeclarations = [];
      for (const declarator of declarations) {
        for (const {
          left,
          right
        } of transformPrivateKeyDestructuring(declarator.id, declarator.init, scope, false, false, name => state.addHelper(name), objectRestNoSymbols, true)) {
          newDeclarations.push(variableDeclarator(left, right));
        }
      }
      node.declarations = newDeclarations;
      scope.crawl();
    },
    AssignmentExpression(path, state) {
      const {
        node,
        scope,
        parent
      } = path;
      if (!hasPrivateKeys(node.left)) return;
      const assignments = [];
      const shouldPreserveCompletion = !isExpressionStatement(parent) && !isSequenceExpression(parent) || path.isCompletionRecord();
      for (const {
        left,
        right
      } of transformPrivateKeyDestructuring(node.left, node.right, scope, true, shouldPreserveCompletion, name => state.addHelper(name), objectRestNoSymbols, true)) {
        assignments.push(assignmentExpression("=", left, right));
      }
      if (shouldPreserveCompletion) {
        const {
          left,
          right
        } = assignments[0];
        if (isIdentifier(left) && right === node.right) {
          if (!isIdentifier(assignments[assignments.length - 1].right, {
            name: left.name
          })) {
            assignments.push(cloneNode(left));
          }
        } else {
          const tempId = scope.generateDeclaredUidIdentifier("m");
          assignments.unshift(assignmentExpression("=", tempId, cloneNode(node.right)));
          assignments.push(cloneNode(tempId));
        }
      }
      path.replaceWith(sequenceExpression(assignments));
      scope.crawl();
    }
  };
  const visitor = {
    Class(path, state) {
      if (!hasPrivateClassElement(path.node.body)) return;
      path.traverse(privateKeyDestructuringVisitor, state);
    }
  };
  return {
    name: "proposal-destructuring-private",
    manipulateOptions: (_, p) => p.plugins.push("destructuringPrivate"),
    visitor: visitor
  };
});