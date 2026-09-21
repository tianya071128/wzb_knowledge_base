import { declare } from "@babel/helper-plugin-utils";
import { isRequired } from "@babel/helper-compilation-targets";
import annotateAsPure from "@babel/helper-annotate-as-pure";
import { types as t } from "@babel/core";
import globalsBrowserUpper from "@babel/helper-globals/data/browser-upper.json" with { type: "json" };
import globalsBuiltinUpper from "@babel/helper-globals/data/builtin-upper.json" with { type: "json" };
import transformClass from "./transformClass.js";
const builtinClasses = new Set([...globalsBrowserUpper, ...globalsBuiltinUpper]);
builtinClasses.delete("Iterator");
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  if ("loose" in options) {
    console.warn("@babel/plugin-transform-classes: The 'loose' option has been deprecated, " + "use the 'setClassMethods', 'constantSuper', 'superIsCallableConstructor', and 'noClassCalls' assumptions instead (https://babeljs.io/assumptions).");
  }
  const {
    loose = false
  } = options;
  const setClassMethods = api.assumption("setClassMethods") ?? loose;
  const constantSuper = api.assumption("constantSuper") ?? loose;
  const superIsCallableConstructor = api.assumption("superIsCallableConstructor") ?? loose;
  const noClassCalls = api.assumption("noClassCalls") ?? loose;
  const supportUnicodeId = !isRequired("transform-unicode-escapes", api.targets());
  const VISITED = new WeakSet();
  return {
    name: "transform-classes",
    visitor: {
      ExportDefaultDeclaration(path) {
        if (!path.get("declaration").isClassDeclaration()) return;
        path.splitExportDeclaration();
      },
      ClassDeclaration(path) {
        const {
          node
        } = path;
        const ref = node.id ? t.cloneNode(node.id) : path.scope.generateUidIdentifier("class");
        path.replaceWith(t.variableDeclaration("let", [t.variableDeclarator(ref, t.toExpression(node))]));
      },
      ClassExpression(path, state) {
        const {
          node
        } = path;
        if (VISITED.has(node)) return;
        const replacement = path.ensureFunctionName(supportUnicodeId);
        if (replacement && replacement.node !== node) return;
        VISITED.add(node);
        const [replacedPath] = path.replaceWith(transformClass(path, state.file, builtinClasses, loose, {
          setClassMethods,
          constantSuper,
          superIsCallableConstructor,
          noClassCalls
        }, supportUnicodeId));
        if (replacedPath.isCallExpression()) {
          annotateAsPure(replacedPath);
          const callee = replacedPath.get("callee");
          if (callee.isArrowFunctionExpression()) {
            callee.arrowFunctionToExpression();
          }
        }
      }
    }
  };
});