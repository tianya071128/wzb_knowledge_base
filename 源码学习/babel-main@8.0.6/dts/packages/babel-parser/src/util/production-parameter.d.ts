export declare const enum ParamKind {
    PARAM = 0,
    PARAM_YIELD = 1,
    PARAM_AWAIT = 2,
    PARAM_RETURN = 4,
    PARAM_IN = 8,
    PARAM_NOT_FSHARP_PIPELINE_DIRECT_BODY = 16
}
export default class ProductionParameterHandler {
    stacks: ParamKind[];
    enter(flags: ParamKind): void;
    exit(): void;
    currentFlags(): ParamKind;
    get hasAwait(): boolean;
    get hasYield(): boolean;
    get hasReturn(): boolean;
    get hasIn(): boolean;
    get inFSharpPipelineDirectBody(): boolean;
}
export declare function functionFlags(isAsync: boolean, isGenerator: boolean): ParamKind;
//# sourceMappingURL=production-parameter.d.ts.map