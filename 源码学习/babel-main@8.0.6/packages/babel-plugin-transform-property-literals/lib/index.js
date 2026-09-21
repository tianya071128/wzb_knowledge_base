import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";
export default declare(api => {
  api.assertVersion("8.0.6");
  return {
    name: "transform-property-literals",
    visitor: {
      ObjectProperty: {
        exit({
          node
        }) {
          const key = node.key;
          if (!node.computed && t.isIdentifier(key) && !t.isValidES3Identifier(key.name)) {
            node.key = t.stringLiteral(key.name);
          }
        }
      }
    }
  };
});