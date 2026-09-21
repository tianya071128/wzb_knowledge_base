import { declare } from "@babel/helper-plugin-utils";
const PIPELINE_PROPOSALS = ["fsharp", "hack"];
const TOPIC_TOKENS = ["^^", "@@", "^", "%", "#"];
const documentationURL = "https://babeljs.io/docs/en/babel-plugin-proposal-pipeline-operator";
export default declare((api, {
  proposal,
  topicToken
}) => {
  api.assertVersion("8.0.6");
  if (typeof proposal !== "string" || !PIPELINE_PROPOSALS.includes(proposal)) {
    const proposalList = PIPELINE_PROPOSALS.map(p => `"${p}"`).join(", ");
    throw new Error(`The pipeline plugin requires a "proposal" option. "proposal" must be one of: ${proposalList}. See <${documentationURL}>.`);
  }
  if (proposal === "hack" && !TOPIC_TOKENS.includes(topicToken)) {
    const topicTokenList = TOPIC_TOKENS.map(t => `"${t}"`).join(", ");
    throw new Error(`The pipeline plugin in "proposal": "hack" mode also requires a "topicToken" option. "topicToken" must be one of: ${topicTokenList}. See <${documentationURL}>.`);
  }
  return {
    name: "syntax-pipeline-operator",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push(["pipelineOperator", {
        proposal,
        topicToken
      }]);
      opts.generatorOpts.topicToken = topicToken;
    }
  };
});