// Pick 的作用是将某个类型中的子属性挑出来，变成包含这个类型部分属性的子类型。
// 如何定义一个 ConditionalPick 工具类型，支持根据指定的 Condition 条件来生成新的类型，对应的使用示例如下：

interface Example {
  a: string;
  b: string | number;
  c: () => void;
  d: {};
}

// 测试用例：
type StringKeysOnly = ConditionalPick<Example, string>;
//=> {a: string}

// #region ------------ 个人实现 ------------
type ConditionalPick<T, K extends Example[keyof Example]> = {
  [P in keyof T as T[P] extends K ? P : never]: T[P];
};
// #endregion

// #region ------------ github 实现 ------------
// 上面的实现版本存在问题: Typescript 当中, Function extends object为 true(Function 是 object/Record的子类型)
// 也就是如果将测试用例更改为提取object类型而不是'string'等类型的话, 这个时候 Function 类型也会被并入

type ConditionalPick2<T extends object, U extends T[keyof T]> = {
  [K in keyof T as T[K] extends U
    ? U extends object
      ? U extends Function
        ? K
        : T[K] extends Function
        ? never
        : K
      : K
    : never]: T[K];
};
// #endregion

export {};
