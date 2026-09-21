/**
 * debug-arrow-plugin.ts —— 直接调试【未构建的插件源码 src/index.ts】
 *
 * 与 main.ts 的区别：
 *   - main.ts 里 import "@babel/plugin-transform-arrow-functions"，解析到的是
 *     packages/.../lib/index.js（构建产物），断点打在 index.ts 上不会命中。
 *   - 本文件直接 import 源码 .ts 文件，Node 22 的原生类型剥离会为它生成
 *     inline source map，调试器可以把断点直接打在 index.ts 上并命中。
 *
 * 运行：node src/debug-arrow-plugin.ts
 * 断点调试：node --inspect-brk src/debug-arrow-plugin.ts（再用 Chrome DevTools 打开）
 *   或直接用 IDE 的 F5（见 .vscode/launch.json）
 */

import { transformSync } from "@babel/core";

// 关键：这里引用的是【源码】index.ts，而不是构建后的 lib/index.js
import arrowFunctionsPlugin from "@babel/plugin-transform-arrow-functions";

const code = `const add = (a, b) => a + b;`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [arrowFunctionsPlugin as any],
});

console.log("转换结果：");
console.log(result?.code);
