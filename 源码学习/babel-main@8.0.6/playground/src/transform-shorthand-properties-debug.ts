import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import shorthandPlugin from "@babel/plugin-transform-shorthand-properties";

// 测试「简写属性展开」（ES5 兼容）：
// ES2015 的 { a } 和 { a() {} } 在 ES5 里没有对应语法，必须展开成
// { a: a } 和 { a: function () {} }。
// 两个 visitor 的分工（对照源码）：
//   ObjectMethod  -> 重建为 ObjectProperty(key, FunctionExpression)
//   ObjectProperty-> 只把 shorthand 置 false（key/value 本来就是两个节点）
// 两个 visitor 都有 __proto__ 特判：{ __proto__: x } 会走原型链 setter，
// 必须改写成计算键 ["__proto__"]（字符串键）绕开 setter，保持字面量语义。
// 顺带验证：非简写属性（foo: "bar"）不受影响；行尾注释跟随节点保留。
const code = `
var coords = { x, y, foo: "bar" };

var obj = {
  method() {
    return 5 + 5;
  }
};

var shorthand = {
  __proto__,
};

var method = {
  __proto__() {}
};

var A = "a";
var o = {
  A // comment
};
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [shorthandPlugin as any],
});

console.log("转换结果：");

// var coords = {
//   x: x,
//   y: y,
//   foo: "bar"
// };
// var obj = {
//   method: function () {
//     return 5 + 5;
//   }
// };
// var shorthand = {
//   ["__proto__"]: __proto__
// };
// var method = {
//   ["__proto__"]: function () {}
// };
// var A = "a";
// var o = {
//   A: A // comment
// };

console.log(result?.code);
