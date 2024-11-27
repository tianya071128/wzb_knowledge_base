/**
 * 条件类型有助于描述输入和输出类型之间的关系，类似于 JS 的条件表达式(condition ? trueExpression : falseExpression)
 *  语法为：SomeType extends OtherType ? TrueType : FalseType
 *    -> 当 extends 左侧的类型可以分配给右侧的类型时，您将获得第一个分支（“true”分支）中的类型；否则，您将在后一个分支（“false”分支）中获得类型。
 */

/**
 * 条件类型通常与泛型一起使用
 */
{
  interface IdLabel {
    id: number /* some fields */;
  }
  interface NameLabel {
    name: string /* other fields */;
  }

  // 根据输入值不同，来返回不同的类型
  type NameOrId<T extends number | string> = T extends number
    ? IdLabel
    : NameLabel;

  function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
    throw 'unimplemented';
  }
}

/**
 * 判断的类型是一个联合类型，那么条件运算符会展开这个联合类型 -- 类似于一种遍历的效果
 */
type T1 = string | number extends object ? string : number;
// 等同于
type T2 =
  | (string extends object ? string : number)
  | (number extends object ? string : number);

// 如果不希望联合类型被条件运算符展开，可以把extends两侧的操作数都放在方括号里面
type T3 = [string | number] extends [object] ? string : number;

/**
 * 在条件类型中推断：可以使用条件类型应用约束，然后提取类型。
 *
 * infer 关键字：条件类型为我们提供了一种使用 infer 关键字从我们在真实分支中比较的类型进行推断的方法。
 */
{
  // demo1: 获取数组的类型
  type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
  // demo2：获取函数的返回值类型
  type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
    ? Return
    : never;

  // demo3: 从模板字符串中提取类型
  type Str = 'foo-bar';
  type Bar = Str extends `foo-${infer rest}` ? rest : never; // 'bar'
}

// 变成模块化文件
export {};
