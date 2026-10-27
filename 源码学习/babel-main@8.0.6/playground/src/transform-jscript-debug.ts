import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import jscriptPlugin from "@babel/plugin-transform-jscript";

// 测试 JScript 命名函数表达式（NFE）bug 修复：
// 老版 IE 的 JScript 引擎里，命名函数表达式有两个怪病：
//   1. 函数名会泄漏到外层作用域（var f = function g(){} 里 g 变成了全局变量）
//   2. 同名变量会覆盖函数名（外层 IdenticalName 会把内部的 g 顶掉）
//   3. 函数的 .name 属性也可能不对
// 插件的解法：把带名字的函数表达式包一层 IIFE，
//   在内层用「函数声明」定义（声明不会被 JScript 泄漏/覆盖），再 return 回来
const code = `
// 场景一：变量名与函数名相同（JScript 里同名变量会顶掉函数名）
var IdenticalName = function IdenticalName(x) {
  return x;
};

// 场景二：匿名赋值的命名函数表达式（函数名会泄漏到外层作用域）
(function foo() {});

// 场景三：具名函数声明不受影响，插件不会动它
function bar() {}
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [jscriptPlugin as any],
});

console.log("转换结果：");
/**
 * var IdenticalName = function () {
 *   function IdenticalName(x) {
 *     return x;
 *   }
 *   return IdenticalName;
 * }();
 * (function () {
 *   function foo() {}
 *   return foo;
 * })();
 * function bar() {}
 */
console.log(result?.code);
