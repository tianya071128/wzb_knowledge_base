// 定义一个工具类型 AppendArgument，为已有的函数类型增加指定类型的参数，新增的参数名是 x，将作为新函数类型的第一个参数。
// 使用示例如下所示：

type Fn = (a: number, b: string) => number;

type FinalFn = AppendArgument2<Fn, boolean>;
// (x: boolean, a: number, b: string) => number

// #region ------------ 个人实现 ------------
type AppendArgument<
  T extends (...args: any) => any,
  K
> = unknown extends ThisParameterType<T>
  ? (x: K, ...m: Parameters<T>) => ReturnType<T>
  : (this: ThisParameterType<T>, x: K, ...m: Parameters<T>) => ReturnType<T>;
// #endregion

// #region ------------ github 实现 ------------
// 类似, 使用 infer 方式实现
type AppendArgument2<F, T> = F extends (...args: infer Args) => infer Reture
  ? (x: T, ...args: Args) => Reture
  : never;
// #endregion
