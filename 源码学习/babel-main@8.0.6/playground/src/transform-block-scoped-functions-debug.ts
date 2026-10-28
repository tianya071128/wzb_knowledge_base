import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import blockScopedFunctionsPlugin from "@babel/plugin-transform-block-scoped-functions";

// 用例设计（对照源码三条分支）：
// 1) if 块内函数声明 -- 非严格模式 -> var（sloppy 模式 Annex B 语义）
// 2) 严格模式（"use strict"）-> let
// 3) async/generator 函数声明 -> 强制 let（var 无法承载的语义）
// 4) switch case 内函数声明 -> 专门的重建分支（let + cloneNode）
// 5) 循环体内块 -> Loop visitor 手工 traverse 的场景
// 6) 函数体 / export 的块 -> 直接 return 跳过（不转换）
const code = `
// 1) sloppy 模式：if 块
if (x) {
  function f() { return 1; }
  f();
}

// 2) 严格模式：let
function strictFn() {
  "use strict";
  {
    function g() { return 2; }
    g();
  }
}

// 3) async / generator 强制 let
if (y) {
  async function h() { return 3; }
  function* k() { yield 4; }
}

// 4) switch case 内
switch (n) {
  case 1:
    function m() { return 5; }
    m();
    break;
  default:
    break;
}

// 5) 循环体内
for (let i = 0; i < 2; i++) {
  function p() { return i; }
  p();
}
`;

// 注意：transformSync 默认 sourceType: "module"，模块代码天然严格模式，
// 所以上面所有块内函数都会走 let。要观察 sloppy 模式的 var 分支，
// 必须显式 sourceType: "script" —— 两个都跑一遍做对比。
const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  sourceType: "script",
  plugins: [blockScopedFunctionsPlugin as any],
});

console.log(`===== sourceType: script =====`);
// 1) sloppy 模式：if 块
// if (x) {
//   var f = function () {
//     return 1;
//   };
//   f();
// }

// // 2) 严格模式：let
// function strictFn() {
//   "use strict";

//   {
//     let g = function () {
//       return 2;
//     };
//     g();
//   }
// }

// // 3) async / generator 强制 let
// if (y) {
//   let h = async function () {
//     return 3;
//   };
//   let k = function* () {
//     yield 4;
//   };
// }

// // 4) switch case 内
// {
//   let m = function m() {
//     return 5;
//   };
//   switch (n) {
//     case 1:
//       m();
//       break;
//     default:
//       break;
//   }
// } // 5) 循环体内
// for (let i = 0; i < 2; i++) {
//   var p = function () {
//     return i;
//   };
//   p();
// }
console.log(result?.code);



const result2 = transformSync(code, {
  configFile: false,
  babelrc: false,
  sourceType: "module",
  plugins: [blockScopedFunctionsPlugin as any],
});

console.log(`===== sourceType: module =====`);
// 1) sloppy 模式：if 块
// if (x) {
//   let f = function () {
//     return 1;
//   };
//   f();
// }

// // 2) 严格模式：let
// function strictFn() {
//   "use strict";

//   {
//     let g = function () {
//       return 2;
//     };
//     g();
//   }
// }

// // 3) async / generator 强制 let
// if (y) {
//   let h = async function () {
//     return 3;
//   };
//   let k = function* () {
//     yield 4;
//   };
// }

// // 4) switch case 内
// {
//   let m = function m() {
//     return 5;
//   };
//   switch (n) {
//     case 1:
//       m();
//       break;
//     default:
//       break;
//   }
// } // 5) 循环体内
// for (let i = 0; i < 2; i++) {
//   let p = function () {
//     return i;
//   };
//   p();
// }
console.log(result2?.code);