import ScopeHandler, { Scope } from "../../util/scope.ts";
import { BindingFlag, ScopeFlag } from "../../util/scopeflags.ts";
import type * as N from "../../types.ts";
declare const enum TsNameType {
    Types = 1,
    Enums = 2,
    ConstEnums = 4,
    Classes = 8,
    ExportOnlyBindings = 16
}
declare class TypeScriptScope extends Scope {
    tsNames: Map<string, TsNameType>;
}
export default class TypeScriptScopeHandler extends ScopeHandler<TypeScriptScope> {
    get inTSNamespace(): boolean;
    importsStack: Set<string>[];
    createScope(flags: ScopeFlag): TypeScriptScope;
    enter(flags: ScopeFlag): void;
    exit(): ScopeFlag;
    hasImport(name: string, allowShadow?: boolean): boolean;
    declareName(name: string, bindingType: BindingFlag, loc: number): void;
    isRedeclaredInScope(scope: TypeScriptScope, name: string, bindingType: BindingFlag): boolean;
    checkLocalExport(id: N.Identifier): void;
}
export {};
//# sourceMappingURL=scope.d.ts.map