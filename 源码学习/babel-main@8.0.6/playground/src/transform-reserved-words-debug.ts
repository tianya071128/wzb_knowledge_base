import { transformSync } from "@babel/core";
// @ts-ignore 忽略类型检查
import reservedWordsPlugin from "@babel/plugin-transform-reserved-words";

// 测试「保留字标识符重命名」（ES3 兼容）：
// 有一批词（byte/int/boolean/short/float…）在 ES3 里是保留字、不能当变量名，
// 但现代 JS（ES5+）已解禁、可合法使用。若产物要跑在 ES3 引擎上，
// 就得把这些「现代合法、ES3 非法」的标识符改名
// 注意：class / export / const 是现代保留字，parser 阶段就拒绝作变量名，
//       根本进不到插件，不属于本插件处理范围。
const code = `
var int = 1;

function byte(boolean) {
  return boolean + int;
}

obj.int;
({ boolean: 1 });
`;

const result = transformSync(code, {
  configFile: false,
  babelrc: false,
  plugins: [reservedWordsPlugin as any],
});

/**
 * 转换结果：
 * var _int = 1;
 *
 * function _byte(_boolean) {
 *   return _boolean + _int;
 * }
 * 
 * obj.int;
 * 
 * ({
 *   boolean: 1
 * });
 */
console.log("转换结果：");
console.log(result?.code);
