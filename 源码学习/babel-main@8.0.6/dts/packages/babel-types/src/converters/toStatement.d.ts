import type * as t from "../index.ts";
declare const _default: {
    (node: t.AssignmentExpression, ignore?: boolean): t.ExpressionStatement;
    <T extends t.Statement>(node: T, ignore: false): T;
    <T extends t.Statement>(node: T, ignore?: boolean): T | false;
    (node: t.Class, ignore: false): t.ClassDeclaration;
    (node: t.Class, ignore?: boolean): t.ClassDeclaration | false;
    (node: t.Function, ignore: false): t.FunctionDeclaration;
    (node: t.Function, ignore?: boolean): t.FunctionDeclaration | false;
    (node: t.Node, ignore: false): t.Statement;
    (node: t.Node, ignore?: boolean): t.Statement | false;
};
export default _default;
//# sourceMappingURL=toStatement.d.ts.map