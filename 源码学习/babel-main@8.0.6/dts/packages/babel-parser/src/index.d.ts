import type { Options } from "./options.ts";
export type { PluginConfig as ParserPlugin, FlowPluginOptions, PipelineOperatorPluginOptions, TypeScriptPluginOptions, } from "./typings.d.ts";
import type { ParseError } from "./parse-error.ts";
export type { ParseError };
import type { ExportedTokenType } from "./tokenizer/types.ts";
export type { Token } from "./tokenizer/index.ts";
import type { Expression, File } from "@babel/types";
export type { Expression, File };
export type ParserOptions = Partial<Options>;
export type ParseResult<Result extends File | Expression = File> = Result & {
    comments: File["comments"];
    errors: ParseError[];
    tokens?: File["tokens"];
};
/**
 * Parse the provided code as an entire ECMAScript program.
 */
export declare function parse(input: string, options?: ParserOptions): ParseResult<File>;
export declare function parseExpression(input: string, options?: ParserOptions): ParseResult<Expression>;
export declare const tokTypes: Record<string, ExportedTokenType>;
export declare function getLine(locData: Uint32Array, pos: number): number;
export declare function getColumn(locData: Uint32Array, pos: number): number;
//# sourceMappingURL=index.d.ts.map