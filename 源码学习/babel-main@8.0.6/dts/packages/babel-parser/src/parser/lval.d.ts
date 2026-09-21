import * as charCodes from "charcodes";
import { type TokenType } from "../tokenizer/types.ts";
import type { AssignmentPattern, TSParameterProperty, Decorator, Expression, Identifier, Node, Pattern, RestElement, SpreadElement, ObjectOrClassMember, ClassMember, ObjectMember, TSPropertySignature, TSMethodSignature, PrivateName, ObjectExpression, ObjectPattern, ArrayPattern, AssignmentProperty, Assignable, VoidPattern, ArgumentPlaceholder, TSTypeCastExpression } from "../types.ts";
import type { Position } from "../util/location.ts";
import { NodeUtils, type Undone } from "./node.ts";
import { BindingFlag } from "../util/scopeflags.ts";
import type { ExpressionErrors } from "./util.ts";
import { type LValAncestor } from "../parse-error.ts";
import type Parser from "./index.ts";
export declare const enum ParseBindingListFlags {
    ALLOW_EMPTY = 1,
    IS_FUNCTION_PARAMS = 2,
    IS_CONSTRUCTOR_PARAMS = 4
}
export default abstract class LValParser extends NodeUtils {
    abstract parseIdentifier(liberal?: boolean): Identifier;
    abstract parseObjectLike<T extends ObjectPattern | ObjectExpression>(close: TokenType, isPattern: boolean, refExpressionErrors?: ExpressionErrors): T;
    abstract parseObjPropValue(prop: any, startLoc: Position | null, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean, refExpressionErrors?: ExpressionErrors | null): void;
    abstract parsePropertyName(prop: ObjectOrClassMember | ClassMember | TSPropertySignature | TSMethodSignature): void;
    abstract parsePrivateName(): PrivateName;
    abstract parseDecorator(): Decorator;
    /**
     * Convert existing expression atom to assignable pattern
     * if possible. Also checks invalid destructuring targets:
     *
     * - Parenthesized Destructuring patterns
     * - RestElement is not the last element
     * - Missing `=` in assignment pattern
     *
     * NOTE: There is a corresponding "isAssignable" method.
     * When this one is updated, please check if also that one needs to be updated.
     *
     * @param node The expression atom
     * @param isLHS Whether we are parsing a LeftHandSideExpression.
     *              If isLHS is `true`, the following cases are allowed: `[(a)] = [0]`, `[(a.b)] = [0]`
     *              If isLHS is `false`, we are in an arrow function parameters list.
     */
    toAssignable(node: Node, isLHS?: boolean): asserts node is Assignable;
    toAssignableObjectExpressionProp(prop: Node, isLast: boolean, isLHS: boolean): void;
    toAssignableList(exprList: (Expression | SpreadElement | RestElement | VoidPattern | AssignmentPattern | ArgumentPlaceholder | TSTypeCastExpression | null)[], trailingCommaLoc: Position | undefined | null, isLHS: boolean): void;
    toAssignableListItem(exprList: (Expression | SpreadElement | RestElement | VoidPattern | AssignmentPattern | TSTypeCastExpression)[], index: number, isLHS: boolean): void;
    isAssignable(node: Node, isBinding?: boolean): boolean;
    /**
     * Convert list of maybe-pattern atoms to a list of expression atoms.
     */
    toReferencedList(exprList: readonly (Expression | SpreadElement | VoidPattern | AssignmentPattern | ArgumentPlaceholder | TSTypeCastExpression | null)[] | readonly (Expression | RestElement | VoidPattern | AssignmentPattern | TSTypeCastExpression | null)[], isParenthesizedExpr?: boolean): readonly (Expression | SpreadElement | VoidPattern | AssignmentPattern | ArgumentPlaceholder | TSTypeCastExpression | null)[] | readonly (Expression | RestElement | VoidPattern | AssignmentPattern | TSTypeCastExpression | null)[];
    parseSpread(this: Parser, refExpressionErrors?: ExpressionErrors | null): SpreadElement;
    parseRestBinding(this: Parser): RestElement;
    parseBindingAtom(this: Parser): ArrayPattern | ObjectPattern | VoidPattern | Identifier;
    parseBindingList(this: Parser, close: TokenType, closeCharCode: (typeof charCodes)[keyof typeof charCodes], flags: ParseBindingListFlags.ALLOW_EMPTY): (Pattern | RestElement | null)[];
    parseBindingList(this: Parser, close: TokenType, closeCharCode: (typeof charCodes)[keyof typeof charCodes], flags: ParseBindingListFlags.IS_FUNCTION_PARAMS): (Pattern | RestElement | TSParameterProperty)[];
    parseBindingRestProperty(this: Parser, prop: Undone<RestElement>): RestElement;
    parseBindingProperty(this: Parser): AssignmentProperty | RestElement;
    parseBindingElement(this: Parser, flags: ParseBindingListFlags, decorators: Decorator[]): Pattern | Identifier | TSParameterProperty;
    parseFunctionParamType<T extends Pattern | Identifier | RestElement>(param: T): T;
    parseMaybeDefault<P extends Pattern | Identifier>(this: Parser, startLoc?: Position | null, left?: P | null): P | AssignmentPattern;
    /**
     * Return information use in determining whether a Node of a given type is an LVal,
     * possibly given certain additional context information.
     *
     * Subclasser notes: This method has kind of a lot of mixed, but related,
     * responsibilities. If we can definitively determine with the information
     * provided that this either *is* or *isn't* a valid `LVal`, then the return
     * value is easy: just return `true` or `false`. However, if it is a valid
     * LVal *ancestor*, and thus its descendants must be subsequently visited to
     * continue the "investigation", then this method should return the relevant
     * child key as a `string`. In some special cases, you additionally want to
     * convey that this node should be treated as if it were parenthesized. In
     * that case, a tuple of [key: string, parenthesized: boolean] is returned.
     * The `string`-only return option is actually just a shorthand for:
     * `[key: string, parenthesized: false]`.
     *
     * @param type A Node `type` string
     * @param disallowCallExpression Whether to disallow `CallExpression` as an LVal.
     * @param isUnparenthesizedInAssign
     *        Whether the node in question is unparenthesized and its parent
     *        is either an assignment pattern or an assignment expression.
     * @param binding
     *        The binding operation that is being considered for this potential
     *        LVal.
     * @returns `true` or `false` if we can immediately determine whether the node
     *          type in question can be treated as an `LVal`.
     *          A `string` key to traverse if we must check this child.
     *          A `[string, boolean]` tuple if we need to check this child and
     *          treat is as parenthesized.
     */
    isValidLVal(type: string, disallowCallExpression: boolean, isUnparenthesizedInAssign: boolean, binding: BindingFlag): string | boolean | [string, boolean];
    isOptionalMemberExpression(expression: Node): boolean;
    /**
     * Verify that a target expression is an lval (something that can be assigned to).
     *
     * @param expression The expression in question to check.
     * @param ancestor
     *        The relevant ancestor to provide context information for the error
     *        if the check fails.
     * @param binding
     *        The desired binding type. If the given expression is an identifier
     *        and `binding` is not `BindingFlag.TYPE_NONE`, `checkLVal` will register binding
     *        to the parser scope See also `src/util/scopeflags.js`
     * @param checkClashes
     *        An optional string set to check if an identifier name is included.
     *        `checkLVal` will add checked identifier name to `checkClashes` It is
     *        used in tracking duplicates in function parameter lists. If it is
     *        false, `checkLVal` will skip duplicate checks
     * @param strictModeChanged
     *        Whether an identifier has been parsed in a sloppy context but should
     *        be reinterpreted as strict-mode. e.g. `(arguments) => { "use strict "}`
     * @param hasParenthesizedAncestor
     *        This is only used internally during recursive calls, and you should
     *        not have to set it yourself.
     * @param disallowCallExpression Whether to disallow `CallExpression` as an LVal.
     */
    checkLVal(expression: Expression | ObjectMember | RestElement | Pattern | TSParameterProperty | TSTypeCastExpression, ancestor: LValAncestor, binding?: BindingFlag, checkClashes?: Set<string> | false, strictModeChanged?: boolean, hasParenthesizedAncestor?: boolean, disallowCallExpression?: boolean): void;
    checkIdentifier(at: Identifier, bindingType: BindingFlag, strictModeChanged?: boolean): void;
    declareNameFromIdentifier(identifier: Identifier, binding: BindingFlag): void;
    checkToRestConversion(node: Node, allowPattern: boolean): void;
    checkCommaAfterRest(close: (typeof charCodes)[keyof typeof charCodes]): boolean;
}
//# sourceMappingURL=lval.d.ts.map