export const OptionFlags = {
  AllowAwaitOutsideFunction: 1,
  AllowReturnOutsideFunction: 2,
  AllowNewTargetOutsideFunction: 4,
  AllowImportExportEverywhere: 8,
  AllowSuperOutsideMethod: 16,
  AllowYieldOutsideFunction: 32,
  AllowUndeclaredExports: 64,
  Ranges: 128,
  Locations: 256,
  Tokens: 512,
  CreateImportExpressions: 1024,
  CreateParenthesizedExpressions: 2048,
  ErrorRecovery: 4096,
  AttachComment: 8192,
  AnnexB: 16384
};
function createDefaultOptions() {
  return {
    sourceType: "script",
    sourceFilename: undefined,
    startIndex: 0,
    startColumn: 0,
    startLine: 1,
    allowAwaitOutsideFunction: false,
    allowReturnOutsideFunction: false,
    allowNewTargetOutsideFunction: false,
    allowImportExportEverywhere: false,
    allowSuperOutsideMethod: false,
    allowUndeclaredExports: false,
    allowYieldOutsideFunction: false,
    plugins: [],
    strictMode: undefined,
    ranges: false,
    locations: true,
    tokens: false,
    createImportExpressions: true,
    createParenthesizedExpressions: false,
    errorRecovery: false,
    attachComment: true,
    annexB: true
  };
}
export function getOptions(opts) {
  const options = createDefaultOptions();
  if (opts == null) {
    return options;
  }
  if (opts.annexB != null && opts.annexB !== false) {
    throw new Error("The `annexB` option can only be set to `false`.");
  }
  for (const key of Object.keys(options)) {
    if (opts[key] != null) options[key] = opts[key];
  }
  if (options.startLine === 1) {
    if (opts.startIndex == null && options.startColumn > 0) {
      options.startIndex = options.startColumn;
    } else if (opts.startColumn == null && options.startIndex > 0) {
      options.startColumn = options.startIndex;
    }
  } else if (opts.startColumn == null || opts.startIndex == null) {
    throw new Error("With a `startLine > 1` you must also specify `startIndex` and `startColumn`.");
  }
  if (options.sourceType === "commonjs") {
    if (opts.allowAwaitOutsideFunction != null) {
      throw new Error("The `allowAwaitOutsideFunction` option cannot be used with `sourceType: 'commonjs'`.");
    }
    if (opts.allowReturnOutsideFunction != null) {
      throw new Error("`sourceType: 'commonjs'` implies `allowReturnOutsideFunction: true`, please remove the `allowReturnOutsideFunction` option or use `sourceType: 'script'`.");
    }
    if (opts.allowNewTargetOutsideFunction != null) {
      throw new Error("`sourceType: 'commonjs'` implies `allowNewTargetOutsideFunction: true`, please remove the `allowNewTargetOutsideFunction` option or use `sourceType: 'script'`.");
    }
  }
  return options;
}