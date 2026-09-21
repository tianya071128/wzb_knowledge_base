import { declare } from "@babel/helper-plugin-utils";
import { shouldTransform } from "./util.js";
export default declare(api => {
  api.assertVersion("8.0.6");
  return {
    name: "plugin-bugfix-safari-id-destructuring-collision-in-function-expression",
    visitor: {
      FunctionExpression(path) {
        const name = shouldTransform(path);
        if (name) {
          const {
            scope
          } = path;
          const newParamName = scope.generateUid(name);
          scope.rename(name, newParamName);
        }
      }
    }
  };
});