import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import propertyLiteralsPlugin from "@babel/plugin-transform-property-literals";

// 测试对象字面量中「用 ES3 保留字作键」的场景：
// 保留字键（default / catch）会被加上引号，合法键（foo）保持不变
const code = `
const obj = { default: "bar", catch: 1, foo: 2 };
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [propertyLiteralsPlugin as any],
});

console.log("转换结果：");
/**
 * const obj = {
 *   "default": "bar",
 *   "catch": 1,
 *   foo: 2
 * };
 */
console.log(result?.code);
