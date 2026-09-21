import type * as t from "../index.ts";
declare function toKeyAlias(node: t.Method | t.Property, key?: t.Node): string;
declare namespace toKeyAlias {
    var uid: number;
    var increment: () => number;
}
export default toKeyAlias;
//# sourceMappingURL=toKeyAlias.d.ts.map