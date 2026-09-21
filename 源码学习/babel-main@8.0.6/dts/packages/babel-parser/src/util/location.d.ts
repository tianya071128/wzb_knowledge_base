export declare class Position {
    line: number;
    column: number;
    index: number;
    constructor(line: number, col: number, index?: number);
}
export declare class SourceLocation {
    start: Position;
    end: Position;
    filename: string | undefined;
    identifierName: string | undefined | null;
    constructor(start: Position, end?: Position);
}
/**
 * creates a new position with a non-zero column offset from the given position.
 * This function should be only be used when we create AST node out of the token
 * boundaries, such as TemplateElement ends before tt.templateNonTail. This
 * function does not skip whitespaces.
 */
export declare function createPositionWithColumnOffset(position: Position, columnOffset: number): Position;
//# sourceMappingURL=location.d.ts.map