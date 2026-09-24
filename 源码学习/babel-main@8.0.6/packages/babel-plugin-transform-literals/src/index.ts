import { declare } from "@babel/helper-plugin-utils";

/**
 * 把 ES2015+ 新字面量语法，转成 ES5 兼容的字面量
 *  - 二进制字面量: 0b1010 --> 10
 *  - 八进制字面量: 0o70 --> 56
 *  - Unicode 转义: "é" --> "é"
 */
export default declare(api => {
  // 声明本插件兼容的 Babel 主版本，不匹配时抛清晰错误
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  return {
    name: "transform-literals",

    visitor: {
      /**
       * 数字字面量节点
       *  {
       *    type: "NumericLiteral",
       *    value: 11, // JS运行时真实数字值 --> 解析后十进制 Number，`0b1011` / `0o12` / `0xff` 解析后 value 都是十进制数字
       *    extra: {
       *      raw: "0b1011",    // 源码原始字符串 --> Babel 生成代码时默认优先读取这个字段
       *      rawValue: 11
       *    },
       *    loc: { start, end } // 源码行列位置
       *  }
       */
      NumericLiteral({ node }) {
        // number octal like 0b10 or 0o70 八进制数，如0b10或0o70
        // @ts-expect-error Add node.extra typings
        // 判断 raw 是否以 0b（二进制）或 0o（八进制）开头
        if (node.extra && /^0[ob]/i.test(node.extra.raw)) {
          // generator 输出时优先用 extra.raw，一旦它为空，就回退到 String(value)，于是 0b11 被重新生成为 3。
          node.extra = undefined; //
        }
      },

      /**
       * 字符串字面量节点
       *  {
       *    type: "StringLiteral",
       *    value: "Hello\nA", // JS运行时真实字符串值（已经解析转义）
       *    extra: {
       *      raw: "\"Hello\\u{000A}A\"", // 源码原始文本，带引号、原始转义符 --> Babel generate 生成代码优先读 raw
       *      rawValue: "Hello\nA"
       *    },
       *    loc: { start, end }
       *  }
       */
      StringLiteral({ node }) {
        // unicode escape
        // @ts-expect-error Add node.extra typings
        if (node.extra && /\\u/i.test(node.extra.raw)) {
          node.extra = undefined;
        }
      },
    },
  };
});
