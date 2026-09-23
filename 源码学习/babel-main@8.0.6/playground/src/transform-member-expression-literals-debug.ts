import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import memberExpressionLiteralsPlugin from "@babel/plugin-transform-member-expression-literals";

const code = `
obj.foo
obj.const
obj.catch
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [memberExpressionLiteralsPlugin as any],
});

console.log("转换结果：");
console.log(result?.code);
