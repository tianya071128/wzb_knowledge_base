import { template, types as t } from "@babel/core";
import { isSideEffectImport } from "@babel/helper-module-transforms";
export const lazyImportsHook = lazy => ({
  name: `${"@babel/plugin-transform-modules-commonjs"}/lazy`,
  version: "8.0.1",
  getWrapperPayload(source, metadata) {
    if (isSideEffectImport(metadata) || metadata.reexportAll) {
      return null;
    }
    if (lazy === true) {
      return source.includes(".") ? null : "lazy/function";
    }
    if (Array.isArray(lazy)) {
      return !lazy.includes(source) ? null : "lazy/function";
    }
    if (typeof lazy === "function") {
      return lazy(source) ? "lazy/function" : null;
    }
    return null;
  },
  buildRequireWrapper(name, init, payload, referenced) {
    if (payload === "lazy/function") {
      if (!referenced) return false;
      return template.statement.ast`
        function ${name}() {
          const data = ${init};
          ${name} = function(){ return data; };
          return data;
        }
      `;
    }
    return null;
  },
  wrapReference(ref, payload) {
    if (payload === "lazy/function") return t.callExpression(ref, []);
    return null;
  }
});