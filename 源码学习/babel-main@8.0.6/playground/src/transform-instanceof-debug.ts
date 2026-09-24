import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import instanceofPlugin from "@babel/plugin-transform-instanceof";

// 测试 instanceof 降级：
//   obj instanceof Foo  ->  _instanceof(obj, Foo)
// 插件通过 this.addHelper("instanceof") 注入辅助函数，
// Babel 会自动把 function _instanceof(...) {...} 定义插入到输出顶部
const code = `
const result = obj instanceof Foo;
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [instanceofPlugin as any],
});

console.log("转换结果：");
/**
 * function _instanceof(n, e) { return null != e && "undefined" != typeof Symbol && e[Symbol.hasInstance] ? !!e[Symbol.hasInstance](n) : n instanceof e; }
 * const result = _instanceof(obj, Foo);
 */
console.log(result?.code);
