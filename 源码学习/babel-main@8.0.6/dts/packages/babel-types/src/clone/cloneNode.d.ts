import type * as t from "../index.ts";
/**
 * Create a clone of a `node` including only properties belonging to the node.
 * If the second parameter is `false`, cloneNode performs a shallow clone.
 * If the third parameter is true, the cloned nodes exclude location properties.
 */
export default function cloneNode<T extends t.Node | undefined | null>(node: T, deep?: boolean, withoutLoc?: boolean): T;
//# sourceMappingURL=cloneNode.d.ts.map