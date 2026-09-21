export const ParamKind = {
  PARAM: 0,
  PARAM_YIELD: 1,
  PARAM_AWAIT: 2,
  PARAM_RETURN: 4,
  PARAM_IN: 8,
  PARAM_NOT_FSHARP_PIPELINE_DIRECT_BODY: 16
};
export default class ProductionParameterHandler {
  stacks = [];
  enter(flags) {
    this.stacks.push(flags);
  }
  exit() {
    this.stacks.pop();
  }
  currentFlags() {
    return this.stacks[this.stacks.length - 1];
  }
  get hasAwait() {
    return (this.currentFlags() & ParamKind.PARAM_AWAIT) > 0;
  }
  get hasYield() {
    return (this.currentFlags() & ParamKind.PARAM_YIELD) > 0;
  }
  get hasReturn() {
    return (this.currentFlags() & ParamKind.PARAM_RETURN) > 0;
  }
  get hasIn() {
    return (this.currentFlags() & ParamKind.PARAM_IN) > 0;
  }
  get inFSharpPipelineDirectBody() {
    return (this.currentFlags() & ParamKind.PARAM_NOT_FSHARP_PIPELINE_DIRECT_BODY) === 0;
  }
}
export function functionFlags(isAsync, isGenerator) {
  return (isAsync ? ParamKind.PARAM_AWAIT : 0) | (isGenerator ? ParamKind.PARAM_YIELD : 0);
}