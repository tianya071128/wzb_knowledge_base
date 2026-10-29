import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";

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

/**
 * 键名归一化：把"静态可确定的键"统一映射成字符串，供查重表比较。
 * 调用点已用 filter 保证非计算键，所以不处理表达式，只剩四种字面形态：
 *   Identifier("a")      → "a"     （取 name）
 *   StringLiteral("a")   → "a"     （取 value，本身就是字符串）
 *   NumericLiteral(1)    → "1"     （value 是 number，toString 归一化——
 *                                    { 1: 1 } 与 { "1": 2 } 能判重的关键）
 *   BigIntLiteral(1n)    → "1"     （value 是 bigint，toString 同理）
 */
function getName(
  key: t.Identifier | t.StringLiteral | t.NumericLiteral | t.BigIntLiteral,
) {
  // 标识符键只有 name 字段
  if (t.isIdentifier(key)) {
    return key.name;
  }

  // 三种字面量都有 value，统一转字符串
  return key.value.toString();
}

export default declare(api => {
  // 版本阀门
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  return {
    name: "transform-duplicate-keys",

    visitor: {

      /**
       * ObjectExpression 是对象字面量的 AST 节点（{ ... } 本身）。
       * {
       *   type: "ObjectExpression";
       *   // 数组：里面只能是下面三类子节点
       *   properties: Array<
       *     t.ObjectProperty | t.ObjectMethod | t.SpreadElement
       *   >;
       * }
       */
      ObjectExpression(path) {
        const { node } = path;

        // 从 properties 数组里筛出"可静态查重"的属性
        //  - 展开元素（...o）与计算键（["a"]）不参与
        //  - 前者不是具名属性，后者值不可静态确定
        const plainProps = node.properties.filter(
          prop => 
            // 排除展开元素
            !t.isSpreadElement(prop) &&
            // 排除计算键 --> ["a"+"b"] 的键值编译期不可知，无法参与查重
            !prop.computed,
        ) as (t.ObjectMethod | t.ObjectProperty)[];

        // A property is a duplicate key if: 在以下情况下，属性是重复键：
        // * the property is a data property, and is preceded by a data,  该属性是一个数据属性，前面有一个数据
        //   getter, or setter property of the same name. 例如同名的getter或setter属性
        // * the property is a getter property, and is preceded by a data or 该属性是一个getter属性，前面有一个data或
        //   getter property of the same name. 同名的getter属性
        // * the property is a setter property, and is preceded by a data or 该属性是一个setter属性，前面有一个data或
        //   setter property of the same name. 同名的setter属性。

        /**
         * 三个 seen 对象，分别记录不同类型的属性是否出现过：
         *  - alreadySeenData 记录数据属性是否出现过
         *  - alreadySeenGetters 记录 getter 属性是否出现过
         *  - alreadySeenSetters 记录 setter 属性是否出现过
         */
        const alreadySeenData = Object.create(null);
        const alreadySeenGetters = Object.create(null);
        const alreadySeenSetters = Object.create(null);

        /** 遍历 plainProps 数组，检查每个属性是否重复 */
        for (const prop of plainProps) {
          // 获取属性的键名
          const name = getName(
            // prop must be non-computed
            prop.key as
              | t.Identifier
              | t.StringLiteral
              | t.NumericLiteral
              | t.BigIntLiteral,
          );
          // 标记是否重复
          let isDuplicate = false;

          /**
           * 根据属性的 kind 字段，判断是否重复，并更新 seen 对象。
           * kind 字段表示属性的类型：
           *   - "get" 表示 getter 属性
           *   - "set" 表示 setter 属性
           *   - 其他 表示数据属性（data property）
           */
          // @ts-expect-error prop.kind is not defined in ObjectProperty
          switch (prop.kind) {
            case "get":
              // get 与 data 冲突 || get 与 get 冲突（同名双 get）
              if (alreadySeenData[name] || alreadySeenGetters[name]) {
                isDuplicate = true;
              }
              // 标记 get 属性出现过
              alreadySeenGetters[name] = true;
              break;
            case "set":
              // set 与 data 冲突 || set 与 set 冲突（同名双 set）
              if (alreadySeenData[name] || alreadySeenSetters[name]) {
                isDuplicate = true;
              }
              // 标记 set 属性出现过
              alreadySeenSetters[name] = true;
              break;
            default:
              // data 与 data 冲突 || get 与 data 冲突 || set 与 data 冲突
              if (
                alreadySeenData[name] ||
                alreadySeenGetters[name] ||
                alreadySeenSetters[name]
              ) {
                isDuplicate = true;
              }
              // 标记 data 属性出现过
              alreadySeenData[name] = true;
          }

          /**
           * 如果属性是重复的，则将其转换为计算键，并标记为计算属性。
           * 这样可以避免引擎/parser 对重复键的检查，并且交给后续的 computed-properties 插件拆分成赋值语句，保持"后者覆盖"的运行时语义。
           */
          if (isDuplicate) {
            // Rely on the computed properties transform to split the property 依靠计算的属性转换来分割属性
            // assignment out of the object literal. 对象字面量之外的赋值。

            // 处理方式非常"轻"：不拆语句、不造赋值 —— 只把重复属性改成计算键 prop.computed = true + stringLiteral(name)。
            //   - 效果：绕开引擎的重复键 SyntaxError 检查（计算键不查重），
            //   - 然后依赖 computed-properties 插件把 ["a"]: 6 拆成
            //   - obj["a"] = 6 赋值 —— 旧引擎重复赋值合法，语义不变。
            //   - 这是"插件接力"设计：本插件只负责标记，脏活交给下游。
            prop.computed = true;
            prop.key = t.stringLiteral(name); // 构造 StringLiteral 字符串字面量节点
          }
        }
      },
    },
  };
});
