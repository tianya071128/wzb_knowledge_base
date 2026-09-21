import BaseParser from "./base.ts";
import type { Comment, Node } from "../types.ts";
import type { Undone } from "./node.ts";
/**
 * A whitespace token containing comments
 */
export type CommentWhitespace = {
    /**
     * the start of the whitespace token.
     */
    start: number;
    /**
     * the end of the whitespace token.
     */
    end: number;
    /**
     * the containing comments
     */
    comments: Comment[];
    /**
     * the immediately preceding AST node of the whitespace token
     */
    leadingNode: Node | null;
    /**
     * the immediately following AST node of the whitespace token
     */
    trailingNode: Node | null;
    /**
     * the innermost AST node containing the whitespace with minimal size (|end - start|)
     */
    containingNode: Node | null;
};
/**
 * Merge comments with node's innerComments or assign comments to be
 * innerComments. New comments will be placed before old comments
 * because the commentStack is enumerated reversely.
 */
export declare function setInnerComments(node: Undone<Node>, comments: Comment[]): void;
export default class CommentsParser extends BaseParser {
    addComment(comment: Comment): void;
    /**
     * Given a newly created AST node _n_, attach _n_ to a comment whitespace _w_ if applicable
     * {@see {@link CommentWhitespace}}
     */
    processComment(node: Node): void;
    /**
     * Assign the comments of comment whitespaces to related AST nodes.
     * Also adjust innerComments following trailing comma.
     */
    finalizeComment(commentWS: CommentWhitespace): void;
    /**
     * Drains remaining commentStack and applies finalizeComment
     * to each comment whitespace. Used only in parseExpression
     * where the top level AST node is _not_ Program
     * {@see {@link CommentsParser#finalizeComment}}
     */
    finalizeRemainingComments(): void;
    /**
     * Reset previous node trailing comments. Used in object / class
     * property parsing. We parse `async`, `static`, `set` and `get`
     * as an identifier but may reinterpret it into an async/static/accessor
     * method later. In this case the identifier is not part of the AST and we
     * should sync the knowledge to commentStacks
     *
     * For example, when parsing
     * ```
     * async /* 1 *​/ function f() {}
     * ```
     * the comment whitespace `/* 1 *​/` has leading node Identifier(async). When
     * we see the function token, we create a Function node and mark `/* 1 *​/` as
     * inner comments. So `/* 1 *​/` should be detached from the Identifier node.
     *
     * @param node the last finished AST node _before_ current token
     */
    resetPreviousNodeTrailingComments(node: Node): void;
    /**
     * Attach a node to the comment whitespaces right before/after
     * the given range.
     *
     * This is used to properly attach comments around parenthesized
     * expressions as leading/trailing comments of the inner expression.
     */
    takeSurroundingComments(node: Node, start: number, end: number): void;
}
//# sourceMappingURL=comments.d.ts.map