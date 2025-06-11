// 实现一个 Push 工具类型，用于把指定类型 E 作为第最后一个元素添加到 T 数组类型中。具体的使用示例如下所示：

// 测试用例
type Arr0 = Push<[], 1>; // [1]
type Arr1 = Push<[1, 2, 3], 4>; // [1, 2, 3, 4]
type Arr2 = Push<[string, number], 4>; // [string, number, 4]
type Arr3 = Push<string[], 4>; // [...string[], 4]

// #region ------------ 个人实现 ------------
type Push<T extends any[], U> = [...T, U];
type Push2<T extends any[], V> = T extends [...infer U] ? [...U, V] : never;
// #endregion

// #region ------------ github 实现 ------------
// 差不多
// #endregion

export {};
