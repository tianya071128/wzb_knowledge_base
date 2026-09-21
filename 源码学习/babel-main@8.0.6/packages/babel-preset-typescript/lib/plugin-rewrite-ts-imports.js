import { declare } from "@babel/helper-plugin-utils";
export default declare(function ({
  types: t,
  traverse
}) {
  function maybeReplace(source, path, state) {
    if (!source) return;
    const preserveJsx = false;
    if (t.isStringLiteral(source)) {
      if (/^\.\.?\//.test(source.value)) {
        source.value = source.value.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
        });
      }
      return;
    }
    path.replaceWith(t.callExpression(state.addHelper("tsRewriteRelativeImportExtensions"), preserveJsx ? [source, t.booleanLiteral(true)] : [source]));
  }
  return {
    name: "preset-typescript/plugin-rewrite-ts-imports",
    visitor: traverse.explode({
      "ImportDeclaration|ExportAllDeclaration|ExportNamedDeclaration"(path, state) {
        const node = path.node;
        const kind = t.isImportDeclaration(node) ? node.importKind : node.exportKind;
        if (kind === "value") {
          maybeReplace(node.source, path.get("source"), state);
        }
      },
      ImportExpression(path, state) {
        maybeReplace(path.node.source, path.get("source"), state);
      }
    })
  };
});