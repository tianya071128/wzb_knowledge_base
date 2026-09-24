import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import optionalCatchBindingPlugin from "@babel/plugin-transform-optional-catch-binding";

// 测试「省略 catch 参数」的场景（ES2019 可选 catch 绑定）：
// catch 后没有参数时，会补一个唯一占位参数 _unused
const code = `
try {
  foo();
} catch {
  bar();
}
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [optionalCatchBindingPlugin as any],
});

console.log("转换结果：");
/**
 * try {
 *   foo();
 * } catch (_unused) {
 *   bar();
 * }
 */
console.log(result?.code);
