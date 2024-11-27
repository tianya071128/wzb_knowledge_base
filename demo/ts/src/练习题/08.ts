// 定义 NonEmptyArray 工具类型，用于确保数据非空数组：

const a: NonEmptyArray<string> = []; // 将出现编译错误
const b: NonEmptyArray<string> = ['Hello TS']; // 非空数据，正常使用

// #region ------------ 个人实现 ------------
// 利用元祖
// type NonEmptyArray<T> = [T, ...T[]];

// 利用索引签名
type NonEmptyArray<T> = {
  0: T;
  [k: number]: T;
};
// #endregion

// #region ------------ github 实现 ------------
// 几乎类似实现, 不再赘述

// #endregion

export {};
