import { declare } from "@babel/helper-plugin-utils";
import { shouldTransform } from "./util.js";
export default declare(api => {
  const {
    types: t,
    assertVersion
  } = api;
  assertVersion("8.0.6");
  return {
    name: "plugin-bugfix-safari-rest-destructuring-rhs-array",
    visitor: {
      ArrayPattern(path) {
        const rhs = shouldTransform(path);
        if (rhs) {
          path.replaceWith(t.arrayPattern([path.node]));
          rhs.replaceWith(t.arrayExpression([rhs.node]));
        }
      }
    }
  };
});