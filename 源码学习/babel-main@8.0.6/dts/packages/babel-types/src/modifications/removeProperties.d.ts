import type * as t from "../index.ts";
export type Options = {
    preserveComments?: boolean;
};
/**
 * Remove all of the _* properties from a node along with the additional metadata
 * properties like location data and raw token data.
 */
export default function removeProperties(node: t.Node, opts?: Options): void;
//# sourceMappingURL=removeProperties.d.ts.map