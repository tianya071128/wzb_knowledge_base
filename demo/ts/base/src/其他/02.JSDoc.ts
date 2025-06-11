// @param: 定义参数类型
// @return: 定义函数返回类型，作用与 @returns 相同

/**
 * 在 ts 语言下, 类型定义无意义 -- JSDoc 类型可能会移到 TypeScript 类型。
 * @param {string} p1 字符串参数
 * @param {string} [p2] 可选参数
 * @param {string} [p3="5"] 具有默认值的可选参数
 * @param p4 复杂类型的定义
 * @param p4.test 复杂类型的属性定义
 * @returns 这是结果
 */
function foo(
  p1: string,
  p2?: string,
  p3 = 5,
  p4?: {
    test: 1;
  }
) {
  return {
    a: 1,
    b: 3,
  };
}

foo('1', '1', 5, {
  test: 1,
});

// #region ------------ 文档相关 ------------

// @deprecated: 当一个函数、方法或属性被弃用时，你可以通过用 /** @deprecated */ JSDoc 注释标记它来让用户知道
/**
 * @deprecated 弃用
 * @param p1 1
 */
function bar(p1: string) {
  //
}

bar('1');

// #endregion
