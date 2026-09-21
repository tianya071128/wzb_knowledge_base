import { declarePreset } from "@babel/helper-plugin-utils";
import transformReactJSX from "@babel/plugin-transform-react-jsx";
import transformReactJSXDevelopment from "@babel/plugin-transform-react-jsx-development";
import transformReactDisplayName from "@babel/plugin-transform-react-display-name";
import transformReactPure from "@babel/plugin-transform-react-pure-annotations";
import normalizeOptions from "./normalize-options.js";
export default declarePreset((api, opts) => {
  api.assertVersion("8.0.6");
  const {
    development = api.env(env => env === "development"),
    developmentSourceSelf,
    importSource,
    pragma,
    pragmaFrag,
    pure,
    runtime,
    throwIfNamespace
  } = normalizeOptions(opts);
  const pluginOptios = {
    importSource,
    pragma,
    pragmaFrag,
    runtime,
    throwIfNamespace,
    pure
  };
  return {
    plugins: [development ? [transformReactJSXDevelopment, {
      ...pluginOptios,
      sourceSelf: developmentSourceSelf
    }] : [transformReactJSX, pluginOptios], transformReactDisplayName, pure !== false && transformReactPure].filter(Boolean)
  };
});