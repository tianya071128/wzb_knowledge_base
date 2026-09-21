import type { Position } from "../util/location.ts";
import { type TokenType } from "../tokenizer/types.ts";
import Tokenizer from "../tokenizer/index.ts";
import type State from "../tokenizer/state.ts";
import type { EstreePropertyDefinition, Node, ObjectMethod, ObjectProperty, PrivateName } from "../types.ts";
import { type ParseError, type ParseErrorConstructor } from "../parse-error.ts";
import type Parser from "./index.ts";
import type ScopeHandler from "../util/scope.ts";
type TryParse<Node, Error, Thrown, Aborted, FailState> = {
    node: Node;
    error: Error;
    thrown: Thrown;
    aborted: Aborted;
    failState: FailState;
};
export default abstract class UtilParser extends Tokenizer {
    abstract getScopeHandler(): new (...args: any) => ScopeHandler;
    addExtra(node: Partial<Node>, key: string, value: any, enumerable?: boolean): void;
    isContextual(token: TokenType): boolean;
    isUnparsedContextual(nameStart: number, name: string): boolean;
    isLookaheadContextual(name: string): boolean;
    eatContextual(token: TokenType): boolean;
    expectContextual(token: TokenType, toParseError?: ParseErrorConstructor<any>): void;
    canInsertSemicolon(): boolean;
    hasPrecedingLineBreak(): boolean;
    hasFollowingLineBreak(): boolean;
    isLineTerminator(): boolean;
    semicolon(allowAsi?: boolean): void;
    expect(type: TokenType, loc?: Position | null): void;
    tryParse<T extends Node | readonly Node[] | null>(fn: (abort: (node?: T) => never) => T, oldState?: State): TryParse<T, null, false, false, null> | TryParse<T | null, ParseError, boolean, false, State> | TryParse<T | null, null, false, true, State>;
    checkExpressionErrors(refExpressionErrors: ExpressionErrors | undefined | null, andThrow: boolean): boolean | undefined;
    /**
     * Test if current token is a literal property name
     * https://tc39.es/ecma262/#prod-LiteralPropertyName
     * LiteralPropertyName:
     *   IdentifierName
     *   StringLiteral
     *   NumericLiteral
     *   BigIntLiteral
     */
    isLiteralPropertyName(): boolean;
    /**
     * Test if given node is a PrivateName
     * will be overridden in ESTree plugin
     */
    isPrivateName(node: Node): node is PrivateName;
    /**
     * Return the string value of a given private name
     * WITHOUT `#`
     * @see {@link https://tc39.es/ecma262/#sec-static-semantics-stringvalue}
     */
    getPrivateNameSV(node: PrivateName): string;
    /**
     * Return whether the given node is a member/optional chain that
     * contains a private name as its property
     * It is overridden in ESTree plugin
     */
    hasPropertyAsPrivateName(node: Node): boolean;
    isObjectProperty(node: Node): node is ObjectProperty | EstreePropertyDefinition;
    isObjectMethod(node: Node): node is ObjectMethod;
    initializeScopes(this: Parser, inModule?: boolean): () => void;
    enterInitialScopes(): void;
    checkDestructuringPrivate(refExpressionErrors: ExpressionErrors): void;
}
/**
 * The ExpressionErrors is a context struct used to track ambiguous patterns
 * When we are sure the parsed pattern is a RHS, which means it is not a pattern,
 * we will throw on this position on invalid assign syntax, otherwise it will be reset to null
 *
 * Types of ExpressionErrors:
 *
 * - **shorthandAssignLoc**: track initializer `=` position
 * - **doubleProtoLoc**: track the duplicate `__proto__` key position
 * - **privateKeyLoc**: track private key `#p` position
 * - **optionalParametersLoc**: track the optional parameter (`?`).
 *   It's only used by typescript and flow plugins
 */
export declare class ExpressionErrors {
    shorthandAssignLoc: Position | undefined | null;
    doubleProtoLoc: Position | undefined | null;
    privateKeyLoc: Position | undefined | null;
    optionalParametersLoc: Position | undefined | null;
    voidPatternLoc: Position | undefined | null;
}
export {};
//# sourceMappingURL=util.d.ts.map