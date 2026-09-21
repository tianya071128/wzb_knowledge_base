import type * as t from "../index.ts";
declare const _default: {
    (node: t.Node, duplicates: true): Record<string, t.Identifier[]>;
    (node: t.Node, duplicates?: false): Record<string, t.Identifier>;
    (node: t.Node, duplicates?: boolean): Record<string, t.Identifier> | Record<string, t.Identifier[]>;
};
export default _default;
//# sourceMappingURL=getOuterBindingIdentifiers.d.ts.map