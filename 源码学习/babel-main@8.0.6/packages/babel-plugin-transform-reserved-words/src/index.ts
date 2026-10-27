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
    /**
     * api.traverse.explode: 手动调用 explode
     */
    visitor: api.traverse.explode({
      /**
       * 同时监听两个虚拟节点：
       *  - BindingIdentifier: 绑定标识符，Identifier 处在绑定位置（变量声明、参数、函数 id，`path.isBindingIdentifier()`）
       *  - ReferencedIdentifier: 引用标识符，Identifier 处在引用读取位置（`path.isReferencedIdentifier()`）
       * 
       * 虚拟节点的意义：过滤掉「虽是 Identifier、但既非声明也非引用」的节点，
       */
      "BindingIdentifier|ReferencedIdentifier"(path) {
        // path.node 此时一定是 Identifier（或 JSXIdentifier），有 .name。
        // 名字「现代合法」却「在 ES3 名单里」时做处理
        if (!t.isValidES3Identifier(path.node.name)) {
          // scope.rename：重命名整个绑定，自动同步所有绑定点 + 所有引用点
          // 内部生成安全的新名字（_0 / _1），保证兼容 ES3（IE 老引擎）
          path.scope.rename(path.node.name);
        }
      },
    }),
  };
});
