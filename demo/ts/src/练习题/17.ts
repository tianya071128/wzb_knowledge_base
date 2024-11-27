import { IsEqual3 } from './11';

// 实现一个 Includes 工具类型，用于判断指定的类型 E 是否包含在 T 数组类型中。具体的使用示例如下所示：

type U0 = Includes<[], 1>; // false
type U1 = Includes<[2, 2, 3, 1], 2>; // true
type U2 = Includes<[2, 3, 3, 1], 1>; // true
type U3 = Includes<[unknown], 1>; // false
type U9 = Includes<[unknown], unknown>; // true
type U4 = Includes<[1, 2], 1 | 2 | 3>; // false
type U5 = Includes<[1, 2], 1 | 2>; // true
type U6 = Includes<[], never>; // false
type U7 = Includes<[never], never>; // true
type U8 = Includes<string[], string>; // true

// #region ------------ 个人实现 ------------
// U3 测试通过不了, any 与 unknown 难以处理
type Includes<T extends any[], U> = T extends []
  ? false
  : [U] extends [T[number]]
  ? true
  : false;

// #endregion

// #region ------------ github 实现 ------------
// 利用 11 题的 IsEqual3，遍历处理
// U3 可以测试通过, 但是 U5 和 U8 都处理不了
type Includes2<T extends Array<any>, E> = T extends [infer A, ...infer B]
  ? IsEqual3<A, E> extends true
    ? true
    : Includes2<B, E>
  : false;

// #endregion

export {};
