import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import functionNamePlugin from "@babel/plugin-transform-function-name";

// 测试「函数名推断」（Function.name 语义补齐）：
// 匿名函数表达式赋给变量/属性后，运行时会有推断名（g.name === "g"），
// 但老引擎没有这个语义，所以插件显式把名字写进函数表达式：
//   var g = function () {};   ->   var g = function g() {};
// 四种形态（对照 test/fixtures/function-name）：
//   1. 基本：赋值目标名写进函数 id
//   2. 冲突：函数体内引用了外层变量名 -> 外层变量被 scope.rename 改成 _i，
//      函数 id 占用原名（和 reserved-words 的 Renamer 机制直接联动）
//   3. 自由变量：函数体引用了一个同名自由变量 h -> 不能简单命名，
//      改用 _h + IIFE + toString 补丁包裹，保住对外层 h 的引用
//   4. 豁免：方法简写 ({ x() {} }) 的 name 语义天然正确，不动
const code = `
// 场景 1：基本命名
var g = function () {
  doSmth();
};

// 场景 2：函数体引用外层同名变量（fixtures/collisions、assignment）
var i = function () {
  i = 5;
};

// 场景 3：自由变量引用（fixtures/object 的 h）
var obj = {
  m: function () {
    doSmth();
  },
  h: function () {
    console.log(h);
  }
};

// 场景 4：方法简写豁免
({ x() {} });
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [functionNamePlugin as any],
});

// // 场景 1：基本命名
// var g = function g() {
//   doSmth();
// };

// // 场景 2：函数体引用外层同名变量（fixtures/collisions、assignment）
// var _i = function i() {
//   _i = 5;
// };

// // 场景 3：自由变量引用（fixtures/object 的 h）
// var obj = {
//   m: function m() {
//     doSmth();
//   },
//   h: function (_h) {
//     function h() {
//       return _h.apply(this, arguments);
//     }
//     h.toString = function () {
//       return _h.toString();
//     };
//     return h;
//   }(function () {
//     console.log(h);
//   })
// };

// // 场景 4：方法简写豁免
// ({
//   x() {}
// });
console.log("转换结果：");
console.log(result?.code);
