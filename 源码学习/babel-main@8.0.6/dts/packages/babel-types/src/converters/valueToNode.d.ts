import type * as t from "../index.ts";
declare const _default: {
    (value: undefined): t.Identifier;
    (value: boolean): t.BooleanLiteral;
    (value: null): t.NullLiteral;
    (value: string): t.StringLiteral;
    (value: number): t.NumericLiteral | t.BinaryExpression | t.UnaryExpression;
    (value: bigint): t.BigIntLiteral;
    (value: RegExp): t.RegExpLiteral;
    (value: readonly unknown[]): t.ArrayExpression;
    (value: object): t.ObjectExpression;
    (value: unknown): t.Expression;
};
export default _default;
//# sourceMappingURL=valueToNode.d.ts.map