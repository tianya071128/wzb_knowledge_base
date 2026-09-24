import { declare } from "@babel/helper-plugin-utils";

/**
 * 作用: 为 ES2019「可选 catch 绑定」（catch 后省略参数）补一个占位参数，以兼容不支持该语法的老环境。
 */
export default declare(api => {
  // 声明兼容的 Babel 版本
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  return {
    name: "transform-optional-catch-binding",
    // 一个可选钩子: 用于在插件加载时调整或修改 Babel 配置（比如给 parser 增加语法插件），在`visitor`运行之前
    // 这里显式写成 undefined，表示"本插件不需要改动任何选项"——是一种明确声明意图的写法。
    manipulateOptions: undefined,
    visitor: {
      /**
       * 匹配 try...catch 里的 catch 子句节点
       * {
       *   type: "CatchClause",
       *   param: Identifier | ObjectPattern | ArrayPattern | null, // 捕获参数 --> 省略参数时 param 为 null。
       *   body: BlockStatement, // catch 内部代码块，必须是BlockStatement
       * }
       */
      CatchClause(path) {
        // ① catch 没写参数
        if (!path.node.param) {
          const uid = path.scope.generateUidIdentifier("unused"); // ② 生成唯一 Identifier（标识符）AST 节点
          /**
           * 最终目的: 也就是在 path.node.param 插入一个 AST 节点
           */
          const paramPath = path.get("param"); // ③ 拿到 param 子路径
          paramPath.replaceWith(uid); // ④ 替换
        }
      },
    },
  };
});
