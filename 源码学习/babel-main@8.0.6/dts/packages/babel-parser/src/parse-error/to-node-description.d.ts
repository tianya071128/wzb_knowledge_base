declare const NodeDescriptions: {
    ArrayPattern: string;
    AssignmentExpression: string;
    AssignmentPattern: string;
    ArrowFunctionExpression: string;
    ConditionalExpression: string;
    CatchClause: string;
    ForOfStatement: string;
    ForInStatement: string;
    ForStatement: string;
    FormalParameters: string;
    Identifier: string;
    ImportSpecifier: string;
    ImportDefaultSpecifier: string;
    ImportNamespaceSpecifier: string;
    ObjectPattern: string;
    ParenthesizedExpression: string;
    RestElement: string;
    UpdateExpression: {
        true: string;
        false: string;
    };
    VariableDeclarator: string;
    YieldExpression: string;
};
type NodeTypesWithDescriptions = keyof Omit<typeof NodeDescriptions, "UpdateExpression">;
type NodeWithDescription = {
    type: "UpdateExpression";
    prefix: boolean;
} | {
    type: NodeTypesWithDescriptions;
};
declare const toNodeDescription: (node: NodeWithDescription) => string;
export default toNodeDescription;
//# sourceMappingURL=to-node-description.d.ts.map