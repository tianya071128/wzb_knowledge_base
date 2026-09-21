import presetStage2 from "./preset-stage-2.js";
import * as babelPlugins from "./generated/plugins.js";
export default (_, opts = {}) => {
  const {
    loose = false,
    useBuiltIns = false,
    decoratorsVersion,
    pipelineProposal,
    pipelineTopicToken,
    optionalChainingAssignVersion = "2023-07"
  } = opts;
  return {
    presets: [[presetStage2, {
      loose,
      useBuiltIns,
      decoratorsVersion,
      pipelineProposal,
      pipelineTopicToken
    }]],
    plugins: [...[], babelPlugins.proposalExportDefaultFrom, babelPlugins.proposalDoExpressions, [babelPlugins.proposalOptionalChainingAssign, {
      version: optionalChainingAssignVersion
    }]]
  };
};