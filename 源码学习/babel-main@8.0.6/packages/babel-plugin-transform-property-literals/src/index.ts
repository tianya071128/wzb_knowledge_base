import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";

/**
 * 作用:
 *  - 把对象字面量中用保留字作键的写法，给键加上引号（转成字符串字面量），以兼容 ES3。
 */
export default declare(api => {
  // 声明该插件兼容的 Babel 版本范围。
  api.assertVersion(REQUIRED_VERSION("^7.0.0-0 || ^8.0.0"));

  return {
    name: "transform-property-literals",

    visitor: {
      /**
       * 对象字面量里普通键值对节点
       *  {
       *    type: "ObjectProperty",
       *    key: Node,          // 属性名节点 Identifier / StringLiteral / NumericLiteral / Expression
       *    value: Node,        // 属性值节点
       *    computed: boolean,  // 是否是计算属性 [key]，默认 false
       *    shorthand: boolean, // 是否简写 { name }，默认 false
       *    decorators: [] | null
       *  }
       */
      ObjectProperty: {
        /** 在离开该节点（子节点都处理完）时触发，与 enter（进入时）相对。这里用 exit 保证从内层往外处理。 */
        exit({ node }) {
          const key = node.key;
          if (
            !node.computed && // 非计算属性
            t.isIdentifier(key) && // 键是标识符节点
            !t.isValidES3Identifier(key.name) // 键名是 ES3 保留字/非法标识符
          ) {
            // 把键从 Identifier("default") 节点替换成 StringLiteral("default") 节点。
            // default: "bar" -> "default": "bar"
            node.key = t.stringLiteral(key.name);
          }
        },
      },
    },
  };
});
