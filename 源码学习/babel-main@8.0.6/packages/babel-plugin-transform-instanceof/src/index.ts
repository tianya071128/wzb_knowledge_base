import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";

/**
 * 将 `a instanceof B` 运算符，替换成 helper 函数调用
 *  例如：`a instanceof B` 被替换为 `_instanceof(a, B)`
 *   --> 其中 _instanceof 是注入的 helper 函数的名称
 */
export default declare(api => {
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  return {
    name: "transform-instanceof",

    visitor: {
      /**
       * 二元表达式节点: 左右两个操作数, instanceof、+ - * / != !== > < 全部属于 BinaryExpression。
       */
      BinaryExpression(path) {
        const { node } = path;
        // 过滤出只处理 instanceof，其它运算符直接跳过
        if (node.operator === "instanceof") {
          // 登记依赖: 告诉 Babel"这个文件需要 instanceof 这段运行时逻辑"
          // 返回引用：给你一个指向该 helper 的 Identifier 节点（实际名字如 _instanceof）
          // Babel 会在生成阶段把 helper 函数体自动注入到输出顶部或者 import 引入, 取决于不同模式
          // 也就是注入 _instanceof 这个 helper 函数
          const helper = this.addHelper("instanceof");

          // 判断"当前这个 instanceof 是否位于 helper 自己的定义体内部"：
          // 注入的 helper 内部还有 n instanceof e。
          // 遍历器随后会访问到这个 BinaryExpression，如果不识别、又去替换它 → 再注入一个 helper → 里面的 instanceof 又被替换……无限递归。
          const isUnderHelper = path.findParent(path => {
            return (
              // 是否为变量声明的节点 && 节点的 id 是否等于 helper
              (path.isVariableDeclarator() && path.node.id === helper) ||
              // 是否为函数声明的节点 && 节点的 id 是否等于 helper
              (path.isFunctionDeclaration() &&
                path.node.id?.name === helper.name)
            );
          });

          if (isUnderHelper) {
            return; // 在 helper 内部 → 原样放行，不动它
          } else {
            // 替换节点：将 instanceof 运算符替换为 helper 函数调用
            path.replaceWith(
              // 构造一个函数调用节点
              // 即将 a instanceof B 转换为 _instanceof(a, B)
              t.callExpression(helper, [node.left, node.right]),
            );
          }
        }
      },
    },
  };
});
