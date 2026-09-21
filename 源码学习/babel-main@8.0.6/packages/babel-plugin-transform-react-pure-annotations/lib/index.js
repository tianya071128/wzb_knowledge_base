import { declare } from "@babel/helper-plugin-utils";
import annotateAsPure from "@babel/helper-annotate-as-pure";
import { types as t } from "@babel/core";
const PURE_CALLS = [["react", new Set(["cloneElement", "createContext", "createElement", "createFactory", "createRef", "forwardRef", "isValidElement", "memo", "lazy"])], ["react-dom", new Set(["createPortal"])]];
export default declare(api => {
  api.assertVersion("8.0.6");
  return {
    name: "transform-react-pure-annotations",
    visitor: {
      CallExpression(path) {
        if (isReactCall(path)) {
          annotateAsPure(path);
        }
      }
    }
  };
});
function isReactCall(path) {
  const calleePath = path.get("callee");
  if (!calleePath.isMemberExpression()) {
    for (const [module, methods] of PURE_CALLS) {
      for (const method of methods) {
        if (calleePath.referencesImport(module, method)) {
          return true;
        }
      }
    }
    return false;
  }
  const object = calleePath.get("object");
  const callee = calleePath.node;
  if (!callee.computed && t.isIdentifier(callee.property)) {
    const propertyName = callee.property.name;
    for (const [module, methods] of PURE_CALLS) {
      if (object.referencesImport(module, "default") || object.referencesImport(module, "*")) {
        return methods.has(propertyName);
      }
    }
  }
  return false;
}