import type * as t from "../index.ts";
/**
 * For the given node, generate a map from assignment id names to the identifier node.
 * Unlike getBindingIdentifiers, this function does not handle declarations and imports.
 * @param node the assignment expression or forXstatement
 * @returns an object map
 * @see getBindingIdentifiers
 */
export default function getAssignmentIdentifiers(node: t.Node | t.Node[]): Record<string, t.Identifier>;
//# sourceMappingURL=getAssignmentIdentifiers.d.ts.map