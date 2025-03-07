export {};

// 本道题我们希望参数 a 和 b 的类型都是一致的，即 a 和 b 同时为 number 或 string 类型。
// 当它们的类型不一致的值，TS 类型检查器能自动提示对应的错误信息。
function f(a: string | number, b: string | number) {
  if (typeof a === 'string') {
    return a + ':' + b; // no error but b can be number!
  } else {
    return a + b; // error as b can be number | string
  }
}

f(2, 3); // Ok
f(1, 'a'); // Error
f('a', 2); // Error
f('a', 'b'); // Ok

// #region ------------ 个人答案 ------------
function f2<T extends string | number>(a: T, b: T) {
  if (typeof a === 'string') {
    return a + ':' + b; // no error but b can be number!
  } else {
    return a + b; // error as b can be number | string
  }
}

f2(2, 3); // Ok
f2(1, 'a'); // Error
f2('a', 2); // Error
f2('a', 'b'); // Ok
// #endregion

// #region ------------ github 答案 ------------
// 函数重载，但还是需要改动函数才行
function fn3(a: string, b: string): string;
function fn3(a: number, b: number): number;
function fn3(a: string | number, b: string | number) {
  if (typeof a === 'string') {
    return a + ':' + b; // no error but b can be number!
  } else {
    return a + (b as number); // error as b can be number | string
  }
}
// #endregion
