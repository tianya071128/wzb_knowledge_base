import { template, types as t } from "@babel/core";
function isInType(path) {
  do {
    switch (path.parent.type) {
      case "TSTypeAnnotation":
      case "TSTypeAliasDeclaration":
      case "TSTypeReference":
      case "TypeAnnotation":
      case "TypeAlias":
        return true;
      case "ExportSpecifier":
        return path.parentPath.parent.exportKind === "type";
      default:
        if (path.parentPath.isStatement() || path.parentPath.isExpression()) {
          return false;
        }
    }
  } while (path = path.parentPath);
}
export default function rewriteLiveReferences(programPath, metadata, wrapReference) {
  const imported = new Map();
  const exported = new Map();
  const requeueInParent = path => {
    programPath.requeue(path);
  };
  for (const [source, data] of metadata.source) {
    for (const [localName, importName] of data.imports) {
      imported.set(localName, [source, importName, null]);
    }
    for (const localName of data.importsNamespace) {
      imported.set(localName, [source, null, localName]);
    }
  }
  for (const [local, data] of metadata.local) {
    let exportMeta = exported.get(local);
    if (!exportMeta) {
      exportMeta = [];
      exported.set(local, exportMeta);
    }
    exportMeta.push(...data.names);
  }
  const rewriteBindingInitVisitorState = {
    metadata,
    requeueInParent,
    scope: programPath.scope,
    exported
  };
  programPath.traverse(rewriteBindingInitVisitor, rewriteBindingInitVisitorState);
  const rewriteReferencesVisitorState = {
    seen: new WeakSet(),
    metadata,
    requeueInParent,
    scope: programPath.scope,
    imported,
    exported,
    buildImportReference([source, importName, localName], identNode) {
      const meta = metadata.source.get(source);
      meta.referenced = true;
      if (localName) {
        if (meta.wrap) {
          identNode = wrapReference(identNode, meta.wrap) ?? identNode;
        }
        return identNode;
      }
      let namespace = t.identifier(meta.name);
      if (meta.wrap) {
        namespace = wrapReference(namespace, meta.wrap) ?? namespace;
      }
      if (importName === "default" && meta.interop === "node-default") {
        return namespace;
      }
      const computed = metadata.stringSpecifiers.has(importName);
      return t.memberExpression(namespace, computed ? t.stringLiteral(importName) : t.identifier(importName), computed);
    }
  };
  programPath.traverse(rewriteReferencesVisitor, rewriteReferencesVisitorState);
}
const rewriteBindingInitVisitor = {
  Scope(path) {
    path.skip();
  },
  ClassDeclaration(path) {
    const {
      requeueInParent,
      exported,
      metadata
    } = this;
    const {
      id
    } = path.node;
    if (!id) throw new Error("Expected class to have a name");
    const localName = id.name;
    const exportNames = exported.get(localName) || [];
    if (exportNames.length > 0) {
      const statement = t.expressionStatement(buildBindingExportAssignmentExpression(metadata, exportNames, t.identifier(localName), path.scope));
      statement._blockHoist = path.node._blockHoist;
      requeueInParent(path.insertAfter(statement)[0]);
    }
  },
  VariableDeclaration(path) {
    const {
      requeueInParent,
      exported,
      metadata
    } = this;
    const isVar = path.node.kind === "var";
    for (const decl of path.get("declarations")) {
      const {
        id
      } = decl.node;
      let {
        init
      } = decl.node;
      if (t.isIdentifier(id) && exported.has(id.name) && !t.isArrowFunctionExpression(init) && (!t.isFunctionExpression(init) || init.id) && (!t.isClassExpression(init) || init.id)) {
        if (!init) {
          if (isVar) {
            continue;
          } else {
            init = t.buildUndefinedNode();
          }
        }
        decl.node.init = buildBindingExportAssignmentExpression(metadata, exported.get(id.name), init, path.scope);
        requeueInParent(decl.get("init"));
      } else {
        for (const localName of Object.keys(decl.getOuterBindingIdentifiers())) {
          if (exported.has(localName)) {
            const statement = t.expressionStatement(buildBindingExportAssignmentExpression(metadata, exported.get(localName), t.identifier(localName), path.scope));
            statement._blockHoist = path.node._blockHoist;
            requeueInParent(path.insertAfter(statement)[0]);
          }
        }
      }
    }
  }
};
const buildBindingExportAssignmentExpression = (metadata, exportNames, localExpr, scope) => {
  const exportsObjectName = metadata.exportName;
  for (let currentScope = scope; currentScope != null; currentScope = currentScope.parent) {
    if (currentScope.hasOwnBinding(exportsObjectName)) {
      currentScope.rename(exportsObjectName);
    }
  }
  return (exportNames || []).reduce((expr, exportName) => {
    const {
      stringSpecifiers
    } = metadata;
    const computed = stringSpecifiers.has(exportName);
    return t.assignmentExpression("=", t.memberExpression(t.identifier(exportsObjectName), computed ? t.stringLiteral(exportName) : t.identifier(exportName), computed), expr);
  }, localExpr);
};
const buildImportThrow = localName => {
  return template.expression.ast`
    (function() {
      throw new Error('"' + '${localName}' + '" is read-only.');
    })()
  `;
};
const rewriteReferencesVisitor = {
  ReferencedIdentifier(path) {
    const {
      seen,
      buildImportReference,
      scope,
      imported,
      requeueInParent
    } = this;
    if (seen.has(path.node)) return;
    seen.add(path.node);
    const localName = path.node.name;
    const importData = imported.get(localName);
    if (importData) {
      if (isInType(path)) {
        throw path.buildCodeFrameError(`Cannot transform the imported binding "${localName}" since it's also used in a type annotation. ` + `Please strip type annotations using @babel/preset-typescript or @babel/preset-flow.`);
      }
      const localBinding = path.scope.getBinding(localName);
      const rootBinding = scope.getBinding(localName);
      if (rootBinding !== localBinding) return;
      const ref = buildImportReference(importData, path.node);
      ref.loc = path.node.loc;
      if ((path.parentPath.isCallExpression({
        callee: path.node
      }) || path.parentPath.isOptionalCallExpression({
        callee: path.node
      }) || path.parentPath.isTaggedTemplateExpression({
        tag: path.node
      })) && t.isMemberExpression(ref)) {
        path.replaceWith(t.sequenceExpression([t.numericLiteral(0), ref]));
      } else if (path.isJSXIdentifier() && t.isMemberExpression(ref)) {
        const {
          object,
          property
        } = ref;
        path.replaceWith(t.jsxMemberExpression(t.jsxIdentifier(object.name), t.jsxIdentifier(property.name)));
      } else {
        path.replaceWith(ref);
      }
      requeueInParent(path);
      path.skip();
    }
  },
  UpdateExpression(path) {
    const {
      scope,
      seen,
      imported,
      exported,
      requeueInParent,
      buildImportReference
    } = this;
    if (seen.has(path.node)) return;
    seen.add(path.node);
    const arg = path.get("argument");
    if (arg.isMemberExpression()) return;
    const update = path.node;
    if (arg.isIdentifier()) {
      const localName = arg.node.name;
      if (scope.getBinding(localName) !== path.scope.getBinding(localName)) {
        return;
      }
      const exportedNames = exported.get(localName);
      const importData = imported.get(localName);
      if (exportedNames?.length > 0 || importData) {
        if (importData) {
          path.replaceWith(t.assignmentExpression(update.operator[0] + "=", buildImportReference(importData, arg.node), buildImportThrow(localName)));
        } else if (update.prefix) {
          path.replaceWith(buildBindingExportAssignmentExpression(this.metadata, exportedNames, t.cloneNode(update), path.scope));
        } else {
          const ref = scope.generateDeclaredUidIdentifier(localName);
          path.replaceWith(t.sequenceExpression([t.assignmentExpression("=", t.cloneNode(ref), t.cloneNode(update)), buildBindingExportAssignmentExpression(this.metadata, exportedNames, t.identifier(localName), path.scope), t.cloneNode(ref)]));
        }
      }
    }
    requeueInParent(path);
    path.skip();
  },
  AssignmentExpression: {
    exit(path) {
      const {
        scope,
        seen,
        imported,
        exported,
        requeueInParent,
        buildImportReference
      } = this;
      if (seen.has(path.node)) return;
      seen.add(path.node);
      const left = path.get("left");
      if (left.isMemberExpression()) return;
      if (left.isIdentifier()) {
        const localName = left.node.name;
        if (scope.getBinding(localName) !== path.scope.getBinding(localName)) {
          return;
        }
        const exportedNames = exported.get(localName);
        const importData = imported.get(localName);
        if (exportedNames?.length > 0 || importData) {
          const assignment = path.node;
          if (importData) {
            assignment.left = buildImportReference(importData, left.node);
            assignment.right = t.sequenceExpression([assignment.right, buildImportThrow(localName)]);
          }
          const {
            operator
          } = assignment;
          let newExpr;
          if (operator === "=") {
            newExpr = assignment;
          } else if (operator === "&&=" || operator === "||=" || operator === "??=") {
            newExpr = t.assignmentExpression("=", assignment.left, t.logicalExpression(operator.slice(0, -1), t.cloneNode(assignment.left), assignment.right));
          } else {
            newExpr = t.assignmentExpression("=", assignment.left, t.binaryExpression(operator.slice(0, -1), t.cloneNode(assignment.left), assignment.right));
          }
          path.replaceWith(buildBindingExportAssignmentExpression(this.metadata, exportedNames, newExpr, path.scope));
          requeueInParent(path);
          path.skip();
        }
      } else {
        const ids = left.getOuterBindingIdentifiers();
        const programScopeIds = Object.keys(ids).filter(localName => scope.getBinding(localName) === path.scope.getBinding(localName));
        const id = programScopeIds.find(localName => imported.has(localName));
        if (id) {
          path.node.right = t.sequenceExpression([path.node.right, buildImportThrow(id)]);
        }
        const items = [];
        programScopeIds.forEach(localName => {
          const exportedNames = exported.get(localName) || [];
          if (exportedNames.length > 0) {
            items.push(buildBindingExportAssignmentExpression(this.metadata, exportedNames, t.identifier(localName), path.scope));
          }
        });
        if (items.length > 0) {
          let node = t.sequenceExpression(items);
          if (path.parentPath.isExpressionStatement()) {
            node = t.expressionStatement(node);
            node._blockHoist = path.parentPath.node._blockHoist;
          }
          const statement = path.insertAfter(node)[0];
          requeueInParent(statement);
        }
      }
    }
  },
  ForXStatement(path) {
    const {
      scope,
      node
    } = path;
    const {
      left
    } = node;
    const {
      exported,
      imported,
      scope: programScope
    } = this;
    if (!t.isVariableDeclaration(left)) {
      let didTransformExport = false,
        importConstViolationName;
      const loopBodyScope = path.get("body").scope;
      for (const name of Object.keys(t.getOuterBindingIdentifiers(left))) {
        if (programScope.getBinding(name) === scope.getBinding(name)) {
          if (exported.has(name)) {
            didTransformExport = true;
            if (loopBodyScope.hasOwnBinding(name)) {
              loopBodyScope.rename(name);
            }
          }
          if (imported.has(name) && !importConstViolationName) {
            importConstViolationName = name;
          }
        }
      }
      if (!didTransformExport && !importConstViolationName) {
        return;
      }
      path.ensureBlock();
      const bodyPath = path.get("body");
      const newLoopId = scope.generateUidIdentifierBasedOnNode(left);
      path.get("left").replaceWith(t.variableDeclaration("let", [t.variableDeclarator(t.cloneNode(newLoopId))]));
      scope.registerDeclaration(path.get("left"));
      if (didTransformExport) {
        bodyPath.unshiftContainer("body", t.expressionStatement(t.assignmentExpression("=", left, newLoopId)));
      }
      if (importConstViolationName) {
        bodyPath.unshiftContainer("body", t.expressionStatement(buildImportThrow(importConstViolationName)));
      }
    }
  }
};