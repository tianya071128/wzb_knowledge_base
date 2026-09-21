import { transformSync } from "@babel/core";
import arrowFunctionsPlugin from "@babel/plugin-transform-arrow-functions";

// 待转换的源码：包含几种常见的箭头函数写法
const code = `
const add = (a, b) => a + b;
const square = (x) => {
  return x * x;
};
const nums = [1, 2, 3].map(n => n * 2);
`;

console.log("========= 原始代码 =========");
console.log(code);

/**
 * 使用 @babel/core 的 transformSync 进行转换。
 * plugins 数组里放入插件，即表示「只用这一个插件」来处理代码。
 * 这里传入的是已构建好的本地包 packages/babel-plugin-transform-arrow-functions/lib。
 */
const result = transformSync(code, {
  // 关闭配置文件查找，确保只应用我们显式传入的插件，便于观察单一插件效果
  configFile: false,
  babelrc: false,
  plugins: [arrowFunctionsPlugin],
});

console.log("========= 转换后代码 =========");
console.log(result?.code);

console.log("========= 学习要点 =========");
console.log(
  [
    "1. 箭头函数 (a, b) => a + b 被转换为 function (a, b) { return a + b; }",
    "2. 隐式返回会被补上 return 语句",
    "3. 该插件本身不处理 this 词法作用域；需要 this 绑定时会配合其它 helper",
    "4. transformSync 的第三个核心能力来自 @babel/core：解析 -> 遍历(AST) -> 生成",
  ].join("\n")
);
