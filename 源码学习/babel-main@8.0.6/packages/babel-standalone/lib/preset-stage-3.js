import * as babelPlugins from "./generated/plugins.js";
export default (_, opts = {}) => {
  const {
    decoratorsVersion = "2023-11"
  } = opts;
  const plugins = [[babelPlugins.proposalDecorators, {
    version: decoratorsVersion
  }], babelPlugins.transformExplicitResourceManagement, ...[]];
  return {
    plugins
  };
};