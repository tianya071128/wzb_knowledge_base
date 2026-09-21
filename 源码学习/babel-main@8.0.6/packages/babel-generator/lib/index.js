import SourceMap from "./source-map.js";
import Printer from "./printer.js";
function normalizeOptions(code, opts, ast) {
  if (opts.experimental_preserveFormat) {
    if (typeof code !== "string") {
      throw new Error("`experimental_preserveFormat` requires the original `code` to be passed to @babel/generator as a string");
    }
    if (!opts.retainLines) {
      throw new Error("`experimental_preserveFormat` requires `retainLines` to be set to `true`");
    }
    if (opts.compact && opts.compact !== "auto") {
      throw new Error("`experimental_preserveFormat` is not compatible with the `compact` option");
    }
    if (opts.minified) {
      throw new Error("`experimental_preserveFormat` is not compatible with the `minified` option");
    }
    if (opts.jsescOption) {
      throw new Error("`experimental_preserveFormat` is not compatible with the `jsescOption` option");
    }
    if (!Array.isArray(ast.tokens)) {
      throw new Error("`experimental_preserveFormat` requires the AST to have attached the token of the input code. Make sure to enable the `tokens: true` parser option.");
    }
  }
  const format = {
    auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
    auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
    shouldPrintComment: opts.shouldPrintComment,
    preserveFormat: opts.experimental_preserveFormat,
    retainLines: opts.retainLines,
    retainFunctionParens: opts.retainFunctionParens,
    comments: opts.comments == null || opts.comments,
    compact: opts.compact,
    minified: opts.minified,
    concise: opts.concise,
    indent: {
      adjustMultilineComment: true,
      style: "  "
    },
    jsescOption: {
      quotes: "double",
      wrap: true,
      minimal: true,
      ...opts.jsescOption
    },
    topicToken: opts.topicToken
  };
  if (format.minified) {
    format.compact = true;
    format.shouldPrintComment = format.shouldPrintComment || (() => format.comments);
  } else {
    format.shouldPrintComment = format.shouldPrintComment || (value => format.comments || value.includes("@license") || value.includes("@preserve"));
  }
  if (format.compact === "auto") {
    format.compact = typeof code === "string" && code.length > 500_000;
    if (format.compact) {
      console.error("[BABEL] Note: The code generator has deoptimised the styling of " + `${opts.filename} as it exceeds the max of ${"500KB"}.`);
    }
  }
  if (format.compact || format.preserveFormat) {
    format.indent.adjustMultilineComment = false;
  }
  const {
    auxiliaryCommentBefore,
    auxiliaryCommentAfter,
    shouldPrintComment
  } = format;
  if (auxiliaryCommentBefore && !shouldPrintComment(auxiliaryCommentBefore)) {
    format.auxiliaryCommentBefore = undefined;
  }
  if (auxiliaryCommentAfter && !shouldPrintComment(auxiliaryCommentAfter)) {
    format.auxiliaryCommentAfter = undefined;
  }
  return format;
}
export function generate(ast, opts = {}, code) {
  const format = normalizeOptions(code, opts, ast);
  const map = opts.sourceMaps ? new SourceMap(opts, code) : null;
  const printer = new Printer(format, map, ast.tokens, typeof code === "string" ? code : null);
  return printer.generate(ast);
}
export default generate;