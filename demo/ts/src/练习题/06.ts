// 定义一个 NativeFlat 工具类型，支持把数组类型拍平（扁平化）。具体的使用示例如下所示：

type NaiveResult = NaiveFlat<[['a'], ['b', 'c'], ['d']]>; // NaiveResult的结果： "a" | "b" | "c" | "d"

// 继续实现 DeepFlat 工具类型，以支持多维数组类型：

type Deep = [['a'], ['b', 'c'], [['d']], [[[['e']]]]];
type DeepTestResult = DeepFlat2<Deep>; // DeepTestResult: "a" | "b" | "c" | "d" | "e"

// #region ------------ 个人实现 ------------
type NaiveFlat<T extends Array<Array<any>>> = T[number] extends Array<infer P>
  ? P
  : never;

type DeepFlatWrapper<T> = T extends Array<any> ? DeepFlat<T> : T;
type DeepFlat<T extends Array<any>> = DeepFlatWrapper<T[number]>;
// #endregion

// #region ------------ github 实现 ------------
// NaiveFlat 基本相同

// DeepFlat 优化一些
type DeepFlat2<T extends Array<any>> = T[number] extends infer P
  ? P extends any[]
    ? DeepFlat2<P>
    : P
  : never;

// #endregion

export {};
