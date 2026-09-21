import { _codeFrameColumns } from "./common.js";
export function codeFrameColumns(rawLines, loc, opts = {}) {
  return _codeFrameColumns(rawLines, loc, opts);
}
export function highlight(code) {
  return code;
}