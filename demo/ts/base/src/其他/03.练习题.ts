/**
 * 练习网站中的题目: https://typescriptonline.com/zh/qa
 */

export {};

// #region ------------ 1.实现 ReturnType<T> 泛型 ------------
{
  // 题目: 不使用 ReturnType 实现 TypeScript 的 ReturnType<T> 泛型。
  // 示例
  type a = MyReturnType<() => '1' | '2'>; // 应推导出 "1 | 2"

  /**
   * 实现: 基于条件类型
   */
  type MyReturnType<T> = T extends (...args: any) => infer params
    ? params
    : never;
}
// #endregion

// #region ------------ 2.实现 Omit<T, K> 泛型 ------------
{
  /**
   * 题目: 不使用 Omit 实现 TypeScript 的 Omit<T, K> 泛型。
   *       Omit 会创建一个省略 K 中字段的 T 对象。
   */

  // 示例
  interface Todo {
    title: string;
    description: string;
    completed: boolean;
  }
  type TodoPreview = MyOmit<Todo, 'description' | 'title'>;

  /**
   * 实现: 映射类型加上重映射
   */
  type MyOmit<T, K extends keyof T> = {
    [prop in keyof T as prop extends K ? never : prop]: T[prop];
  };
}
// #endregion

// #region ------------ 3.实现 Pick<T, K> 泛型 ------------
{
  /**
   * 题目: 不使用 Pick<T, K> ，实现 TS 内置的 Pick<T, K> 的功能。
   *       从类型 T 中选出符合 K 的属性，构造一个新的类型。
   */

  // 示例
  interface Todo {
    title: string;
    description: string;
    completed: boolean;
  }
  type TodoPreview = MyPick<Todo, 'title' | 'completed'>;

  /**
   * 实现: 映射类型加上重映射
   */
  type MyPick<T, K extends keyof T> = {
    [Prop in keyof T as Prop extends K ? Prop : never]: T[Prop];
  };
}
// #endregion

// #region ------------ 4.实现 Readonly<T, K> 泛型 ------------
{
  /**
   * 题目:
   *  不要使用内置的Readonly<T>，自己实现一个。
   *  泛型 Readonly<T> 会接收一个 泛型参数，并返回一个完全一样的类型，只是所有属性都会是只读 (readonly) 的。
   *  也就是不可以再对该对象的属性赋值。
   */

  // 示例
  interface Todo {
    title: string;
    description: string;
  }
  type TodoPreview = MyReadonly<Todo>;

  /**
   * 实现: 映射类型 和 readonly 修饰符
   */
  type MyReadonly<T extends object> = {
    readonly [P in keyof T]: T[P];
  };
}
// #endregion

// #region ------------ 5.实现一个泛型MyReadonly2<T, K> ------------
{
  /**
   * 题目:
   *  实现一个泛型MyReadonly2<T, K>，它带有两种类型的参数T和K。
   *  类型 K 指定 T 中要被设置为只读 (readonly) 的属性。如果未提供K，则应使所有属性都变为只读，就像普通的Readonly<T>一样。
   */

  // 示例
  interface Todo {
    readonly title: string;
    description?: string;
    completed: boolean;
  }
  type Simplify<T extends object> = {
    [P in keyof T]: T[P];
  };
  type TodoPreview = Omit<Todo, 'description'>;

  /**
   * 实现
   */
  type MyReadonly2<T, K extends keyof T = keyof T> = {
    readonly [P in K]: T[P];
  } & {
    [P in keyof T as P extends K ? never : P]: T[P];
  };
}
// #endregion

// #region ------------ 6.泛型 DeepReadonly<T> ------------
{
  /**
   * 题目:
   *  实现一个泛型 DeepReadonly<T>，它将对象的每个参数及其子对象递归地设为只读。
   *  您可以假设在此挑战中我们仅处理对象。不考虑数组、函数、类等。但是，您仍然可以通过覆盖尽可能多的不同案例来挑战自己。
   */

  // 示例
  type X = {
    x: {
      a: () => void;
      b: 'hi';
    };
    y: 'hey';
  };
  type Todo = DeepReadonly<X>;

  /**
   * 实现: 类型的递归处理, 注意终止条件
   */
  type DeepReadonly<T> = T extends (...args: any) => any // 函数时, 直接返回
    ? T
    : T extends object
    ? {
        readonly [P in keyof T]: DeepReadonly<T[P]>;
      }
    : T;
}
// #endregion

