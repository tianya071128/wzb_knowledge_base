import isBabelPluginFactory from "./is-babel-plugin-factory.js";
export default function isFromBabelTypes(origin, scope) {
  if (origin.kind === "import" && origin.source === "@babel/types") {
    return true;
  }
  if (origin.kind === "property" && origin.base.kind === "import" && origin.base.name === "types" && origin.base.source === "@babel/core") {
    return true;
  }
  if (origin.kind === "property" && origin.base.kind === "param" && origin.base.index === 0) {
    return isBabelPluginFactory(origin.base.functionNode, scope);
  }
  return false;
}