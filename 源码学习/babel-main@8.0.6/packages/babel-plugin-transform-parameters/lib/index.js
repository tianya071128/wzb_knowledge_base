import { declare } from "@babel/helper-plugin-utils";
import convertFunctionParams from "./params.js";
import convertFunctionRest from "./rest.js";
export { convertFunctionParams };
export default declare((api, options) => {
  api.assertVersion("8.0.6");
  if ("loose" in options) {
    console.warn("@babel/plugin-transform-parameters: The 'loose' option has been deprecated, " + "use the `ignoreFunctionLength` assumption instead (https://babeljs.io/assumptions).");
  }
  const ignoreFunctionLength = api.assumption("ignoreFunctionLength") ?? options.loose;
  const noNewArrows = api.assumption("noNewArrows") ?? true;
  return {
    name: "transform-parameters",
    visitor: {
      Function(path) {
        if (path.isArrowFunctionExpression() && path.get("params").some(param => param.isRestElement() || param.isAssignmentPattern())) {
          path.arrowFunctionToExpression({
            allowInsertArrowWithRest: false,
            noNewArrows
          });
          if (!path.isFunctionExpression()) return;
        }
        const convertedRest = convertFunctionRest(path);
        const convertedParams = convertFunctionParams(path, ignoreFunctionLength);
        if (convertedRest || convertedParams) {
          path.scope.crawl();
        }
      }
    }
  };
});