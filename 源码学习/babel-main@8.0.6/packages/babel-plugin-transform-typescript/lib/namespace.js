import { template, types as t } from "@babel/core";
import { registerGlobalType } from "./global-types.js";
import { EXPORTED_CONST_ENUMS_IN_NAMESPACE } from "./const-enum.js";
export function getFirstIdentifier(node) {
  if (t.isIdentifier(node)) {
    return node;
  }
  return getFirstIdentifier(node.left);
}
export default function transpileNamespace(path, allowNamespaces) {
  if (path.node.declare || path.node.id.type === "StringLiteral") {
    path.remove();
    return;
  }
  if (!allowNamespaces) {
    throw path.get("id").buildCodeFrameError("Namespace not marked type-only declare." + " Non-declarative namespaces are only supported experimentally in Babel." + " To enable and review caveats see:" + " https://babeljs.io/docs/en/babel-plugin-transform-typescript");
  }
  const name = getFirstIdentifier(path.node.id).name;
  const value = handleNested(path, path.node);
  if (value === null) {
    const program = path.findParent(p => p.isProgram());
    registerGlobalType(program.scope, name);
    path.remove();
  } else if (path.scope.hasOwnBinding(name)) {
    path.replaceWith(value);
  } else {
    path.scope.registerDeclaration(path.replaceWithMultiple([getDeclaration(name), value])[0]);
  }
}
function getDeclaration(name) {
  return t.variableDeclaration("let", [t.variableDeclarator(t.identifier(name))]);
}
function getMemberExpression(name, itemName) {
  return t.memberExpression(t.identifier(name), t.identifier(itemName));
}
function handleVariableDeclaration(node, name, hub) {
  if (node.kind !== "const") {
    throw hub.file.buildCodeFrameError(node, "Namespaces exporting non-const are not supported by Babel." + " Change to const or see:" + " https://babeljs.io/docs/en/babel-plugin-transform-typescript");
  }
  const {
    declarations
  } = node;
  if (declarations.every(declarator => t.isIdentifier(declarator.id))) {
    for (const declarator of declarations) {
      declarator.init = t.assignmentExpression("=", getMemberExpression(name, declarator.id.name), declarator.init);
    }
    return [node];
  }
  const bindingIdentifiers = t.getBindingIdentifiers(node);
  const assignments = [];
  for (const idName in bindingIdentifiers) {
    assignments.push(t.assignmentExpression("=", getMemberExpression(name, idName), t.cloneNode(bindingIdentifiers[idName])));
  }
  return [node, t.expressionStatement(t.sequenceExpression(assignments))];
}
function buildNestedAmbientModuleError(path, node) {
  return path.hub.buildError(node, "Ambient modules cannot be nested in other modules or namespaces.", Error);
}
function handleNested(path, node, parentExport) {
  const names = new Set();
  const realName = t.isIdentifier(node.id) ? node.id : getFirstIdentifier(node.id);
  const name = path.scope.generateUid(realName.name);
  const body = node.body;
  let id = node.id;
  let namespaceTopLevel;
  if (t.isTSQualifiedName(id)) {
    namespaceTopLevel = body.body;
    while (t.isTSQualifiedName(id)) {
      namespaceTopLevel = [t.exportNamedDeclaration(t.tsModuleDeclaration(t.cloneNode(id.right), t.tsModuleBlock(namespaceTopLevel)))];
      id = id.left;
    }
  } else {
    namespaceTopLevel = body.body;
  }
  let isEmpty = true;
  for (let i = 0; i < namespaceTopLevel.length; i++) {
    const subNode = namespaceTopLevel[i];
    switch (subNode.type) {
      case "TSModuleDeclaration":
        {
          if (!t.isIdentifier(subNode.id)) {
            throw buildNestedAmbientModuleError(path, subNode);
          }
          const transformed = handleNested(path, subNode);
          if (transformed !== null) {
            isEmpty = false;
            const moduleName = subNode.id.name;
            if (names.has(moduleName)) {
              namespaceTopLevel[i] = transformed;
            } else {
              names.add(moduleName);
              namespaceTopLevel.splice(i++, 1, getDeclaration(moduleName), transformed);
            }
          }
          continue;
        }
      case "TSEnumDeclaration":
      case "FunctionDeclaration":
      case "ClassDeclaration":
        isEmpty = false;
        names.add(subNode.id.name);
        continue;
      case "VariableDeclaration":
        {
          isEmpty = false;
          for (const name in t.getBindingIdentifiers(subNode)) {
            names.add(name);
          }
          continue;
        }
      default:
        isEmpty &&= t.isTypeScript(subNode);
        continue;
      case "ExportNamedDeclaration":
    }
    if ("declare" in subNode.declaration && subNode.declaration.declare) {
      continue;
    }
    switch (subNode.declaration.type) {
      case "TSEnumDeclaration":
        EXPORTED_CONST_ENUMS_IN_NAMESPACE.add(subNode.declaration);
      case "FunctionDeclaration":
      case "ClassDeclaration":
        {
          isEmpty = false;
          const itemName = subNode.declaration.id.name;
          names.add(itemName);
          namespaceTopLevel.splice(i++, 1, subNode.declaration, t.expressionStatement(t.assignmentExpression("=", getMemberExpression(name, itemName), t.identifier(itemName))));
          break;
        }
      case "VariableDeclaration":
        {
          isEmpty = false;
          const nodes = handleVariableDeclaration(subNode.declaration, name, path.hub);
          namespaceTopLevel.splice(i, 1, ...nodes);
          i += nodes.length - 1;
          break;
        }
      case "TSModuleDeclaration":
        {
          if (!t.isIdentifier(subNode.declaration.id)) {
            throw buildNestedAmbientModuleError(path, subNode.declaration);
          }
          const transformed = handleNested(path, subNode.declaration, t.identifier(name));
          if (transformed !== null) {
            isEmpty = false;
            const moduleName = subNode.declaration.id.name;
            if (names.has(moduleName)) {
              namespaceTopLevel[i] = transformed;
            } else {
              names.add(moduleName);
              namespaceTopLevel.splice(i++, 1, getDeclaration(moduleName), transformed);
            }
          } else {
            namespaceTopLevel.splice(i, 1);
            i--;
          }
        }
    }
  }
  if (isEmpty) return null;
  let fallthroughValue = t.objectExpression([]);
  if (parentExport) {
    const memberExpr = t.memberExpression(parentExport, realName);
    fallthroughValue = template.expression.ast`
      ${t.cloneNode(memberExpr)} ||
        (${t.cloneNode(memberExpr)} = ${fallthroughValue})
    `;
  }
  return template.statement.ast`
    (function (${t.identifier(name)}) {
      ${namespaceTopLevel}
    })(${realName} || (${t.cloneNode(realName)} = ${fallthroughValue}));
  `;
}