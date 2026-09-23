import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";

/**
 * 作用:
 *  - 对象成员访问兼容 ES3，保留字 / 关键字不能用`.`点访问，自动转成`["key"]`方括号写法
 */

export default declare(api => {
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  return {
    name: "transform-member-expression-literals",

    visitor: {
      /**
       * 成员访问表达式:
       *  - 点访问: test.catch   --> computed 属性为 false
       *  - 方括号访问: test["catch"] --> computed 属性为 true
       */
      MemberExpression: {
        exit({ node }) {
          /**
           * MemberExpression {
           *   object:   Expression | Super          // 被访问对象，如 test
           *   property: Identifier | Expression     // 成员名：点访问是 Identifier；方括号是任意表达式
           *   computed: boolean                     // 是否为 [] 形式
           * }
           */
          const prop = node.property;
          if (
            !node.computed && // 点访问
            t.isIdentifier(prop) && // 成员名是 Identifier
            !t.isValidES3Identifier(prop.name) // 判断是否为有效ES3标识符
          ) {
            // foo.default -> foo["default"]
            (node as t.MemberExpression).property = t.stringLiteral(prop.name); // 把原来的 Identifier 节点替换为 StringLiteral(字符串字面量节点) 节点。
            (node as t.MemberExpression).computed = true; // 标记为方括号访问形式
          }
        },
      },
    },
  };
});
