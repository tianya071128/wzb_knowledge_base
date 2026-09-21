import type * as t from "../index.ts";
declare const _skip: unique symbol;
declare const _stop: unique symbol;
/**
 * A prefix AST traversal implementation meant for simple searching and processing.
 * @param enter The callback can return `traverseFast.skip` to skip the subtree of the current node, or `traverseFast.stop` to stop the traversal.
 * @returns `true` if the traversal was stopped by callback, `false` otherwise.
 */
declare function traverseFast<Options = object>(node: t.Node | null | undefined, enter: (node: t.Node, opts?: Options) => void | typeof traverseFast.skip | typeof traverseFast.stop, opts?: Options | null): boolean;
declare namespace traverseFast {
    var skip: typeof _skip;
    var stop: typeof _stop;
}
export default traverseFast;
//# sourceMappingURL=traverseFast.d.ts.map