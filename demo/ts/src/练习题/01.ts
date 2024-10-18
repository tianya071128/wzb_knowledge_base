type User = {
  id: number;
  kind: string;
};

function makeCustomer<T extends User>(u: T): T {
  // Error（TS 编译器版本：v4.4.2）
  // Type '{ id: number; kind: string; }' is not assignable to type 'T'. 类型“｛id:number；kind:string；｝”不能分配给类型“T”。
  // '{ id: number; kind: string; }' is assignable to the constraint of type 'T', “｛id:number；kind:string；｝”可分配给“T”类型的约束，
  // but 'T' could be instantiated with a different subtype of constraint 'User'.但是“T”可以用约束“User”的不同子类型实例化。
  return {
    id: u.id,
    kind: 'customer',
  };
}

// 以上代码为什么会提示错误，应该如何解决上述问题？

// #region ------------ 个人答案 - 回答的不透彻 ------------
/**
 * 因为当使用 extends 限制泛型参数类型时, 表示 T 是 User 的子类, 即 T 可以赋值给 User。
 * 但是反过来， User 是 T 的父类，User 不可以赋值给 T。
 *
 * 例如当 T 的类型为
 * {
 *   id: 5,
 *   kind: 'custome'
 * }
 * 时, T 不可分配给 User 的
 * 可见如下示例
 */
type T1 = {
  id: 5;
  kind: 'custome';
};
const test: T1 = {
  id: 5,
  kind: 'custome',
};

const test2: User = test;
// 不能将类型“User”分配给类型“T1”。
//  属性“id”的类型不兼容。
//    不能将类型“number”分配给类型“5”。
const test3: T1 = test2;

// 解决问题
function makeCustomer2<T extends User>(u: T): T {
  return {
    id: u.id,
    kind: 'customer',
  } as T;
}
// #endregion

// #region ------------ github 答案 ------------
// 报错原因: 因为 T 只是约束了为 User 类型的子类型, 但 T 类型还可以具有其他的属性，因为子类型会包含父类型的属性，但还可以拥有自己的属性

// 解决方法1：修改返回值
function makeCustomer3<T extends User>(u: T): T {
  return {
    ...u,
    id: u.id,
    kind: 'customer',
  };
}
// 解决方法2：修改返回类型， 让其自动推导
function makeCustomer4<T extends User>(u: T) {
  return {
    id: u.id,
    kind: 'customer',
  };
}
// #endregion

export {};
