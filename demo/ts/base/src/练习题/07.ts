// 使用类型别名定义一个 EmptyObject 类型，使得该类型只允许空对象赋值，测试用例：
const shouldPass: EmptyObject = {}; // 可以正常赋值
const shouldFail: EmptyObject = {
  // 将出现编译错误
  prop: 'TS',
};

// 更改以下 takeSomeTypeOnly 函数的类型定义，让它的参数只允许严格SomeType类型的值
type SomeType = {
  prop: string;
};

// 更改以下函数的类型定义，让它的参数只允许严格SomeType类型的值
function takeSomeTypeOnly(x: SomeType) {
  return x;
}

// 测试用例：
const x = { prop: 'a' };
takeSomeTypeOnly2(x); // 可以正常调用

const y = { prop: 'a', addditionalProp: 'x' };
takeSomeTypeOnly2(y); // 将出现编译错误

// #region ------------ 个人实现 - 借鉴了 github 实现 ------------
type EmptyObject = {
  [P in keyof any]: never;
};

type Exclusive<T, T2 extends T> = {
  [P in keyof T2]: P extends keyof T ? T2[P] : never;
};
function takeSomeTypeOnly2<T extends SomeType>(x: Exclusive<SomeType, T>) {
  return x;
}
// #endregion

export {};
