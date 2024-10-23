// 实现一个 IsEqual 工具类型，用于比较两个类型是否相等。具体的使用示例如下所示：
type E0 = IsEqual<1, 2>; // false
type E1 = IsEqual<{ a: 1 } | 1, { a: 1 }>; // true
type E2 = IsEqual<{ a: 1 }, { a: 1; b: 2 }>; // false
type E4 = IsEqual<{ a: 1; b: 1 }, { a: 1 }>; // false
type E3 = IsEqual<[1], []>; // false
type E5 = IsEqual<[1], [1]>; // true
type E6 = IsEqual2<{ x: any }, { x: number }>; // false

// 使用 IsEqual 时, 返回 never --> 因为 never extends .. 时, 不会进行处理，此时使用 IsEqual2 时, 使用 [] 包裹即可
type E7 = IsEqual<never, never>; // never

// #region ------------ 个人实现 ------------
type IsEqual<T, U> = T extends U ? (U extends T ? true : false) : false;
// #endregion

// #region ------------ github 实现 ------------
// 严谨版: 考虑联合类型以及never
type IsEqual2<A, B> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : false
  : false;

// 更严谨版2: 还考虑了 any 的问题, 但不是很懂
type IsEqual3<T, U> = (<G>() => G extends T ? 1 : 2) extends <
  G
>() => G extends U ? 1 : 2
  ? true
  : false;

// #endregion
