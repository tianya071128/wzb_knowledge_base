import { declare } from "@babel/helper-plugin-utils";
import { transform } from "@babel/plugin-transform-optional-chaining";
import { shouldTransform } from "./util.js";
export default declare(api => {
  api.assertVersion("8.0.6");
  const noDocumentAll = api.assumption("noDocumentAll") ?? false;
  const pureGetters = api.assumption("pureGetters") ?? false;
  return {
    name: "bugfix-v8-spread-parameters-in-optional-chaining",
    visitor: api.traverse.explode({
      "OptionalCallExpression|OptionalMemberExpression"(path) {
        if (shouldTransform(path)) {
          transform(path, {
            noDocumentAll,
            pureGetters
          });
        }
      }
    })
  };
});