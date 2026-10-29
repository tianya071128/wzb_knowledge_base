import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";

const code = `
// 1) 已声明
var s = Symbol("s");
typeof s;

// 2) 未声明
typeof o;

// 3) 遮蔽全局 Symbol
var Symbol = foo();
foo(Symbol);

// 4) 优化豁免：与字面量比较且不是 "symbol"/"object"
typeof s === "string";

// 嵌套：连续两个 typeof
typeof typeof s.foo;
`;


// function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// // 1) 已声明
// var s = _Symbol("s");
// _typeof(s);

// // 2) 未声明
// typeof o === "undefined" ? "undefined" : _typeof(o);

// // 3) 遮蔽全局 Symbol
// var _Symbol = foo();
// foo(_Symbol);

// // 4) 优化豁免：与字面量比较且不是 "symbol"/"object"
// typeof s === "string";

// // 嵌套：连续两个 typeof
// _typeof(_typeof(s.foo));

export default declare(api => {
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  return {
    name: "transform-typeof-symbol",

    visitor: {
      /**
       * 是 babel-traverse 的【虚拟类型】
       *  -- 即：访问所有"作用域类节点"（Scopable：Program/Block/函数/循环/Catch/Class/Switch…）+ 所有"绑定类节点"（Pattern：变量/参数的绑定目标）。
       *  -- 每个这类节点进入时各触发一次本回调 —— 所以它是一个"作用域钩子"。
       */
      Scope({ scope }) {
        // 查当前作用域（沿父作用域链）是否存在名为 Symbol 的【用户绑定】。
        // helper 里引用全局 Symbol 是安全的 → 放行。
        if (!scope.getBinding("Symbol")) {
          return;
        }

        // 把用户绑定整体改名（_Symbol），腾出 Symbol 这个名字给 helper 用。
        scope.rename("Symbol");
      },

      /**
       * 一元表达式节点：类如：typeof s ==> 只匹配一边的
       * {
       *   type: "UnaryExpression";
       *   operator: "void" | "delete" | "!" | "+" | "-" | "~" | "typeof";
       *   argument: t.Expression; // 运算的子表达式
       *   prefix: boolean; // 固定 true（Unary 只有前缀）
       * }
       */
      UnaryExpression(path) {
        const { node, parent } = path;
        // 只处理 typeof（其他一元运算符放行）
        if (node.operator !== "typeof") return;

        // 【优化豁免】判断当前是否处于「typeof x ===/== "字面量"」的比较里
        // 类如：typeof s === "string"
        if (
          // 父节点是二元表达式。
          // 查找父级是否为：typeof s === "string" 节点
          path.parentPath.isBinaryExpression() &&
          // 检查二元表达式的操作符是否为 ["==", "===", "!=", "!=="] 操作符。
          t.EQUALITY_BINARY_OPERATORS.includes(
            (parent as t.BinaryExpression).operator,
          )
        ) {
          // optimise `typeof foo === "string"` since we can determine that they'll never 优化`typeof foo===“string”`，因为我们可以确定它们永远不会
          // need to handle symbols 需要处理符号

          // 获取二元表达式的另一侧（便捷 API）
          const opposite = path.getOpposite()!;
          if (
            opposite.isStringLiteral() && // 另一侧必须是字符串字面量才可静态判断
            opposite.node.value !== "symbol" && // 值不是 "symbol" → 显然与 symbol 相关
            opposite.node.value !== "object" // 值不是 "object" → 保守起见也不跳过
          ) {
            return;
          }
        }

        // 防自递归：判断当前 typeof 是否位于 helper 函数内部。
        const isUnderHelper = path.findParent(path => {
          if (path.isFunctionDeclaration()) {
            return (
              // get("body.directives.0")：路径串语法 —— 等价于
              //   get("body").get("directives").get(0)
              // （点号逐层取成员槽位，数字是数组下标）
              path.get("body.directives.0")?.node.value.value ===
              // 注入的 helper 函数中会增加一个指令：@babel/helpers - typeof
              // 判断这个指令是否为 "@babel/helpers - typeof" 即可判断是否在 helper 中
              "@babel/helpers - typeof"
            );
          }
          return false;
        });
        // 在 helper 里 → 不再转换
        if (isUnderHelper) return;

        // 向当前文件注入 helper 函数，返回对它的引用表达式（Identifier 节点）
        const helper = this.addHelper("typeof");

        // This is needed for backward compatibility with 这是向后兼容所必需的
        // @babel/helpers <= 7.8.3.

        // 安全地构造一个函数调用 AST 节点: 类型为 CallExpression
        // _typeof(x)，参数节点复用
        const call = t.callExpression(helper, [node.argument]);
        // 取出参数节点的 path
        const arg = path.get("argument");

        /**
         * 判定「参数是不是未声明的标识符」：原生 typeof o（未声明）不抛错返回 "undefined"。直接换成 _typeof(o) 调用会先求值 o → ReferenceError
         *   例如：typeof o 此时 o 未声明
         *   转换为 typeof o === "undefined" ? "undefined" : _typeof(o)
         */
        if (
          // 是标识符(即变量 o)
          arg.isIdentifier() && 
          // 沿作用域链找不到绑定。
          !path.scope.hasBinding(arg.node.name, true)
        ) {
          // 构造一个一元表达式节点：typeof o
          const unary = t.unaryExpression("typeof", t.cloneNode(node.argument));

          // 替换节点
          path.replaceWith(
            // 条件表达式节点：typeof o === "undefined" ? "undefined" : _typeof(o)
            t.conditionalExpression(
              t.binaryExpression("===", unary, t.stringLiteral("undefined")),
              t.stringLiteral("undefined"),
              call,
            ),
          );
        } else {
          // 已声明（局部或全局）→ 安全，直接换 helper 调用
          path.replaceWith(call);
        }
      },
    },
  };
});
