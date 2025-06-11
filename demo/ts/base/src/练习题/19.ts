import { IsEqual3 } from './11';

// 实现一个 OptionalKeys 工具类型，用来获取对象类型中声明的可选属性。具体的使用示例如下所示：
type Person = {
  id: string;
  name: string;
  age: number;
  from?: string;
  speak?: string;
};

type PersonOptionalKeys = OptionalKeys<Person>; // "from" | "speak"

// #region ------------ 个人实现 ------------
type OptionalKeys<T> = keyof {
  [K in keyof T as undefined extends T[K] ? K : never]: unknown;
};
// 当 strictNullChecks 设置为 false 时, 如何处理呢?
// #endregion

// #region ------------ github 实现 ------------
// 类似
// #endregion

export {};
