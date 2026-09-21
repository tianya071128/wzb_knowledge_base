import { types as t } from "@babel/core";
const {
  cloneNode
} = t;
function transformVoidPatternIntoNull(path) {
  const parent = path.parent;
  takeVoidPatternComments(path.node, parent);
  parent.elements[path.key] = null;
  return null;
}
function transformVoidPatternIntoUidIdentifier(path) {
  const uidIdentifier = path.scope.generateUidIdentifier("_");
  const [replacedUidPath] = path.replaceWith(uidIdentifier);
  syncScopeForReplacedVoidPattern(replacedUidPath);
  return replacedUidPath;
}
function takeVoidPatternComments(node, parent) {
  const {
    leadingComments,
    trailingComments
  } = node;
  if (leadingComments != null || trailingComments != null) {
    parent.innerComments ??= [];
    const {
      innerComments
    } = parent;
    const nodeStart = node.start ?? 0;
    const insertedIndex = innerComments.findIndex(comment => comment.end != null && comment.end > nodeStart);
    innerComments.splice(insertedIndex === -1 ? innerComments.length : insertedIndex - 1, 0, ...(leadingComments ?? []), ...(trailingComments ?? []));
  }
}
function syncScopeForReplacedVoidPattern(path) {
  for (let childPath = path; childPath.parentPath != null;) {
    const parentPath = childPath.parentPath;
    switch (parentPath.type) {
      case "VariableDeclaration":
        {
          const kind = parentPath.node.kind;
          const bindingKind = kind === "using" || kind === "await using" ? "const" : kind;
          parentPath.scope.registerBinding(bindingKind, path, childPath);
          return;
        }
      case "AssignmentExpression":
      case "ForInStatement":
      case "ForOfStatement":
        parentPath.scope.push({
          id: cloneNode(path.node)
        });
        return;
      case "CatchClause":
        parentPath.scope.registerBinding("let", parentPath);
        return;
      default:
        if (parentPath.isFunction()) {
          parentPath.scope.registerBinding("param", path, childPath);
          return;
        }
    }
    childPath = parentPath;
  }
  throw new Error("@babel/plugin-proposal-discard-binding: Internal Error");
}
export function transformVoidPattern(path) {
  if (path.parentPath.isArrayPattern()) {
    return transformVoidPatternIntoNull(path);
  } else {
    return transformVoidPatternIntoUidIdentifier(path);
  }
}
function* iterateVoidPatternsInLVal(path) {
  switch (path.type) {
    case "ArrayPattern":
      for (const elementPath of path.get("elements")) {
        yield* iterateVoidPatternsInLVal(elementPath);
      }
      break;
    case "ObjectPattern":
      for (const propertyPath of path.get("properties")) {
        if (propertyPath.isObjectProperty()) {
          yield* iterateVoidPatternsInLVal(propertyPath.get("value"));
        }
      }
      break;
    case "AssignmentPattern":
      yield* iterateVoidPatternsInLVal(path.get("left"));
      break;
    case "VoidPattern":
      yield path;
      break;
    default:
      break;
  }
}
function* iterateVoidPatternInVariableDeclaration(path) {
  for (const declaratorPath of path.get("declarations")) {
    yield* iterateVoidPatternsInLVal(declaratorPath.get("id"));
  }
}
export function hasVoidPatternInVariableDeclaration(path) {
  return !iterateVoidPatternInVariableDeclaration(path).next().done;
}
export function transformVoidPatternInLVal(path) {
  for (const voidPatternPath of iterateVoidPatternsInLVal(path)) {
    transformVoidPattern(voidPatternPath);
  }
}
export function removeTrailingVoidPatternsFromParams(path) {
  const paramPaths = path.get("params");
  for (let i = paramPaths.length - 1; i >= 0; i--) {
    const paramPath = paramPaths[i];
    if (paramPath.isVoidPattern()) {
      paramPath.remove();
    } else {
      break;
    }
  }
}
function isAnonymousFunctionDefinition(node) {
  return t.isArrowFunctionExpression(node) || (t.isFunctionExpression(node) || t.isClassExpression(node)) && !node.id;
}
export function handleUsingNamedEvaluation(path) {
  if (isAnonymousFunctionDefinition(path.node)) {
    path.replaceWith(t.sequenceExpression([t.numericLiteral(0), path.node]));
  }
}