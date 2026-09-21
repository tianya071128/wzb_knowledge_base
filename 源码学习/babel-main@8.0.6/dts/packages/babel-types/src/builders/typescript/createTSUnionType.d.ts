import type * as t from "../../index.ts";
/**
 * Takes an array of `types` and flattens them, removing duplicates and
 * returns a `UnionTypeAnnotation` node containing them.
 */
export default function createTSUnionType(typeAnnotations: (t.TSTypeAnnotation | t.TSType)[]): t.TSType;
//# sourceMappingURL=createTSUnionType.d.ts.map