// #region ------------ 7.泛型TupleToUnion<T> ------------
{
  /**
   * 题目: 实现泛型TupleToUnion<T>，它返回元组所有值的合集。
   */

  // 示例
  type Arr = ['1', '2', '3'];

  type Test = TupleToUnion<Arr>;

  /**
   * 实现
   *  1. 使用条件类型
   *  2. 或者 type TupleToUnion<T extends readonly any[]> = T[number]  --> 使用索引访问类型
   */
  type TupleToUnion<T> = T extends Array<infer P> ? P : never;
}
// #endregion

// #region ------------ 8.元组类型转换为对象类型 ------------
{
  /**
   * 题目: 将一个元组类型转换为对象类型，这个对象类型的键/值和元组中的元素对应。
   */

  // 示例
  const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const;
  type result = TupleToObject<typeof tuple>;

  /**
   * 实现:
   */
  type TupleToObject<T extends readonly (keyof any)[]> = {
    [P in T[number]]: P;
  };
}
// #endregion

// #region ------------ 9.可串联 ------------

/**
 * 题目:
 *  在 JavaScript 中我们经常会使用可串联（Chainable/Pipeline）的函数构造一个对象，但在 TypeScript 中，你能合理的给它赋上类型吗？
 *  在这个挑战中，你可以使用任意你喜欢的方式实现这个类型 - Interface, Type 或 Class 都行。你需要提供两个函数 option(key, value) 和 get()。
 *  在 option 中你需要使用提供的 key 和 value 扩展当前的对象类型，通过 get 获取最终结果。
 *  同样的 key 只会被使用一次。
 */

// 示例
declare const config: Chainable;

const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  // @ts-expect-error
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get();

const result3 = config
  .option('name', 'another name')
  // @ts-expect-error
  .option('name', 123)
  .get();

// 期望 result 的类型是：
interface Result {
  foo: number;
  name: string;
  bar: {
    value: string;
  };
}

/**
 * 实现:
 *  - 关键点在于 "同样的 key 只会被使用一次。"
 *  - 所以在参数 key: K extends keyof T ? never : K 中处理一下
 */
type Chainable<T extends object = {}> = {
  option<K extends string, V extends any>(
    key: K extends keyof T ? never : K,
    value: V
  ): Chainable<Omit<T, K> & { [P in K]: V }>;
  get(): { [P in keyof T]: T[P] };
};
// #endregion

// #region ------------ 10.First<T>泛型 ------------
{
  /**
   * 题目: 实现一个First<T>泛型，它接受一个数组T并返回它的第一个元素的类型。
   */

  // 示例
  type arr1 = number[];
  type head1 = First<arr1>;

  /**
   * 实现: 索引访问
   */
  type First<T extends any[]> = T extends [] ? never : T[0];
}

// #endregion

// #region ------------ 11.Last<T>泛型 ------------
{
  /**
   * 题目: 实现一个Last<T>泛型，它接受一个数组T并返回其最后一个元素的类型。
   */

  // 示例
  type arr1 = ['a', 'b', 'c'];
  type tail1 = Last<arr1>;

  /**
   * 索引类型
   */
  type Last<T extends any[]> = T extends [...any[], infer P] ? P : never;
}
// #endregion

// #region ------------ 12.泛型Pop<T> ------------
{
  /**
   * 题目: 实现一个泛型Pop<T>，它接受一个数组T，并返回一个由数组T的前 N-1 项（N 为数组T的长度）以相同的顺序组成的数组。
   */

  // 示例
  type arr1 = ['a', 'b', 'c', 'd'];
  type re1 = Pop<arr1>;
  type re2 = Push<[], 2>;

  /**
   * 实现
   */
  type Pop<T extends any[]> = T extends [...infer List, infer P] ? List : [];
  type Push<T extends any[], V> = [...T, V];
}
// #endregion

// #region ------------ 13.柯里化 ------------
{
  /**
   * 题目:
   *  柯里化 是一种将带有多个参数的函数转换为每个带有一个参数的函数序列的技术。
   *  传递给 Currying 的函数可能有多个参数，您需要正确输入它的类型。
   *  在此挑战中，柯里化后的函数每次仅接受一个参数。接受完所有参数后，它应返回其结果。
   */

  // 示例
  const add = (a: number, b: number) => 2;
  const three = add(1, 2);

  const curriedAdd = Currying(add);
  const five = curriedAdd(2)(3);

  const curried1 = Currying((a: number, b: number) => true);

  const a = (a: string, b: number, c: boolean) => true;
  type test = unknown extends 1 ? true : false;
}

/**
 * 实现
 */
type CurryingReturn<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => infer R
  ? P extends []
    ? () => R
    : P extends [infer F, ...infer L]
    ? (p: F) => L extends [] ? R : CurryingReturn<(...args: L) => R> // 当存在多个参数(L extends [])时, 返回重组后函数, 不存在时, 调用之后直接返回结果
    : never
  : never;

