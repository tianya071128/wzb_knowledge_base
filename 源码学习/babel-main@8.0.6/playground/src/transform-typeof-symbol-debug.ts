import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import typeofSymbolPlugin from "@babel/plugin-transform-typeof-symbol";

// 测试「typeof 对 Symbol 的降级」（ES5 引擎里 typeof symbol 会抛错，
// 旧引擎遇到 Symbol 值的 typeof 直接 TypeError，需换成 helper 判断）。
// 四个场景（对照源码）：
// 1) 已声明变量：typeof s -> babelHelpers.typeof(s)（直接换 helper 调用）
// 2) 未声明变量：typeof o -> 条件表达式包裹
//    （typeof o === "undefined" ? "undefined" : _typeof(o)，
//     保住"未声明的 typeof 不抛错"这个旧语义）
// 3) 用户自己声明了 Symbol（遮蔽全局）：Scope visitor 把它改名为 _Symbol，
//    避免与 helper 内部引用的全局 Symbol 混淆
// 4) 优化豁免：typeof s === "string" —— 另一侧字面量不是 "symbol"/"object"，
//    可以断定与 Symbol 无关，不转换
const code = `
// 1) 已声明
var s = Symbol("s");
typeof s;

// 2) 未声明
typeof o;

// 3) 遮蔽全局 Symbol
var Symbol = foo();
foo(Symbol);

// 4) 优化豁免：与字面量比较且不是 "symbol"/"object"
typeof s === "string";

// 嵌套：连续两个 typeof
typeof typeof s.foo;
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [typeofSymbolPlugin as any],
});

console.log("转换结果：");

// function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// // 1) 已声明
// var s = _Symbol("s");
// _typeof(s);

// // 2) 未声明
// typeof o === "undefined" ? "undefined" : _typeof(o);

// // 3) 遮蔽全局 Symbol
// var _Symbol = foo();
// foo(_Symbol);

// // 4) 优化豁免：与字面量比较且不是 "symbol"/"object"
// typeof s === "string";

// // 嵌套：连续两个 typeof
// _typeof(_typeof(s.foo));


console.log(result?.code);
