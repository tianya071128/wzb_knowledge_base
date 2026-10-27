import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";

// 「保留字标识符重命名」（ES3 兼容）：
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

// 把「现代合法、但 ES3 是保留字」的标识符改名
export default declare(api => {
  // 运行时版本校验
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  return {
    name: "transform-reserved-words",

    visitor: api.traverse.explode({
      "BindingIdentifier|ReferencedIdentifier"(path) {
        if (!t.isValidES3Identifier(path.node.name)) {
          path.scope.rename(path.node.name);
        }
      },
    }),
  };
});
