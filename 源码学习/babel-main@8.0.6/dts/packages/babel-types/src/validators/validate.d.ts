import { type FieldOptions } from "../definitions/index.ts";
import type * as t from "../index.ts";
export default function validate(node: t.Node | undefined | null, key: string, val: unknown): void;
export declare function validateInternal<T extends t.Node>(field: FieldOptions<T>, node: T, key: string, val: unknown, maybeNode?: 1): void;
export declare function validateField<T extends t.Node>(node: T, key: string, val: unknown, field: FieldOptions<T> | undefined | null): void;
export declare function validateChild(node: t.Node, key: string | {
    toString(): string;
}, val?: unknown): void;
//# sourceMappingURL=validate.d.ts.map