import type * as t from "../index.ts";
type GetFunctionNameResult = {
    name: string;
    originalNode: t.Node;
} | null;
export default function getFunctionName(node: t.ObjectMethod | t.ClassMethod): GetFunctionNameResult;
export default function getFunctionName(node: t.Function | t.Class, parent: t.Node): GetFunctionNameResult;
export {};
//# sourceMappingURL=getFunctionName.d.ts.map