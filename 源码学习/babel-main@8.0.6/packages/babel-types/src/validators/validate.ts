import {
  NODE_FIELDS,
  NODE_PARENT_VALIDATIONS,
  type FieldOptions,
} from "../definitions/index.ts";
import type * as t from "../index.ts";

export default function validate(
  node: t.Node | undefined | null,
  key: string,
  val: unknown,
): void {
  if (!node) return;

  const fields = NODE_FIELDS[node.type];
  if (!fields) return;

  const field = fields[key];
  validateField(node, key, val, field);
  validateChild(node, key, val);
}

/**
 * 运行时校验
 *  - 值本身是否符合字段的类型约束
 *  - 如果值是子节点，它和父节点之间的结构关系是否合法
 */
export function validateInternal<T extends t.Node>(
  field: FieldOptions<T>, // 该字段的校验配置（含 validate 校验函数、optional 是否可选等）
  node: T, // 被校验的节点（如 MemberExpression）
  key: string, // 字段名（如 "property"、"body"）
  val: unknown, // 字段值（如 Identifier）
  maybeNode?: 1, // 是否可能是一个 AST 子节点
): void {
  if (!field?.validate) return; // ① 字段没有校验器 → 直接跳过
  if (field.optional && val == null) return; // ② 字段可选且值为 null/undefined → 合法，跳过

  field.validate(node, key, val); // ③ 执行字段自身校验（值类型是否符合约束）

  // ④ 仅当 val 可能是子节点时才继续
  if (maybeNode) {
    const type = (val as t.Node).type; // 取出子节点的类型名
    if (type == null) return; // 不是节点（无 type）→ 跳过
    NODE_PARENT_VALIDATIONS[type]?.(node, key, val); // ⑤ 执行父子结构校验
  }
}

export function validateField<T extends t.Node>(
  node: T,
  key: string,
  val: unknown,
  field: FieldOptions<T> | undefined | null,
): void {
  if (!field?.validate) return;
  if (field.optional && val == null) return;

  field.validate(node, key, val);
}

export function validateChild(
  node: t.Node,
  key: string | { toString(): string },
  val?: unknown,
) {
  const type = (val as t.Node)?.type;
  if (type == null) return;
  NODE_PARENT_VALIDATIONS[type]?.(node, key, val);
}
