import UtilParser from "./util.ts";
import { type Position } from "../util/location.ts";
import type { Node as NodeType, BaseNode, EstreeLiteral, Identifier, Placeholder, StringLiteral } from "../types.ts";
export type Undone<T extends NodeType> = Omit<T, "type">;
export declare abstract class NodeUtils extends UtilParser {
    createPosition(loc: Position): Position;
    startNode<T extends NodeType = never>(): Undone<T>;
    startNodeAt<T extends NodeType = never>(loc: Position): Undone<T>;
    /** Start a new node with a previous node's location. */
    startNodeAtNode<T extends NodeType = never>(type: Undone<NodeType>): Undone<T>;
    finishNode<T extends NodeType>(node: Undone<T>, type: T["type"]): T;
    finishNodeAt<T extends NodeType>(node: Omit<T, "type">, type: T["type"], endLoc: Position): T;
    finishNodeAtNode<T extends NodeType>(node: Omit<T, "type">, type: T["type"], endNode: NodeType): T;
    resetStartLocation(node: BaseNode, startLoc: Position): void;
    resetEndLocation(node: BaseNode, endLoc?: Position): void;
    /**
     * Reset the start location of node to the start location of locationNode
     */
    resetStartLocationFromNode(node: BaseNode, locationNode: BaseNode): void;
    resetEndLocationFromNode(node: BaseNode, locationNode: BaseNode): void;
    castNodeTo<T extends NodeType["type"]>(node: NodeType, type: T): Extract<NodeType, {
        type: T;
    }>;
    cloneIdentifier<T extends Identifier | Placeholder>(node: T): T;
    cloneStringLiteral<T extends StringLiteral | EstreeLiteral | Placeholder>(node: T): T;
}
//# sourceMappingURL=node.d.ts.map