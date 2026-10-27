import { isIdentifier } from "../validators/generated/index.ts";
import { stringLiteral } from "../builders/generated/index.ts";
import type * as t from "../index.ts";

/**
 * 标准化获取对象/类/成员表达式的键，统一转为「计算形式」
 * 如果节点不是 computed 模式、且 key 是 Identifier，就把标识符转为 StringLiteral
 */
export default function toComputedKey(
  node:
    | t.ObjectMember
    | t.ObjectProperty
    | t.ClassMethod
    | t.ClassProperty
    | t.ClassAccessorProperty
    | t.MemberExpression
    | t.OptionalMemberExpression,
  // @ts-expect-error todo(flow->ts): maybe check the type of node before accessing .key and .property
  key: t.Expression | t.PrivateName = node.key || node.property,
) {
  // 唯一的转换分支，三个条件缺一不可：
  //   !node.computed —— 计算键（["x"]() / obj["a"]）的方括号里是"任意表达式"，
  //                     没有唯一等价字面量，必须原样返回；
  //   isIdentifier(key) —— 只有标识符键 a 才等价于字符串 "a"；
  //                        数字键 1、字符串键 "x"、私有名 #p 都不满足，
  //                        原样透传（PrivateName 因此天然跳过转换）。
  if (!node.computed && isIdentifier(key))
    // 转换：标识符转为字符串字面量
    key = stringLiteral(key.name);

  return key;
}
