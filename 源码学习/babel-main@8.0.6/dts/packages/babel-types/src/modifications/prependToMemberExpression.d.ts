import type * as t from "../index.ts";
/**
 * Prepend a node to a member expression.
 */
export default function prependToMemberExpression<T extends Pick<t.MemberExpression, "object" | "property">>(member: T, prepend: t.MemberExpression["object"]): T;
//# sourceMappingURL=prependToMemberExpression.d.ts.map