declare function Currying<T>(
  fn: T
): T extends (...args: any[]) => any ? CurryingReturn<T> : never;
// #endregion

// #region ------------ 14.Length 泛型 ------------
{
  /**
   * 题目: Length泛型，这个泛型接受一个只读的元组，返回这个元组的长度。
   */

  // 示例
  const tesla = ['tesla', 'model 3', 'model X', 'model Y'] as const;
  type teslaLength = Length<[string, number]>;

  /**
   * 实现: 元祖类型, 可通过索引访问 'length' 获取长度
   */
  type Length<T extends readonly [...any[]]> = T['length'];
}
// #endregion

// #region ------------ 15. ------------
{
  /**
   * 题目: 给函数PromiseAll指定类型，它接受元素为 Promise 或者类似 Promise 的对象的数组，返回值应为Promise<T>，其中T是这些 Promise 的结果组成的数组。
   */

  // 示例
  const promise1 = Promise.resolve(3);
  const promise2 = 42;
  const promise3 = new Promise<string>((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
  });
  // const all = [promise1, promise2, promise3] as const;

  // 应推导出 `Promise<[number, 42, string]>`
  const p = PromiseAll([promise1, promise2, promise3] as const);
  const p2 = PromiseAll([1, 2, Promise.resolve(3)]);

  // type c = typeof all;
  // type a = b<c>;

  // type aaa = PromiseR<[2]>;
  // type bbb = Awaited<number | Promise<number>>;
}
/**
 * 实现
 */
// type PromiseR<T extends readonly any[]> = T extends [] // 空元祖
//   ? []
//   : T extends readonly [infer P, ...infer L] // 元祖
//   ? [Awaited<P>, ...PromiseR<L>]
//   : Awaited<T[number]>[];

// declare function PromiseAll<T extends readonly any[]>(
//   values: T
// ): Promise<PromiseR<T>>;
declare function PromiseAll<T extends readonly unknown[]>(
  values: T
): Promise<{
  -readonly [P in keyof T]: Awaited<T[P]>;
}>;
// #endregion

// #region ------------ 16.Exclude<T, U> 类型 ------------
{
  /**
   * 题目:
   *  实现内置的 Exclude<T, U> 类型，但不能直接使用它本身。
   *  从联合类型 T 中排除 U 中的类型，来构造一个新的类型。
   */

  // 示例
  type Result = MyExclude<'a' | 'b' | 'c', 'a'>;

  /**
   * 实现:
   *  1. 条件类型
   *  2. 分布式条件类型: 当条件作用于泛型类型, 它们在给定联合类型时变得可分配。将应用于该联合的每个成员
   */
  type MyExclude<T, U> = T extends U ? never : T;
}

// #endregion

// #region ------------ 17.UnionToIntersection<U> 类型 ------------
// {
//   /**
//    * 题目:
//    *  实现高级工具类型 UnionToIntersection<U>
//    *  联合类型变成交叉类型
//    */

//   // 示例
//   type I = UnionToIntersection<'foo' | 42 | true>;

//   /**
//    * 实现: 例如函数函数的特性, 会将联合类型 转化为 交叉类型   -->  ts 的 逆变特性
//    */
//   type UnionToIntersection<U> = any;
// }

// #endregion

// #region ------------ 18.GetRequired<T> 类型 ------------
{
  /**
   * 题目: 实现高级工具类型 GetRequired<T>，该类型保留所有必需的属性
   */

  // 示例
  type I = GetRequired<{
    foo: number;
    bar?: string;
    bar2?: undefined;
    // bar3: never;
  }>;

  /**
   * 实现:
   *  关键点在于: {[P in keyof T]: null} 先将属性值都置为 null, 排除属性值为 undefined 的情况
   */
  type GetRequired<T extends object> = {
    [P in keyof T as undefined extends { [P in keyof T]: null }[P]
      ? never
      : P]: T[P];
  };
}

// #endregion

// #region ------------ 19.GetOptional<T> 类型 ------------
{
  /**
   * 题目:
   *  实现高级工具类型 GetOptional<T>，该类型保留所有可选属性
   */

  // 示例
  type I = GetOptional<{ foo: number; foo2: undefined; bar?: string }>; //  { bar?: string }

  /**
   * 实现: 将属性值重置为 null, 排除属性值为 undefined 的情况
   */
  type GetOptional<T> = {
    [P in keyof T as undefined extends { [P in keyof T]: null }[P]
      ? P
      : never]: T[P];
  };
}
// #endregion

