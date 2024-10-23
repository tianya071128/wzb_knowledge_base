// 实现一个 Head 工具类型，用于获取数组类型的第一个类型。具体的使用示例如下所示：
type H0 = Head<[]>; // never
type H1 = Head<[1]>; // 1
type H2 = Head<[3, 2]>; // 3
type H3 = Head<['a', 'b', 'c']>; // "a"
type H4 = Head<[undefined, 'b', 'c']>; // undefined
type H5 = Head<[null, 'b', 'c']>; // null
type H6 = Head<string[]>; // string

// #region ------------ 个人实现 ------------
// 对于 H6，不通过
// type Head<T extends any[]> = T extends [infer K, ...any[]] ? K : never;
// #endregion

// #region ------------ github 实现 ------------
// 更好的
// type Head<T extends Array<any>> = T extends [] ? never : T[0];
// 其他
// type Head<T extends any[]> = T['length'] extends 0 ? never : T[0];
type Head<T extends Array<any>> = T[0] extends undefined ? never : T[0]; // H4 无法通过
// #endregion
