import type { OptionsWithDefaults } from "../options.ts";
import type { CommentWhitespace } from "../parser/comments";
import { Position } from "../util/location.ts";
import { type TokContext } from "./context.ts";
import { type TokenType } from "./types.ts";
import type { Errors, ParseError } from "../parse-error.ts";
export type DeferredStrictError = typeof Errors.StrictNumericEscape | typeof Errors.StrictOctalLiteral;
export declare const enum LoopLabelKind {
    Loop = 1,
    Switch = 2
}
export default class State {
    flags: number;
    accessor strict: boolean;
    startIndex: number;
    curLine: number;
    lineStart: number;
    startLoc: Position;
    endLoc: Position;
    init({ strictMode, sourceType, startIndex, startLine, startColumn, }: OptionsWithDefaults): void;
    errors: ParseError[];
    noArrowAt: number[];
    noArrowParamsConversionAt: number[];
    /**
     * Track whether the current start is the start of an AssignmentExpression production.
     * The ArrowFunctionExpression and AsyncArrowFunctionExpression productions can only be
     * parsed if this is true.
     */
    accessor canStartArrow: boolean;
    accessor inType: boolean;
    accessor noAnonFunctionType: boolean;
    accessor hasFlowComment: boolean;
    accessor isAmbientContext: boolean;
    accessor inAbstractClass: boolean;
    accessor inDisallowConditionalTypesContext: boolean;
    accessor inConditionalConsequent: boolean;
    accessor inHackPipelineBody: boolean;
    accessor seenTopicReference: boolean;
    labels: {
        kind: LoopLabelKind | null;
        name?: string | null;
        statementStart?: number;
    }[];
    commentsLen: number;
    commentStack: CommentWhitespace[];
    pos: number;
    type: TokenType;
    value: any;
    start: number;
    end: number;
    lastTokEndLoc: Position | null;
    lastTokStartLoc: Position | null;
    context: TokContext[];
    accessor canStartJSXElement: boolean;
    accessor containsEsc: boolean;
    firstInvalidTemplateEscapePos: null | Position;
    accessor hasTopLevelAwait: boolean;
    strictErrors: Map<number, [import("../parse-error.ts").ParseErrorConstructor<object>, Position]>;
    tokensLength: number;
    /**
     * When we add a new property, we must manually update the `clone` method
     * @see State#clone
     */
    curPosition(): Position;
    clone(): State;
}
export type LookaheadState = {
    pos: number;
    value: any;
    type: TokenType;
    start: number;
    end: number;
    context: TokContext[];
    startLoc: Position;
    lastTokEndLoc: Position | null;
    curLine: number;
    lineStart: number;
    curPosition: State["curPosition"];
    inType: boolean;
    containsEsc?: boolean;
};
//# sourceMappingURL=state.d.ts.map