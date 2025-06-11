// 实现一个 Tail 工具类型，用于获取数组类型除了第一个类型外，剩余的类型。具体的使用示例如下所示：

// 测试用例
type U0 = Tail<[]>; // []
type U4 = Tail<[1]>; // []
type U1 = Tail<[1, 2]>; // [2]
type U2 = Tail<[1, 2, 3, 4, 5]>; // [2, 3, 4, 5]
type U3 = Tail<string[]>; // string[]
type U5 = Tail<[1, 2, ...any[]]>; // [2, ...any[]]
type U6 = Tail<[string, number, boolean]>; // [number, boolean]

// #region ------------ 个人实现 ------------
// 需要考虑 []、以及 string[] 等情况
// type Tail<T extends any[]> = T extends [any, ...rest: infer K]
//   ? K
//   : T extends []
//   ? []
//   : T['length'] extends number
//   ? T
//   : never;
// #endregion

// #region ------------ github 实现 ------------
// 这种实现更简洁
type Tail<T extends Array<any>> = ((...t: T) => void) extends (
  h: any,
  ...args: infer R
) => void
  ? R
  : never;
// #endregion

export {};
