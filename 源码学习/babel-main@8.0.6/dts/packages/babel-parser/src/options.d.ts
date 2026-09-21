import type { Plugin } from "./plugin-utils.ts";
export type SourceType = "script" | "commonjs" | "module" | "unambiguous";
export interface Options {
    /**
     * By default, import and export declarations can only appear at a program's top level.
     * Setting this option to true allows them anywhere where a statement is allowed.
     */
    allowImportExportEverywhere?: boolean;
    /**
     * By default, await use is not allowed outside of an async function.
     * Set this to true to accept such code.
     */
    allowAwaitOutsideFunction?: boolean;
    /**
     * By default, a return statement at the top level raises an error.
     * Set this to true to accept such code.
     */
    allowReturnOutsideFunction?: boolean;
    /**
     * By default, new.target use is not allowed outside of a function or class.
     * Set this to true to accept such code.
     */
    allowNewTargetOutsideFunction?: boolean;
    /**
     * By default, super calls are not allowed outside of a method.
     * Set this to true to accept such code.
     */
    allowSuperOutsideMethod?: boolean;
    /**
     * By default, exported identifiers must refer to a declared variable.
     * Set this to true to allow export statements to reference undeclared variables.
     */
    allowUndeclaredExports?: boolean;
    /**
     * By default, yield use is not allowed outside of a generator function.
     * Set this to true to accept such code.
     */
    allowYieldOutsideFunction?: boolean;
    /**
     * By default, Babel parser JavaScript code according to Annex B syntax.
     * Set this to `false` to disable such behavior.
     */
    annexB?: boolean;
    /**
     * By default, Babel attaches comments to adjacent AST nodes.
     * When this option is set to false, comments are not attached.
     * It can provide up to 30% performance improvement when the input code has many comments.
     * @babel/eslint-parser will set it for you.
     * It is not recommended to use attachComment: false with Babel transform,
     * as doing so removes all the comments in output code, and renders annotations such as
     * /* istanbul ignore next *\/ nonfunctional.
     */
    attachComment?: boolean;
    /**
     * By default, Babel always throws an error when it finds some invalid code.
     * When this option is set to true, it will store the parsing error and
     * try to continue parsing the invalid input file.
     */
    errorRecovery?: boolean;
    /**
     * Indicate the mode the code should be parsed in.
     * Can be one of "script", "commonjs", "module", or "unambiguous". Defaults to "script".
     * "unambiguous" will make @babel/parser attempt to guess, based on the presence
     * of ES6 import or export statements.
     * Files with ES6 imports and exports are considered "module" and are otherwise "script".
     *
     * Use "commonjs" to parse code that is intended to be run in a CommonJS environment such as Node.js.
     */
    sourceType?: SourceType;
    /**
     * Correlate output AST nodes with their source filename.
     * Useful when generating code and source maps from the ASTs of multiple input files.
     */
    sourceFilename?: string;
    /**
     * By default, all source indexes start from 0.
     * You can provide a start index to alternatively start with.
     * Useful for integration with other source tools.
     */
    startIndex?: number;
    /**
     * By default, the first line of code parsed is treated as line 1.
     * You can provide a line number to alternatively start with.
     * Useful for integration with other source tools.
     */
    startLine?: number;
    /**
     * By default, the parsed code is treated as if it starts from line 1, column 0.
     * You can provide a column number to alternatively start with.
     * Useful for integration with other source tools.
     */
    startColumn?: number;
    /**
     * Array containing the plugins that you want to enable.
     */
    plugins?: Plugin[];
    /**
     * Should the parser work in strict mode.
     * Defaults to true if sourceType === 'module'. Otherwise, false.
     */
    strictMode?: boolean;
    /**
     * Adds a ranges property to each node: [node.start, node.end]
     */
    ranges?: boolean;
    /**
     * Adds a locations property to each node: [node.loc]
     */
    locations?: boolean;
    /**
     * Adds all parsed tokens to a tokens property on the File node.
     */
    tokens?: boolean;
    /**
     * By default, the parser adds information about parentheses by setting
     * `extra.parenthesized` to `true` as needed.
     * When this option is `true` the parser creates `ParenthesizedExpression`
     * AST nodes instead of using the `extra` property.
     */
    createParenthesizedExpressions?: boolean;
    /**
     * By default, the parser parses import expressions as an `ImportExpression` node.
     * Set this to false to parse it as `CallExpression(Import, [Identifier(foo)])`.
     */
    createImportExpressions?: boolean;
}
export declare const enum OptionFlags {
    AllowAwaitOutsideFunction = 1,
    AllowReturnOutsideFunction = 2,
    AllowNewTargetOutsideFunction = 4,
    AllowImportExportEverywhere = 8,
    AllowSuperOutsideMethod = 16,
    AllowYieldOutsideFunction = 32,
    AllowUndeclaredExports = 64,
    Ranges = 128,
    Locations = 256,
    Tokens = 512,
    CreateImportExpressions = 1024,
    CreateParenthesizedExpressions = 2048,
    ErrorRecovery = 4096,
    AttachComment = 8192,
    AnnexB = 16384
}
type KeepOptionalKeys = "sourceFilename" | "strictMode";
export type OptionsWithDefaults = Omit<Required<Options>, KeepOptionalKeys> & Pick<Options, KeepOptionalKeys>;
export declare function getOptions(opts?: Options | null): OptionsWithDefaults;
export {};
//# sourceMappingURL=options.d.ts.map