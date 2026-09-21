import { _codeFrameColumns } from "./common.js";
import { defs, isColorSupported } from "./defs.js";
import { highlight } from "./highlight.js";
export { highlight };
export function codeFrameColumns(rawLines, loc, opts = {}) {
  const shouldHighlight = opts.forceColor || isColorSupported() && opts.highlightCode;
  return _codeFrameColumns(rawLines, loc, opts, shouldHighlight ? {
    defs,
    highlight
  } : undefined);
}