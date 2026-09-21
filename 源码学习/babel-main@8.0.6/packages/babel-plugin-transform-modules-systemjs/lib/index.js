import { declare } from "@babel/helper-plugin-utils";
import { template, types as t } from "@babel/core";
import { buildDynamicImport, getModuleName, rewriteThis } from "@babel/helper-module-transforms";
import { isIdentifierName } from "@babel/helper-validator-identifier";
const buildTemplate = template.statement(`
  SYSTEM_REGISTER(MODULE_NAME, SOURCES, function (EXPORT_IDENTIFIER, CONTEXT_IDENTIFIER) {
    "use strict";
    BEFORE_BODY;
    return {
      setters: SETTERS,
      execute: EXECUTE,
    };
  });
`);
const buildExportAll = template.statement(`
  for (var KEY in TARGET) {
    if (KEY !== "default" && KEY !== "__esModule") EXPORT_OBJ[KEY] = TARGET[KEY];
  }
`);
const MISSING_PLUGIN_ERROR = `\
ERROR: Dynamic import() transformation must be enabled using the
       @babel/plugin-transform-dynamic-import plugin. Babel 8
       no longer transforms import() without using that plugin.
`;
export function getExportSpecifierName(node, stringSpecifiers) {
  if (node.type === "Identifier") {
    return node.name;
  } else if (node.type === "StringLiteral") {
    const stringValue = node.value;
    if (!isIdentifierName(stringValue)) {
      stringSpecifiers.add(stringValue);
    }
    return stringValue;
  } else {
    throw new Error(`Expected export specifier to be either Identifier or StringLiteral, got ${node.type}`);
  }
}
const protoKey = "__proto__";
function constructExportCall(path, exportIdent, exportNames, exportValues, exportStarTarget, stringSpecifiers) {
  const statements = [];
  if (!exportStarTarget) {
    if (exportNames.length === 1) {
      statements.push(t.expressionStatement(t.callExpression(exportIdent, [t.stringLiteral(exportNames[0]), exportValues[0]])));
    } else {
      const objectProperties = [];
      for (let i = 0; i < exportNames.length; i++) {
        const exportName = exportNames[i];
        const computed = exportName === protoKey;
        const exportNameNode = stringSpecifiers.has(exportName) || computed ? t.stringLiteral(exportName) : t.identifier(exportName);
        const exportValue = exportValues[i];
        objectProperties.push(t.objectProperty(exportNameNode, exportValue, computed));
      }
      statements.push(t.expressionStatement(t.callExpression(exportIdent, [t.objectExpression(objectProperties)])));
    }
  } else {
    const exportObj = path.scope.generateUid("exportObj");
    statements.push(t.variableDeclaration("var", [t.variableDeclarator(t.identifier(exportObj), t.objectExpression([t.objectProperty(t.identifier(protoKey), t.nullLiteral())]))]));
    statements.push(buildExportAll({
      KEY: path.scope.generateUidIdentifier("key"),
      EXPORT_OBJ: t.identifier(exportObj),
      TARGET: exportStarTarget
    }));
    for (let i = 0; i < exportNames.length; i++) {
      const exportName = exportNames[i];
      const computed = stringSpecifiers.has(exportName);
      const exportNameNode = computed ? t.stringLiteral(exportName) : t.identifier(exportName);
      const exportValue = exportValues[i];
      statements.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier(exportObj), exportNameNode, computed), exportValue)));
    }
    statements.push(t.expressionStatement(t.callExpression(exportIdent, [t.identifier(exportObj)])));
  }
  return statements;
}
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  const {
    systemGlobal = "System",
    allowTopLevelThis = false
  } = options;
  const reassignmentVisited = new WeakSet();
  return {
    name: "transform-modules-systemjs",
    pre() {
      this.file.set("@babel/plugin-transform-modules-*", "systemjs");
    },
    visitor: api.traverse.explode({
      "CallExpression|ImportExpression"(path, state) {
        if (path.isCallExpression() && !t.isImport(path.node.callee)) return;
        if (path.isCallExpression()) {
          if (!this.file.has("@babel/plugin-proposal-dynamic-import")) {
            throw new Error(MISSING_PLUGIN_ERROR);
          }
        } else {
          if (!this.file.has("@babel/plugin-proposal-dynamic-import")) {
            throw new Error(MISSING_PLUGIN_ERROR);
          }
        }
        path.replaceWith(buildDynamicImport(path.node, false, true, specifier => t.callExpression(t.memberExpression(t.identifier(state.contextIdent), t.identifier("import")), [specifier])));
      },
      MetaProperty(path, state) {
        if (path.node.meta.name === "import" && path.node.property.name === "meta") {
          path.replaceWith(t.memberExpression(t.identifier(state.contextIdent), t.identifier("meta")));
        }
      },
      ReferencedIdentifier(path, state) {
        if (path.node.name === "__moduleName" && !path.scope.hasBinding("__moduleName")) {
          path.replaceWith(t.memberExpression(t.identifier(state.contextIdent), t.identifier("id")));
        }
      },
      Program: {
        enter(path, state) {
          state.contextIdent = path.scope.generateUid("context");
          state.stringSpecifiers = new Set();
          if (!allowTopLevelThis) {
            rewriteThis(path);
          }
        },
        exit(path, state) {
          const scope = path.scope;
          const exportIdent = scope.generateUid("export");
          const {
            contextIdent,
            stringSpecifiers
          } = state;
          const exportMap = Object.create(null);
          const modules = [];
          const beforeBody = [];
          const setters = [];
          const sources = [];
          const variableIds = [];
          const removedPaths = [];
          function addExportName(key, val) {
            exportMap[key] = exportMap[key] || [];
            exportMap[key].push(val);
          }
          function pushModule(source, key, specifiers) {
            let module;
            modules.forEach(function (m) {
              if (m.key === source) {
                module = m;
              }
            });
            if (!module) {
              modules.push(module = {
                key: source,
                imports: [],
                exports: []
              });
            }
            module[key] = module[key].concat(specifiers);
          }
          function buildExportCall(name, val) {
            return t.expressionStatement(t.callExpression(t.identifier(exportIdent), [t.stringLiteral(name), val]));
          }
          const exportNames = [];
          const exportValues = [];
          const body = path.get("body");
          for (const path of body) {
            if (path.isFunctionDeclaration()) {
              beforeBody.push(path.node);
              removedPaths.push(path);
            } else if (path.isClassDeclaration()) {
              variableIds.push(t.cloneNode(path.node.id));
              path.replaceWith(t.expressionStatement(t.assignmentExpression("=", t.cloneNode(path.node.id), t.toExpression(path.node))));
            } else if (path.isVariableDeclaration()) {
              path.node.kind = "var";
            } else if (path.isImportDeclaration()) {
              const source = path.node.source.value;
              pushModule(source, "imports", path.node.specifiers);
              for (const name of Object.keys(path.getBindingIdentifiers())) {
                scope.removeBinding(name);
                variableIds.push(t.identifier(name));
              }
              path.remove();
            } else if (path.isExportAllDeclaration()) {
              pushModule(path.node.source.value, "exports", path.node);
              path.remove();
            } else if (path.isExportDefaultDeclaration()) {
              const declar = path.node.declaration;
              if (t.isClassDeclaration(declar)) {
                const id = declar.id;
                if (id) {
                  exportNames.push("default");
                  exportValues.push(t.buildUndefinedNode());
                  variableIds.push(t.cloneNode(id));
                  addExportName(id.name, "default");
                  path.replaceWith(t.expressionStatement(t.assignmentExpression("=", t.cloneNode(id), t.toExpression(declar))));
                } else {
                  exportNames.push("default");
                  exportValues.push(t.toExpression(declar));
                  removedPaths.push(path);
                }
              } else if (t.isFunctionDeclaration(declar)) {
                const id = declar.id;
                if (id) {
                  beforeBody.push(declar);
                  exportNames.push("default");
                  exportValues.push(t.cloneNode(id));
                  addExportName(id.name, "default");
                } else {
                  exportNames.push("default");
                  exportValues.push(t.toExpression(declar));
                }
                removedPaths.push(path);
              } else {
                path.replaceWith(buildExportCall("default", declar));
              }
            } else if (path.isExportNamedDeclaration()) {
              const declar = path.node.declaration;
              if (declar) {
                path.replaceWith(declar);
                if (t.isFunction(declar)) {
                  const name = declar.id.name;
                  addExportName(name, name);
                  beforeBody.push(declar);
                  exportNames.push(name);
                  exportValues.push(t.cloneNode(declar.id));
                  removedPaths.push(path);
                } else if (t.isClass(declar)) {
                  const name = declar.id.name;
                  exportNames.push(name);
                  exportValues.push(t.buildUndefinedNode());
                  variableIds.push(t.cloneNode(declar.id));
                  path.replaceWith(t.expressionStatement(t.assignmentExpression("=", t.cloneNode(declar.id), t.toExpression(declar))));
                  addExportName(name, name);
                } else {
                  if (t.isVariableDeclaration(declar)) {
                    declar.kind = "var";
                  }
                  for (const name of Object.keys(t.getBindingIdentifiers(declar))) {
                    addExportName(name, name);
                  }
                }
              } else {
                const specifiers = path.node.specifiers;
                if (specifiers?.length) {
                  if (path.node.source) {
                    pushModule(path.node.source.value, "exports", specifiers);
                    path.remove();
                  } else {
                    const nodes = [];
                    for (const specifier of specifiers) {
                      const {
                        local,
                        exported
                      } = specifier;
                      const binding = scope.getBinding(local.name);
                      const exportedName = getExportSpecifierName(exported, stringSpecifiers);
                      if (binding && t.isFunctionDeclaration(binding.path.node)) {
                        exportNames.push(exportedName);
                        exportValues.push(t.cloneNode(local));
                      } else if (!binding) {
                        nodes.push(buildExportCall(exportedName, local));
                      }
                      addExportName(local.name, exportedName);
                    }
                    path.replaceWithMultiple(nodes);
                  }
                } else {
                  path.remove();
                }
              }
            }
          }
          modules.forEach(function (specifiers) {
            const setterBody = [];
            const target = scope.generateUid(specifiers.key);
            for (let specifier of specifiers.imports) {
              if (t.isImportNamespaceSpecifier(specifier)) {
                setterBody.push(t.expressionStatement(t.assignmentExpression("=", specifier.local, t.identifier(target))));
              } else if (t.isImportDefaultSpecifier(specifier)) {
                specifier = t.importSpecifier(specifier.local, t.identifier("default"));
              }
              if (t.isImportSpecifier(specifier)) {
                const {
                  imported
                } = specifier;
                setterBody.push(t.expressionStatement(t.assignmentExpression("=", specifier.local, t.memberExpression(t.identifier(target), specifier.imported, imported.type === "StringLiteral"))));
              }
            }
            if (specifiers.exports.length) {
              const exportNames = [];
              const exportValues = [];
              let hasExportStar = false;
              for (const node of specifiers.exports) {
                if (t.isExportAllDeclaration(node)) {
                  hasExportStar = true;
                } else if (t.isExportSpecifier(node)) {
                  const exportedName = getExportSpecifierName(node.exported, stringSpecifiers);
                  exportNames.push(exportedName);
                  exportValues.push(t.memberExpression(t.identifier(target), node.local, t.isStringLiteral(node.local)));
                } else {}
              }
              setterBody.push(...constructExportCall(path, t.identifier(exportIdent), exportNames, exportValues, hasExportStar ? t.identifier(target) : null, stringSpecifiers));
            }
            sources.push(t.stringLiteral(specifiers.key));
            setters.push(t.functionExpression(null, [t.identifier(target)], t.blockStatement(setterBody)));
          });
          let moduleName = getModuleName(this.file.opts, options);
          if (moduleName) moduleName = t.stringLiteral(moduleName);
          path.scope.hoistVariables((id, hasInit) => {
            variableIds.push(id);
            if (!hasInit && id.name in exportMap) {
              for (const exported of exportMap[id.name]) {
                exportNames.push(exported);
                exportValues.push(t.buildUndefinedNode());
              }
            }
          });
          if (variableIds.length) {
            beforeBody.unshift(t.variableDeclaration("var", variableIds.map(id => t.variableDeclarator(id))));
          }
          if (exportNames.length) {
            beforeBody.push(...constructExportCall(path, t.identifier(exportIdent), exportNames, exportValues, null, stringSpecifiers));
          }
          path.traverse({
            "AssignmentExpression|UpdateExpression"(path) {
              if (reassignmentVisited.has(path.node)) return;
              reassignmentVisited.add(path.node);
              const arg = path.isAssignmentExpression() ? path.get("left") : path.get("argument");
              if (arg.isObjectPattern() || arg.isArrayPattern()) {
                const exprs = [path.node];
                for (const name of Object.keys(arg.getBindingIdentifiers())) {
                  if (this.scope.getBinding(name) !== path.scope.getBinding(name)) {
                    return;
                  }
                  const exportedNames = this.exports[name];
                  if (!exportedNames) continue;
                  for (const exportedName of exportedNames) {
                    exprs.push(this.buildCall(exportedName, t.identifier(name)).expression);
                  }
                }
                path.replaceWith(t.sequenceExpression(exprs));
                return;
              }
              if (!arg.isIdentifier()) return;
              const name = arg.node.name;
              if (this.scope.getBinding(name) !== path.scope.getBinding(name)) return;
              const exportedNames = this.exports[name];
              if (!exportedNames) return;
              let node = path.node;
              const isPostUpdateExpression = t.isUpdateExpression(node, {
                prefix: false
              });
              if (isPostUpdateExpression) {
                node = t.binaryExpression(node.operator[0], t.unaryExpression("+", t.cloneNode(node.argument)), t.numericLiteral(1));
              }
              for (const exportedName of exportedNames) {
                node = this.buildCall(exportedName, node).expression;
              }
              if (isPostUpdateExpression) {
                node = t.sequenceExpression([node, path.node]);
              }
              path.replaceWith(node);
            }
          }, {
            exports: exportMap,
            buildCall: buildExportCall,
            scope
          });
          for (const path of removedPaths) {
            path.remove();
          }
          const hasTLA = t.traverseFast(path.node, node => {
            if (t.isFunction(node)) return t.traverseFast.skip;
            if (t.isAwaitExpression(node)) {
              return t.traverseFast.stop;
            }
          });
          path.node.body = [buildTemplate({
            SYSTEM_REGISTER: t.memberExpression(t.identifier(systemGlobal), t.identifier("register")),
            BEFORE_BODY: beforeBody,
            MODULE_NAME: moduleName,
            SETTERS: t.arrayExpression(setters),
            EXECUTE: t.functionExpression(null, [], t.blockStatement(path.node.body), false, hasTLA),
            SOURCES: t.arrayExpression(sources),
            EXPORT_IDENTIFIER: t.identifier(exportIdent),
            CONTEXT_IDENTIFIER: t.identifier(contextIdent)
          })];
          path.requeue(path.get("body.0"));
        }
      }
    })
  };
});