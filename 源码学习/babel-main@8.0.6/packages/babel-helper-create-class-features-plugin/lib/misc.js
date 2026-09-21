import { template, types as t } from "@babel/core";
import { visitors } from "@babel/traverse";
const findBareSupers = visitors.environmentVisitor({
  Super(path) {
    const {
      node,
      parentPath
    } = path;
    if (parentPath.isCallExpression({
      callee: node
    })) {
      this.push(parentPath);
    }
  }
});
const referenceVisitor = {
  "TSTypeAnnotation|TypeAnnotation"(path) {
    path.skip();
  },
  ReferencedIdentifier(path, {
    scope
  }) {
    if (scope.hasOwnBinding(path.node.name)) {
      scope.rename(path.node.name);
      path.skip();
    }
  }
};
function handleClassTDZ(path, state) {
  if (state.classBinding && state.classBinding === path.scope.getBinding(path.node.name)) {
    const classNameTDZError = state.file.addHelper("classNameTDZError");
    const throwNode = t.callExpression(classNameTDZError, [t.stringLiteral(path.node.name)]);
    path.replaceWith(t.sequenceExpression([throwNode, path.node]));
    path.skip();
  }
}
const classFieldDefinitionEvaluationTDZVisitor = {
  ReferencedIdentifier: handleClassTDZ,
  "TSTypeAnnotation|TypeAnnotation"(path) {
    path.skip();
  }
};
export function injectInitialization(path, constructor, nodes, renamer, lastReturnsThis) {
  if (!nodes.length) return;
  const isDerived = !!path.node.superClass;
  if (!constructor) {
    const newConstructor = t.classMethod("constructor", t.identifier("constructor"), [], t.blockStatement([]));
    if (isDerived) {
      newConstructor.params = [t.restElement(t.identifier("args"))];
      newConstructor.body.body.push(template.statement.ast`super(...args)`);
    }
    [constructor] = path.get("body").unshiftContainer("body", newConstructor);
  }
  if (renamer) {
    renamer(referenceVisitor, {
      scope: constructor.scope
    });
  }
  if (isDerived) {
    const bareSupers = [];
    constructor.traverse(findBareSupers, bareSupers);
    let isFirst = true;
    for (const bareSuper of bareSupers) {
      if (isFirst) {
        isFirst = false;
      } else {
        nodes = nodes.map(n => t.cloneNode(n));
      }
      if (!bareSuper.parentPath.isExpressionStatement()) {
        const allNodes = [bareSuper.node, ...nodes.map(n => t.toExpression(n))];
        if (!lastReturnsThis) allNodes.push(t.thisExpression());
        bareSuper.replaceWith(t.sequenceExpression(allNodes));
      } else {
        bareSuper.insertAfter(nodes);
      }
    }
  } else {
    constructor.get("body").unshiftContainer("body", nodes);
  }
}
export function memoiseComputedKey(keyNode, scope, hint) {
  const isUidReference = t.isIdentifier(keyNode) && scope.hasUid(keyNode.name);
  if (isUidReference) {
    return;
  }
  const isMemoiseAssignment = t.isAssignmentExpression(keyNode, {
    operator: "="
  }) && t.isIdentifier(keyNode.left) && scope.hasUid(keyNode.left.name);
  if (isMemoiseAssignment) {
    return t.cloneNode(keyNode);
  } else {
    const ident = t.identifier(hint);
    scope.push({
      id: ident,
      kind: "let"
    });
    return t.assignmentExpression("=", t.cloneNode(ident), keyNode);
  }
}
export function extractComputedKeys(path, computedPaths, file) {
  const {
    scope
  } = path;
  const declarations = [];
  const state = {
    classBinding: path.node.id && scope.getBinding(path.node.id.name),
    file
  };
  for (const computedPath of computedPaths) {
    const computedKey = computedPath.get("key");
    if (computedKey.isReferencedIdentifier()) {
      handleClassTDZ(computedKey, state);
    } else {
      computedKey.traverse(classFieldDefinitionEvaluationTDZVisitor, state);
    }
    const computedNode = computedPath.node;
    if (!computedKey.isConstantExpression()) {
      const assignment = memoiseComputedKey(computedKey.node, scope, scope.generateUidBasedOnNode(computedKey.node));
      if (assignment) {
        declarations.push(t.expressionStatement(assignment));
        computedNode.key = t.cloneNode(assignment.left);
      }
    }
  }
  return declarations;
}