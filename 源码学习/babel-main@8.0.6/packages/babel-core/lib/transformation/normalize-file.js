import * as _t from "@babel/types";
const {
  file
} = _t;
import convertSourceMap from "convert-source-map";
import readInputSourceMapFile from "#transformation/read-input-source-map-file";
import File from "./file/file.js";
import parser from "../parser/index.js";
import cloneDeep from "./util/clone-deep.js";
const SOURCEMAP_REGEX = /^[@#]\s+sourceMappingURL=.*$/;
const INLINE_SOURCEMAP_REGEX = /^[@#]\s+sourceMappingURL=data:(?:application|text)\/json;(?:charset[:=]\S+?;)?base64,.*$/;
const EXTERNAL_SOURCEMAP_REGEX = /^[@#][ \t]+sourceMappingURL=([^\s'"`]+)[ \t]*$/;
export default function* normalizeFile(pluginPasses, options, code, ast) {
  code = `${code || ""}`;
  if (ast) {
    if (ast.type === "Program") {
      ast = file(ast, [], []);
    } else if (ast.type !== "File") {
      throw new Error("AST root must be a Program or File node");
    }
    if (options.cloneInputAst) {
      ast = cloneDeep(ast);
    }
  } else {
    ast = yield* parser(pluginPasses, options, code);
  }
  let inputMap = null;
  if (options.sourceMaps && options.inputSourceMap !== false) {
    if (typeof options.inputSourceMap === "object") {
      inputMap = convertSourceMap.fromObject(options.inputSourceMap);
    }
    if (!inputMap) {
      const body = ast.program.body;
      const comment = extractCommentFromList(body.length > 0 ? body[body.length - 1].trailingComments : ast.program.innerComments);
      if (comment) {
        if (INLINE_SOURCEMAP_REGEX.test(comment)) {
          try {
            inputMap = convertSourceMap.fromComment("//" + comment);
          } catch (err) {
            console.warn("discarding unknown inline input sourcemap", options.filename, err);
          }
        } else if (typeof options.filename === "string" && EXTERNAL_SOURCEMAP_REGEX.test(comment)) {
          try {
            const inputMapURL = EXTERNAL_SOURCEMAP_REGEX.exec(comment)[1];
            inputMap = readInputSourceMapFile(options.filename, options.root, inputMapURL);
          } catch (err) {
            console.warn("discarding unknown file input sourcemap", err);
          }
        } else {
          console.warn("discarding un-loadable file input sourcemap");
        }
      }
    }
  }
  return new File(options, {
    code,
    ast: ast,
    inputMap
  });
}
function extractCommentFromList(comments) {
  if (comments == null || comments.length === 0) return null;
  for (let i = comments.length - 1; i >= 0; i--) {
    const comment = comments[i];
    if (SOURCEMAP_REGEX.test(comment.value)) {
      comments.splice(i, 1);
      return comment.value;
    }
  }
  return null;
}