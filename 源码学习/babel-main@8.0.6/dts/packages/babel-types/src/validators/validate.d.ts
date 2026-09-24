import { type FieldOptions } from "../definitions/index.ts";
import type * as t from "../index.ts";
export default function validate(node: t.Node | undefined | null, key: string, val: unknown): void;
/**
 * 运行时校验
 *  - 值本身是否符合字段的类型约束
 *  - 如果值是子节点，它和父节点之间的结构关系是否合法
 */
export declare function validateInternal<T extends t.Node>(field: FieldOptions<T>, // 该字段的校验配置（含 validate 校验函数、optional 是否可选等）
node: T, // 被校验的节点（如 MemberExpression）
key: string, // 字段名（如 "property"、"body"）
val: unknown, // 字段值（如 Identifier）
maybeNode?: 1): void;
export declare function validateField<T extends t.Node>(node: T, key: string, val: unknown, field: FieldOptions<T> | undefined | null): void;
export declare function validateChild(node: t.Node, key: string | {
    toString(): string;
}, val?: unknown): void;
//# sourceMappingURL=validate.d.ts.map