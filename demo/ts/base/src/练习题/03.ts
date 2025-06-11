// Partial<T>，它的作用是将某个类型里的属性全部变为可选项 ?
// 那么如何定义一个 SetOptional 工具类型，支持把给定的 keys 对应的属性变成可选的？对应的使用示例如下所示：

type Foo = {
  a: number;
  b?: string;
  c: boolean;
};

// 测试用例
type SomeOptional = SetOptional2<Foo, 'a' | 'b'>;

// type SomeOptional = {
// 	a?: number; // 该属性已变成可选的
// 	b?: string; // 保持不变
// 	c: boolean;
// }

// 实现 SetRequired 工具类型，利用它可以把指定的 keys 对应的属性变成必填的
type Foo2 = {
  a?: number;
  b: string;
  c?: boolean;
};

// 测试用例
type SomeRequired = SetRequired2<Foo2, 'b' | 'c'>;
// type SomeRequired = {
// 	a?: number;
// 	b: string; // 保持不变
// 	c: boolean; // 该属性已变成必填
// }

// #region ------------ 个人实现 ------------
// type SetOptional2<T extends object, K extends keyof T> = Simplify<
//   {
//     [P in K]?: T[P];
//   } & {
//     [P in keyof T as P extends K ? never : P]: T[P];
//   }
// >;

// type SetRequired2<T extends object, K extends keyof T> = Simplify<
//   {
//     [P in K]-?: T[P];
//   } & {
//     [P in keyof T as P extends K ? never : P]: T[P];
//   }
// >;
// #endregion

// #region ------------ github 答案 ------------
// 组合使用内置工具类型
type SetOptional2<T extends object, K extends keyof T> = Simplify<
  Partial<Pick<T, K>> & Omit<T, K>
>;
type SetRequired2<T extends object, K extends keyof T> = Simplify<
  Required<Pick<T, K>> & Omit<T, K>
>;
// #endregion

export {};
