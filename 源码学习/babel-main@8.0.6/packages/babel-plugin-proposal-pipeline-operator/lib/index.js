import { declare } from "@babel/helper-plugin-utils";
import syntaxPipelineOperator from "@babel/plugin-syntax-pipeline-operator";
import hackVisitor from "./hackVisitor.js";
import fsharpVisitor from "./fsharpVisitor.js";
const visitorsPerProposal = {
  hack: hackVisitor,
  fsharp: fsharpVisitor
};
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  return {
    name: "proposal-pipeline-operator",
    inherits: syntaxPipelineOperator,
    visitor: visitorsPerProposal[options.proposal]
  };
});