import type * as t from "../../index.ts";
/**
 * Takes an array of `types` and flattens them, removing duplicates and
 * returns a `UnionTypeAnnotation` node containing them.
 */
export default function createFlowUnionType<T extends t.FlowType>(types: [T] | T[]): T | t.UnionTypeAnnotation;
//# sourceMappingURL=createFlowUnionType.d.ts.map