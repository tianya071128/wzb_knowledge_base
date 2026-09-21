import { styleText } from "node:util";
export function isColorSupported() {
  return styleText("red", "-") !== "-";
}
function createFormatter(format) {
  return input => styleText(format, String(input ?? ""), {
    validateStream: false
  });
}
export const defs = {
  keyword: createFormatter("cyan"),
  capitalized: createFormatter("yellow"),
  jsxIdentifier: createFormatter("yellow"),
  punctuator: createFormatter("yellow"),
  number: createFormatter("magenta"),
  string: createFormatter("green"),
  regex: createFormatter("magenta"),
  comment: createFormatter("gray"),
  invalid: createFormatter(["white", "bgRed", "bold"]),
  gutter: createFormatter("gray"),
  marker: createFormatter(["red", "bold"]),
  message: createFormatter(["red", "bold"]),
  reset: createFormatter("reset")
};