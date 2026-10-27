import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";

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

export default declare(api => {
  // 版本闸门：Babel 7（含 ^7.0.0-0 预发布）或 Babel 8。
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  return {
    name: "transform-shorthand-properties",

    visitor: {
      // ObjectMethod 节点：对象字面量里的「方法简写」语法。
      //   { foo() {}, async bar() {}, *gen() {}, get x() {}, set x(v) {} }
      // 它和 ObjectProperty 骨架相同（key / value 的对称位置），但相关字段为：
      //   kind        - "method" 普通方法 | "get" | "set" 访问器
      //   params/body - 与方法体同构，可直接搬进 FunctionExpression
      //   generator / async - 对应 `*gen() {}` / `async bar() {}`
      //   computed    - key 是否为计算键，如 { [expr]() {} }
      ObjectMethod(path) {
        const { node } = path;

        // 只处理普通方法。getter/setter（kind: "get"/"set"）不动——
        // ES5 对象字面量本来就有 get/set 语法，无需转换。
        if (node.kind === "method") {
          // 根据当前 Node 节点构造一个 FunctionExpression 节点
          // 作为 ObjectProperty 的 value
          const func = t.functionExpression(
            null,
            node.params,
            node.body,
            node.generator,
            node.async,
          );

          // returnType 是 Flow/TS 扩展字段、不在 builder 签名里
          func.returnType = node.returnType;

          // 标准化key，转为计算key形式
          const computedKey = t.toComputedKey(node);
          // 判断是否是 __proto__ 键: 
          //  __proto__ 特判：{ __proto__() {} } 的键是 __proto__，
          //  字面量键会触发原型 setter（Annex B 语义）——设置的是原型
          //  而不是自有属性。改成计算键 ["__proto__"] 绕开 setter，
          if (t.isStringLiteral(computedKey, { value: "__proto__" })) {
            // 替换节点 --> 第三个参数 computed=true 即"这是计算键"。
            //  - 替换为计算键形式的 ObjectProperty
            path.replaceWith(t.objectProperty(computedKey, func, true));
          } else {
            // 常规路径：键保留原样，computed 透传（["a"]() {} 保持计算键）。
            path.replaceWith(t.objectProperty(node.key, func, node.computed));
          }
        }
      },
      // 对象字面量里的键值对属性节点 ObjectProperty：处理属性简写：{ a }  →  { a: a }
      ObjectProperty(path) {
        const { node } = path;

        // shorthand：简写属性标记
        //  只关心简写形态（{ a: 1 } 这种本来就不是简写，不动）
        if (node.shorthand) {
          // 特判：{ __proto__ } 的字面量键
          const computedKey = t.toComputedKey(node);
          if (t.isStringLiteral(computedKey, { value: "__proto__" })) {
            path.replaceWith(t.objectProperty(computedKey, node.value, true));
          } else {
            // 常规情况：parser 产出的 { a } 里 key 和 value 本来就是
            // 内容相同的两个节点，只需关掉简写标志，generator 就输出 a: a
            node.shorthand = false;
          }
        }
      },
    },
  };
});
