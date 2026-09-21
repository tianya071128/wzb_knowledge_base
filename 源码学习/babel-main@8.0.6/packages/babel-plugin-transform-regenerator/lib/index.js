import { declare } from "@babel/helper-plugin-utils";
import { getVisitor } from "./regenerator/visit.js";
export default declare(({
  assertVersion
}) => {
  assertVersion("8.0.6");
  return {
    name: "transform-regenerator",
    visitor: getVisitor()
  };
});