// #region ------------ 20.在联合类型中查找类型 ------------
{
  /**
   * 题目: 在联合类型Cat | Dog中通过指定公共属性type的值来获取相应的类型。
   */

  // 示例
  interface Cat {
    type: 'cat';
    breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal';
  }

  interface Dog {
    type: 'dog';
    breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer';
    color: 'brown' | 'white' | 'black';
  }

  type MyDog = LookUp<Cat | Dog, 'dog'>; // expected to be `Dog`

  /**
   * 实现: 利用 --> 当条件类型作用于泛型类型时，它们在给定联合类型时变得可分配
   */
  type LookUp<U, T> = U extends { type: T } ? U : never;
}

// #endregion

// #region ------------ 21.RequiredKeys<T> ------------
{
  /**
   * 题目: 实现高级工具类型 RequiredKeys<T>，该类型返回 T 中所有必需属性的键组成的一个联合类型。
   */

  // 示例
  type Result = RequiredKeys<{ foo: number; bar?: string }>; // expected to be “foo”

  /**
   * 实现
   */
  type RequiredKeys<T> = keyof {
    [P in keyof T as undefined extends { [P in keyof T]: null }[P]
      ? never
      : P]: T[P];
  };
}

// #endregion

// #region ------------ 22.TrimLeft<T> ------------
{
  /**
   * 题目: 实现 TrimLeft<T> ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串开头的空白字符串。
   */

  // 示例
  type trimed = TrimLeft<'  Hello World  '>;

  /**
   * 实现: 使用条件类型在类型中推断类型出来, 并且递归执行
   */
  type TrimLeft<S extends string> = S extends ` ${infer T}`
    ? TrimLeft<T>
    : S extends `\n${infer T}`
    ? TrimLeft<T>
    : S extends `\t${infer T}`
    ? TrimLeft<T>
    : S;
}

// #endregion

// #region ------------ 23.Trim<T> ------------
{
  /**
   * 题目: 实现 TrimLeft<T> ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串开头的空白字符串。
   */

  // 示例
  type trimed = Trim<'  Hello World '>;

  /**
   * 实现: 使用条件类型在类型中推断类型出来, 并且递归执行
   */
  type Sign = ' ' | '\n' | '\t';
  type Trim<S extends string> = S extends `${Sign}${infer T}`
    ? Trim<T>
    : S extends `${infer T}${Sign}`
    ? Trim<T>
    : S;
}

// #endregion

// #region ------------ 24.Capitalize<T> ------------
{
  /**
   * 题目: 实现 Capitalize<T> 它将字符串的第一个字母转换为大写，其余字母保持原样。
   */

  // 示例
  type capitalized = MyCapitalize<''>; // expected to be 'Hello world'

  /**
   * 实现
   *  1. 提取出第一个字母
   *  2. 将第一个字母转为大写
   */
  // 小写字母到大写字母的映射
  interface CapitalizeMap {
    a: 'A';
    b: 'B';
    c: 'C';
    d: 'D';
    e: 'E';
    f: 'F';
    g: 'G';
    h: 'H';
    i: 'I';
    j: 'J';
    k: 'K';
    l: 'L';
    m: 'M';
    n: 'N';
    o: 'O';
    p: 'P';
    q: 'Q';
    r: 'R';
    s: 'S';
    t: 'T';
    u: 'U';
    v: 'V';
    w: 'W';
    x: 'X';
    y: 'Y';
    z: 'Z';
  }
  type SingleCapitalize<S extends string> = S extends keyof CapitalizeMap
    ? CapitalizeMap[S]
    : S;
  type MyCapitalize<S extends string> = S extends `${infer P}${infer O}`
    ? `${SingleCapitalize<P>}${O}`
    : S;
}

// #endregion

// #region ------------ 25. CapitalizeWords<T> ------------
{
  /**
   * 题目: 实现CapitalizeWords<T>，它将字符串的每个单词的第一个字母转换为大写，其余部分保持原样。
   */

  // 示例:
  type capitalized = CapitalizeWords<'foo bar.hello,world'>; // 预期为 'Hello World, My Friends'

  /**
   * 实现
   */
  type IsLetter =
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z'
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z';
  type CapitalizeWords<
    S extends string,
    F extends boolean = true
  > = S extends `${infer P}${infer O}`
    ? P extends IsLetter // 是否为字母
      ? F extends true // 是否为首字母
        ? `${Uppercase<P>}${CapitalizeWords<O, false>}` // 是首字母的话, 那么就转换首字母大写 --> 之后的字母当成不是首字母
        : `${P}${CapitalizeWords<O, false>}` // 不是首字母, 继续递归处理其他字符 --> 之后的字母当成不是首字母
      : `${P}${CapitalizeWords<O, true>}` // 不是字母的话, 那么递归处理其他字符
    : S;
}

// #endregion
