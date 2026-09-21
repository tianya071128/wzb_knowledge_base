import { declare } from "@babel/helper-plugin-utils";
function remover({
  node
}) {
  const {
    extra
  } = node;
  if (extra?.raw?.includes("_")) {
    extra.raw = extra.raw.replace(/_/g, "");
  }
}
export default declare(api => {
  api.assertVersion("8.0.6");
  return {
    name: "transform-numeric-separator",
    manipulateOptions: undefined,
    visitor: {
      NumericLiteral: remover,
      BigIntLiteral: remover
    }
  };
});