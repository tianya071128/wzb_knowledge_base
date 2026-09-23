import isValidIdentifier from "./isValidIdentifier.ts";

const RESERVED_WORDS_ES3_ONLY = new Set<string>([
  "abstract",
  "boolean",
  "byte",
  "char",
  "double",
  "enum",
  "final",
  "float",
  "goto",
  "implements",
  "int",
  "interface",
  "long",
  "native",
  "package",
  "private",
  "protected",
  "public",
  "short",
  "static",
  "synchronized",
  "throws",
  "transient",
  "volatile",
]);

/**
 * Check if the input `name` is a valid identifier name according to the ES3 specification. 根据ES3规范，检查输入的`name`是否为有效的标识符名称
 *
 * Additional ES3 reserved words are 其他ES3保留字包括
 */
export default function isValidES3Identifier(name: string): boolean {
  return isValidIdentifier(name) && !RESERVED_WORDS_ES3_ONLY.has(name);
}
