import type * as t from "../index.ts";
export { getBindingIdentifiers as default };
declare function getBindingIdentifiers(node: t.Node, duplicates: true, outerOnly?: boolean, newBindingsOnly?: boolean): Record<string, t.Identifier[]>;
declare function getBindingIdentifiers(node: t.Node, duplicates?: false, outerOnly?: boolean, newBindingsOnly?: boolean): Record<string, t.Identifier>;
declare function getBindingIdentifiers(node: t.Node, duplicates?: boolean, outerOnly?: boolean, newBindingsOnly?: boolean): Record<string, t.Identifier> | Record<string, t.Identifier[]>;
declare namespace getBindingIdentifiers {
    var keys: KeysMap;
}
/**
 * Mapping of types to their identifier keys.
 */
type KeysMap = {
    [N in t.Node as N["type"]]?: (keyof N)[];
};
//# sourceMappingURL=getBindingIdentifiers.d.ts.map