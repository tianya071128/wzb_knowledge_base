import presetStage3 from "./preset-stage-3.js";
import * as babelPlugins from "./generated/plugins.js";
export default (_, opts = {}) => {
  const {
    pipelineProposal = "fsharp",
    pipelineTopicToken = "%"
  } = opts;
  return {
    presets: [[presetStage3, opts]],
    plugins: [babelPlugins.proposalDestructuringPrivate, [babelPlugins.proposalPipelineOperator, {
      proposal: pipelineProposal,
      topicToken: pipelineTopicToken
    }], babelPlugins.proposalFunctionSent, babelPlugins.proposalThrowExpressions, babelPlugins.syntaxModuleBlocks, ...[]]
  };
};