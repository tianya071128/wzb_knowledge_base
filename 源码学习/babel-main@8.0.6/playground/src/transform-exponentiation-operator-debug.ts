import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import exponentPlugin from "@babel/plugin-transform-exponentiation-operator";

// 测试「幂运算符降级」（ES2016 语法，旧引擎无 ** 与 **=）。
// 五个场景（对照源码两 visitor + maybeMemoize 三分支）：
// 1) 二元形式：a ** b -> Math.pow(a, b)（直接替换，最简单）
// 2) 标识符赋值：num **= 2 -> num = Math.pow(num, 2)（左侧无副作用，直通）
// 3) 成员赋值（对象非静态）：reader.x **= 2 ->
//    var _reader; (_reader = reader).x = Math.pow(_reader.x, 2)
//    （对象只求值一次：scope.push 提升临时变量声明到作用域顶部）
// 4) 成员赋值（对象+键都非静态）：obj[key()] **= 2 -> 双临时变量
// 5) 函数参数默认值里的 **=（参数是 Pattern，不能注入临时变量）->
//    包 IIFE：(_ref => ...)()
const code = `
// 1) 二元
var r = 2 ** 3;

// 2) 标识符赋值
var num = 4;
num **= 2;

// 3) 成员赋值（对象带副作用风险，需 memoize）
// 对象带副作用风险取值可能会触发 getter，多次取值结果可能不同，需 memoize
reader.x **= 2;

// 4) 对象与键都需要 memoize
obj[key()] **= 2;

// 5) 参数位置：无法注入临时变量 -> IIFE
function fn(a, b = a.b.c **= 2) {
  return b;
}
`;

// var _reader, _obj, _key;
// // 1) 二元
// var r = Math.pow(2, 3);

// // 2) 标识符赋值
// var num = 4;
// num = Math.pow(num, 2);

// // 3) 成员赋值（对象带副作用风险，需 memoize）
// (_reader = reader).x = Math.pow(_reader.x, 2);

// // 4) 对象与键都需要 memoize
// (_obj = obj)[_key = key()] = Math.pow(_obj[_key], 2);

// // 5) 参数位置：无法注入临时变量 -> IIFE
// function fn(a, b = (_a$b => (_a$b = a.b).c = Math.pow(_a$b.c, 2))()) {
//   return b;
// }

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [exponentPlugin as any],
});

console.log("转换结果：");
console.log(result?.code);
