import { ScopeFlag, BindingFlag } from "./scopeflags.ts";
import type * as N from "../types.ts";
import type Tokenizer from "../tokenizer/index.ts";
export declare const enum NameType {
    Var = 1,
    Lexical = 2,
    Function = 4
}
export declare class Scope {
    flags: ScopeFlag;
    names: Map<string, NameType>;
    firstLexicalName: string;
    constructor(flags: ScopeFlag);
}
export default class ScopeHandler<IScope extends Scope = Scope> {
    parser: Tokenizer;
    scopeStack: IScope[];
    inModule: boolean;
    undefinedExports: Map<string, number>;
    constructor(parser: Tokenizer, inModule: boolean);
    get inTopLevel(): boolean;
    get inFunction(): boolean;
    get allowSuper(): boolean;
    get allowDirectSuper(): boolean;
    get allowNewTarget(): boolean;
    get inClass(): boolean;
    get inClassAndNotInNonArrowFunction(): boolean;
    get inStaticBlock(): boolean;
    get inNonArrowFunction(): boolean;
    get inBareCaseStatement(): boolean;
    get treatFunctionsAsVar(): boolean;
    createScope(flags: ScopeFlag): Scope;
    enter(flags: ScopeFlag): void;
    exit(): ScopeFlag;
    treatFunctionsAsVarInScope(scope: IScope): boolean;
    declareName(name: string, bindingType: BindingFlag, loc: number): void;
    maybeExportDefined(scope: IScope, name: string): void;
    checkRedeclarationInScope(scope: IScope, name: string, bindingType: BindingFlag, loc: number): void;
    isRedeclaredInScope(scope: IScope, name: string, bindingType: BindingFlag): boolean;
    checkLocalExport(id: N.Identifier): void;
    currentScope(): IScope;
    currentVarScopeFlags(): ScopeFlag;
    currentThisScopeFlags(): ScopeFlag;
}
//# sourceMappingURL=scope.d.ts.map