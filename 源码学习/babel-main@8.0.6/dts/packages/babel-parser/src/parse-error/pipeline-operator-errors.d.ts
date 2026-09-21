export declare const UnparenthesizedPipeBodyDescriptions: Set<"AssignmentExpression" | "ArrowFunctionExpression" | "ConditionalExpression" | "YieldExpression">;
type GetSetMemberType<T extends Set<any>> = T extends Set<infer M> ? M : unknown;
export type UnparenthesizedPipeBodyTypes = GetSetMemberType<typeof UnparenthesizedPipeBodyDescriptions>;
declare const _default: {
    PipeTopicRequiresHackPipes: string;
    PipeTopicUnbound: string;
    PipeTopicUnconfiguredToken: ({ token }: {
        token: string;
    }) => string;
    PipeTopicUnused: string;
    PipeUnparenthesizedBody: ({ type }: {
        type: UnparenthesizedPipeBodyTypes;
    }) => string;
    PipelineUnparenthesized: string;
};
export default _default;
//# sourceMappingURL=pipeline-operator-errors.d.ts.map