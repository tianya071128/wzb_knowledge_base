import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";
export default declare(api => {
  api.assertVersion("8.0.6");
  return {
    name: "transform-reserved-words",
    visitor: api.traverse.explode({
      "BindingIdentifier|ReferencedIdentifier"(path) {
        if (!t.isValidES3Identifier(path.node.name)) {
          path.scope.rename(path.node.name);
        }
      }
    })
  };
});