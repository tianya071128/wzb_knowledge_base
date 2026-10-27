import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";

const code = `
// 场景一：变量名与函数名相同（JScript 里同名变量会顶掉函数名）
var IdenticalName = function IdenticalName(x) {
  return x;
};

// 场景二：匿名赋值的命名函数表达式（函数名会泄漏到外层作用域）
(function foo() {});

// 场景三：具名函数声明不受影响，插件不会动它
function bar() {}
`;

/**
 * var IdenticalName = function () {
 *   function IdenticalName(x) {
 *     return x;
 *   }
 *   return IdenticalName;
 * }();
 * (function () {
 *   function foo() {}
 *   return foo;
 * })();
 * function bar() {}
 */

/**
 * 把带名字的函数表达式（Named Function Expression，NFE）改写成「IIFE 包裹的函数声明」，绕开老 IE JScript 引擎的命名函数表达式 bug
 */
export default declare(api => {
  // 运行时版本校验
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  return {
    name: "transform-jscript",

    visitor: {
      /**
       * 函数表达式节点，注意 FunctionDeclaration 不在此列——具名函数声明本来就没有 JScript 这个 bug（例如 function bar() {} 不会被改写）
       * {
       *   type: "FunctionExpression",
       *   id: Identifier | null, // 具名函数表达式才有名字；匿名就是 null（例如 function() {}）
       *   params: [],            // 参数列表，每个是 Identifier / RestElement / Pattern
       *   body: BlockStatement,  // 函数体，一定是代码块
       *   generator: false,      // 是否 function* 生成器
       *   async: false,          // 是否 async function
       * }
       */
      FunctionExpression: {
        /**
         * 后序遍历，离开节点时执行
         *  - 由内向外处理。嵌套的命名函数表达式会先转换最内层
         *     -- (function outer() { (function inner() {}) })()
         *     -- inner 先被包成 IIFE，随后 outer 自己再被包一层
         *  - exit 发生在该节点被当作「完成表达式」处理之后，而 path.replaceWith 会重新排队（requeue）新节点
         *     -- 若写成 enter，新插入的内层 FunctionExpression（虽然 id 是 null）会立即再被访问一次，形成多余的往返；
         *     -- exit 让替换发生在本层处理完毕时，语义上更干净。
         */
        exit(path) {
          const { node } = path;
          /**
           * node.id 是函数表达式自己的名字（Identifier 或 null）
           * 匿名函数表达式 function () {}、箭头函数都没有 id，直接返回，不做任何改写
           */
          if (!node.id) return;

          /**
           * 等价于构造下面这棵树：
           * CallExpression
           * ├─ callee: FunctionExpression(id = null, params = [], body = BlockStatement)
           * │          ├─ Statement[0]: FunctionDeclaration ← t.toStatement(node)
           * │          └─ Statement[1]: ReturnStatement(argument = node.id 的克隆)
           * └─ arguments: []            ← 立即调用 ()
           */
          path.replaceWith(
            // 函数调用表达式节点
            t.callExpression(
              // 生成函数表达式节点调用对象：直接是一个函数函数式，则会生成一个 IIFE（function () { ... }()）
              t.functionExpression(
                // 函数名：null → 故意不给名字，避免又造出一个新的 NFE
                null,
                // 参数列表：直接为空
                [],
                // 生成语句节点：对应一对大括号 `{ ... }` --> > 函数体、if、for、catch、try、while 里面包裹的 `{}` 都是 BlockStatement。
                // 函数体：包含两个语句
                t.blockStatement([
                  // 把节点转换成语句节点
                  // 对 FunctionExpression 且有 id 的情况，返回一个同 id、同参数、同 body 的 FunctionDeclaration
                  // @ts-expect-error t.toStatement must return a FunctionDeclaration if node.id is defined 如果节点的 id 属性已定义，则 t.toStatement 必须返回一个函数声明
                  t.toStatement(node),
                  // 创建返回语句节点：把块内声明的函数 return
                  t.returnStatement(t.cloneNode(node.id)),
                ]),
              ),
              // 立即调用，无需参数
              [],
            ),
          );
        },
      },
    },
  };
});
