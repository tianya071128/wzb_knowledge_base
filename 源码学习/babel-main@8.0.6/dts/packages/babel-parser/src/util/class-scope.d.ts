import { ClassElementType } from "./scopeflags.ts";
import type { Position } from "./location.ts";
import type Tokenizer from "../tokenizer/index.ts";
export declare class ClassScope {
    privateNames: Set<string>;
    loneAccessors: Map<string, ClassElementType>;
    undefinedPrivateNames: Map<string, number | Position>;
}
export default class ClassScopeHandler {
    parser: Tokenizer;
    stack: ClassScope[];
    constructor(parser: Tokenizer);
    current(): ClassScope;
    enter(): void;
    exit(): void;
    declarePrivateName(name: string, elementType: ClassElementType, loc: number): void;
    usePrivateName(name: string, loc: Position | number): void;
}
//# sourceMappingURL=class-scope.d.ts.map