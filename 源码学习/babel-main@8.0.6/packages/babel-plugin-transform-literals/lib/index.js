import { declare } from "@babel/helper-plugin-utils";
export default declare(api => {
  api.assertVersion("8.0.6");
  return {
    name: "transform-literals",
    visitor: {
      NumericLiteral({
        node
      }) {
        if (node.extra && /^0[ob]/i.test(node.extra.raw)) {
          node.extra = undefined;
        }
      },
      StringLiteral({
        node
      }) {
        if (node.extra && /\\u/i.test(node.extra.raw)) {
          node.extra = undefined;
        }
      }
    }
  };
});