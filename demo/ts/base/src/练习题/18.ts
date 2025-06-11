// 实现一个 UnionToIntersection 工具类型，用于把联合类型转换为交叉类型。具体的使用示例如下所示：

// 测试用例
type U0 = UnionToIntersection<string | number>; // never
type U1 = UnionToIntersection<{ name: string } | { age: number }>; // { name: string; } & { age: number; }

// #region ------------ 个人实现 ------------
// 问题关键是如何遍历联合类型
// 没做出来
// #endregion

// #region ------------ github 实现 ------------
// 利用联合类型在 extends 的时自动分发，在利用函数参数类型逆变，从而实现了联合类型到交叉类型的转变。
// ???
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// 原因可见: https://github.com/semlinker/awesome-typescript/issues/37#issuecomment-1092977502
// #endregion
export {};
