/**
 * 类型缩小:
 *  TypeScript 遵循我们的程序可以采用的可能执行路径来分析给定位置的值的最具体的可能类型。
 *  它着眼于这些特殊检查（称为类型保护）和赋值，将类型精炼为比声明的更具体的类型的过程称为缩小。
 */

/** TypeScript 可以理解几种不同的结构来缩小类型。 */

// #region ------------ 1. typeof 类型保护 ------------
function padLeft1(padding: number | string, input: string): string {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + input; // padding: (parameter) padding: number
  }
  return padding + input;
}

// #endregion

// #region ------------ 2. 真值缩小 ------------
// 在 JavaScript 中，像 if 这样的构造首先将它们的条件 “强制转换” 到 boolean 来理解它们，然后根据结果是 true 还是 false 来选择它们的分支。
function printAll(strs: string | null) {
  if (strs) {
    console.log(strs); // (parameter) strs: string
  } else {
    console.log(strs); // (parameter) strs: string | null --> 因为 "" 也相当
  }
}
// #endregion

// #region ------------ 3. 相等性缩小 ------------
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // We can now call any 'string' method on 'x' or 'y'.
    x.toUpperCase(); // (parameter) x: string

    y.toLowerCase(); // (parameter) y: string
  } else {
    console.log(x); // (parameter) x: string | number

    console.log(y); // (parameter) y: string | boolean
  }
}
// #endregion

// #region ------------ 4. in 运算符缩小 ------------
type Fish = { swim: () => void };
type Bird = { fly: () => void };
function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    return animal.swim();
  }

  return animal.fly();
}
// #endregion

// #region ------------ 5. instanceof 缩小 ------------
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString()); // (parameter) x: Date
  } else {
    console.log(x.toUpperCase()); // (parameter) x: string
  }
}
// #endregion

// #region ------------ 6. 赋值 ------------
let x = Math.random() < 0.5 ? 10 : 'hello world!';
x = 1;
console.log(x); // let x: number --> 会查看赋值的右侧并适当地缩小左侧。
x = 'goodbye!';
console.log(x);
// #endregion

// #region ------------ 7. 控制流分析 ------------
// 当分析一个变量时，控制流可以一次又一次地分裂和重新合并，并且可以观察到该变量在每个点具有不同的类型。
// 这种基于可达性的代码分析称为控制流分析，TypeScript 在遇到类型保护和赋值时使用这种流分析来缩小类型。
function example2() {
  let x: string | number | boolean;
  x = Math.random() < 0.5;
  console.log(x); // let x: boolean
  if (Math.random() < 0.5) {
    x = 'hello';
    console.log(x); // let x: string
  } else {
    x = 100;
    console.log(x); // let x: number
  }

  return x; // let x: string | number
}
// #endregion

// #region ------------ 8. 类型谓词 ------------
// 类型谓词（Type Predicates）是一种特殊的函数返回类型，用于在运行时缩小类型范围，帮助 TypeScript 编译器更准确地推断类型
// 谓词采用 parameterName is Type 的形式，其中 parameterName 必须是当前函数签名中的参数名称。
// 可以将函数参数的类型缩小为指定的 Type
function isNumber(value: any): value is number {
  return typeof value === 'number';
}

const values: (number | string)[] = [1, 'hello', 2, 'world'];
const numbers: number[] = values.filter(isNumber); // ✅ 正确推断为 number[]
// #endregion

// #region ------------ 9. 穷举检查 ------------
// 缩小类型时，你可以将联合的选项减少到你已消除所有可能性并且一无所有的程度。在这些情况下，TypeScript 将使用 never 类型来表示不应该存在的状态。
// never 类型可分配给每个类型；但是，没有类型可分配给 never（never 本身除外）。这意味着你可以使用缩小范围并依靠出现的 never 在 switch 语句中进行详尽检查。
interface Circle {
  kind: 'circle';
  radius: number;
}
interface Square {
  kind: 'square';
  sideLength: number;
}
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
// #endregion

export {};
