import presetStage1 from "./preset-stage-1.js";
import { proposalFunctionBind } from "./generated/plugins.js";
export default (_, opts = {}) => {
  const {
    loose = false,
    useBuiltIns = false,
    decoratorsLegacy,
    decoratorsVersion,
    decoratorsBeforeExport,
    pipelineProposal,
    pipelineTopicToken
  } = opts;
  return {
    presets: [[presetStage1, {
      loose,
      useBuiltIns,
      decoratorsLegacy,
      decoratorsVersion,
      decoratorsBeforeExport,
      pipelineProposal,
      pipelineTopicToken
    }]],
    plugins: [proposalFunctionBind]
  };
};