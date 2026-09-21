import type { OptionsWithDefaults } from "../options.ts";
import { Position, SourceLocation } from "../util/location.ts";
import CommentsParser from "../parser/comments.ts";
import type * as N from "../types.ts";
import { type TokenType } from "./types.ts";
import type { TokContext } from "./context.ts";
import type { ParseError } from "../parse-error.ts";
import { type ParseErrorConstructor } from "../parse-error.ts";
import State from "./state.ts";
import type { LookaheadState, DeferredStrictError } from "./state.ts";
import type { Undone } from "../parser/node.ts";
import type { Node } from "../types.ts";
import { type IntErrorHandlers, type CodePointErrorHandlers, type StringContentsErrorHandlers } from "@babel/helper-string-parser";
import type { Plugin } from "../typings.d.ts";
export declare class Token {
    constructor(state: State);
    type: TokenType;
    value: any;
    start: number;
    end: number;
    loc: SourceLocation;
}
export default abstract class Tokenizer extends CommentsParser {
    isLookahead: boolean;
    tokens: (Token | N.Comment)[];
    constructor(options: OptionsWithDefaults, input: string);
    setLoc(loc: Position): void;
    getLoc(locIndex: number): Position;
    pushToken(token: Token | N.Comment): void;
    next(): void;
    eat(type: TokenType): boolean;
    /**
     * Whether current token matches given type
     */
    match(type: TokenType): boolean;
    /**
     * Create a LookaheadState from current parser state
     */
    createLookaheadState(state: State): LookaheadState;
    /**
     * lookahead peeks the next token, skipping changes to token context and
     * comment stack. For performance it returns a limited LookaheadState
     * instead of full parser state.
     *
     * The { column, line } Loc info is not included in lookahead since such usage
     * is rare. Although it may return other location properties e.g. `curLine` and
     * `lineStart`, these properties are not listed in the LookaheadState interface
     * and thus the returned value is _NOT_ reliable.
     *
     * The tokenizer should make best efforts to avoid using any parser state
     * other than those defined in LookaheadState
     */
    lookahead(): LookaheadState;
    nextTokenStart(): number;
    nextTokenStartSince(pos: number): number;
    lookaheadCharCode(): number;
    lookaheadCharCodeSince(pos: number): number;
    /**
     * Similar to nextToken, but it will stop at line break when it is seen before the next token
     *
     * @returns {number} position of the next token start or line break, whichever is seen first.
     * @memberof Tokenizer
     */
    nextTokenInLineStart(): number;
    nextTokenInLineStartSince(pos: number): number;
    /**
     * Similar to lookaheadCharCode, but it will return the char code of line break if it is
     * seen before the next token
     *
     * @returns {number} char code of the next token start or line break, whichever is seen first.
     * @memberof Tokenizer
     */
    lookaheadInLineCharCode(): number;
    codePointAtPos(pos: number): number;
    setStrict(strict: boolean): void;
    curContext(): TokContext;
    nextToken(): void;
    skipBlockComment(commentEnd: "*/" | "*-/"): N.CommentBlock | undefined;
    skipLineComment(startSkip: number): N.CommentLine | undefined;
    skipSpace(): void;
    finishToken(type: TokenType, val?: any): void;
    replaceToken(type: TokenType): void;
    readToken_numberSign(): void;
    readToken_dot(): void;
    readToken_slash(): void;
    readToken_interpreter(): boolean;
    readToken_mult_modulo(code: number): void;
    readToken_pipe_amp(code: number): void;
    readToken_caret(): void;
    readToken_atSign(): void;
    readToken_plus_min(code: number): void;
    readToken_lt(): void;
    readToken_gt(): void;
    readToken_eq_excl(code: number): void;
    readToken_question(): void;
    getTokenFromCode(code: number): void;
    finishOp(type: TokenType, size: number): void;
    readRegexp(): void;
    readInt(radix: number, len?: number, forceLen?: boolean, allowNumSeparator?: boolean | "bail"): number | null;
    readRadixNumber(radix: number): void;
    readNumber(startsWithDot: boolean): void;
    readCodePoint(throwOnInvalid: boolean): number | null;
    readString(quote: number): void;
    readTemplateContinuation(): void;
    readTemplateToken(): void;
    recordStrictModeErrors(toParseError: DeferredStrictError, at: Position): void;
    readWord1(firstCode?: number): string;
    readWord(firstCode?: number): void;
    checkKeywordEscapes(): void;
    /**
     * Raise a `ParseError` given the appropriate properties. If passed a
     * `Position` for the `at` property, raises the `ParseError` at that location.
     * Otherwise, if passed a `Node`, raises the `ParseError` at the start
     * location of that `Node`.
     *
     * If `errorRecovery` is `true`, the error is pushed to the errors array and
     * returned. If `errorRecovery` is `false`, the error is instead thrown.
     *
     * The return type is marked as `never` for simplicity, as error recovery
     * will create types in an invalid AST shape.
     */
    raise<ErrorDetails = object>(toParseError: ParseErrorConstructor<ErrorDetails>, at: Position | Undone<Node> | number, details?: ErrorDetails): ParseError;
    /**
     * If `errorRecovery` is `false`, this method behaves identically to `raise`.
     * If `errorRecovery` is `true`, this method will first see if there is
     * already an error stored at the same `Position`, and replaces it with the
     * one generated here.
     */
    raiseOverwrite<ErrorDetails>(toParseError: ParseErrorConstructor<ErrorDetails>, at: Position | Undone<Node>, details?: ErrorDetails): ParseError;
    updateContext(prevType?: TokenType): void;
    unexpected(loc?: Position | number | null, type?: TokenType): any;
    expectPlugin(pluginName: Plugin, loc?: Position | number | null): true;
    expectOnePlugin(pluginNames: Plugin[]): any;
    errorBuilder(error: ParseErrorConstructor<object>): (pos: number, lineStart: number, curLine: number) => void;
    errorHandlers_readInt: IntErrorHandlers;
    errorHandlers_readCodePoint: CodePointErrorHandlers;
    errorHandlers_readStringContents_string: StringContentsErrorHandlers;
    errorHandlers_readStringContents_template: StringContentsErrorHandlers;
}
//# sourceMappingURL=index.d.ts.map