// 实现一个 Unshift 工具类型，用于把指定类型 E 作为第一个元素添加到 T 数组类型中。具体的使用示例如下所示：

type Arr0 = Unshift2<[], 1>; // [1]
type Arr1 = Unshift2<[1, 2, 3], 0>; // [0, 1, 2, 3]
type Arr3 = Unshift2<string[], 0>; // [0, ...string[]]

// #region ------------ 个人实现 ------------
type Unshift<T extends any[], U> = T extends [...rest: infer P]
  ? [U, ...P]
  : never;
// #endregion

// #region ------------ github 实现 ------------
type Unshift2<T extends any[], E> = [E, ...T]; // good

// #endregion

export {};
