import { declare } from "@babel/helper-plugin-utils";
import { transform, transformOptionalChain } from "./transform.js";
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  if ("loose" in options) {
    console.warn("@babel/plugin-transform-optional-chaining: The 'loose' option has been deprecated, " + "use the `noDocumentAll` and `pureGetters` assumptions instead (https://babeljs.io/assumptions).");
  }
  const {
    loose = false
  } = options;
  const noDocumentAll = api.assumption("noDocumentAll") ?? loose;
  const pureGetters = api.assumption("pureGetters") ?? loose;
  return {
    name: "transform-optional-chaining",
    manipulateOptions: undefined,
    visitor: api.traverse.explode({
      "OptionalCallExpression|OptionalMemberExpression"(path) {
        transform(path, {
          noDocumentAll,
          pureGetters
        });
      }
    })
  };
});
export { transform, transformOptionalChain };