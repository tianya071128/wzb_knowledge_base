import { types as t } from "@babel/core";
import { isSideEffectImport } from "./normalize-and-load-metadata.js";
export function toGetWrapperPayload(lazy) {
  return (source, metadata) => {
    if (lazy === false) return null;
    if (isSideEffectImport(metadata) || metadata.reexportAll) return null;
    if (lazy === true) {
      return source.includes(".") ? null : "lazy";
    }
    if (Array.isArray(lazy)) {
      return !lazy.includes(source) ? null : "lazy";
    }
    if (typeof lazy === "function") {
      return lazy(source) ? "lazy" : null;
    }
    throw new Error(`.lazy must be a boolean, string array, or function`);
  };
}
export function wrapReference(ref, payload) {
  if (payload === "lazy") return t.callExpression(ref, []);
  return null;
}