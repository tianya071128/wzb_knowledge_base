import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import literalsPlugin from "@babel/plugin-transform-literals";

// 测试「ES2015 进制字面量 + Unicode 转义」降级到 ES5：
//   二进制 0b11  -> 3
//   八进制 0o17  -> 15
//   字符串 \u00e9 -> é
const code = `
const bin = 0b11;
const oct = 0o17;
const str = "\\u00e9";
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [literalsPlugin as any],
});

console.log("转换结果：");
/**
 * const bin = 3;
 * const oct = 15;
 * const str = "é";
 */
console.log(result?.code);
