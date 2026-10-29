import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import duplicateKeysPlugin from "@babel/plugin-transform-duplicate-keys";

// 测试「重复键报错降级」（ES5 严格模式/新引擎对重复数据键抛 SyntaxError，
// 本插件把"重复出现"的键改写成计算键 ["a"]，两个目的：
//   1) 绕开引擎/parser 的重复键检查（计算键不在检查范围）；
//   2) 交给后续 computed-properties 插件拆成 obj["a"] = 6 赋值语句，
//      旧引擎里重复赋值合法，保住"后者覆盖"的运行时语义）。
// 查重规则（对照源码三个 seen 表）：
//   data 之后跟 data/get/set      → 重复
//   get  之后跟 data/get          → 重复（get+get 冲突）
//   set  之后跟 data/set          → 重复（set+set 冲突）
//   get+set 相邻                   → 合法的访问器对，不算重复
const code = `
// 1) 基本：data + data
var x = { a: 5, a: 6 };

// 2) 字符串键与标识符键同名（getName 归一化后相等）
var y = { a: 1, "a": 2 };

// 3) 数字键与字符串键：{ 1: ... } 与 { "1": ... }
var z = { 1: 1, "1": 2 };

// 4) getter 之后跟 data
var g = { a: 5, get a() { return 6; } };

// 5) get + get（第二个 get 重复）；get+set 相邻不重复
var h = { get a() {}, get a() {}, set a(x) {} };

// 6) 计算键不参与查重（值不可静态确定）
var k = { a: 1, ["a"]: 2 };

// 7) 展开元素隔断了后续查重？—— plainProps 只收集非展开项，
//    但展开前后的同名键仍会跨展开比较（语义存疑点，实测看结果）
var m = { a: 1, ...o, a: 2 };
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [duplicateKeysPlugin as any],
});

console.log("转换结果：");

// // 1) 基本：data + data
// var x = {
//   a: 5,
//   ["a"]: 6
// };

// // 2) 字符串键与标识符键同名（getName 归一化后相等）
// var y = {
//   a: 1,
//   ["a"]: 2
// };

// // 3) 数字键与字符串键：{ 1: ... } 与 { "1": ... }
// var z = {
//   1: 1,
//   ["1"]: 2
// };

// // 4) getter 之后跟 data
// var g = {
//   a: 5,
//   get ["a"]() {
//     return 6;
//   }
// };

// // 5) get + get（第二个 get 重复）；get+set 相邻不重复
// var h = {
//   get a() {},
//   get ["a"]() {},
//   set a(x) {}
// };

// // 6) 计算键不参与查重（值不可静态确定）
// var k = {
//   a: 1,
//   ["a"]: 2
// };

// // 7) 展开元素隔断了后续查重？—— plainProps 只收集非展开项，
// //    但展开前后的同名键仍会跨展开比较（语义存疑点，实测看结果）
// var m = {
//   a: 1,
//   ...o,
//   ["a"]: 2
// };

console.log(result?.code);
