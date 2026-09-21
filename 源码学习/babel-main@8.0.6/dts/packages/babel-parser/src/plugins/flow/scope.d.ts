import ScopeHandler, { Scope } from "../../util/scope.ts";
import { BindingFlag, type ScopeFlag } from "../../util/scopeflags.ts";
import type * as N from "../../types.ts";
declare class FlowScope extends Scope {
    declareFunctions: Set<string>;
}
export default class FlowScopeHandler extends ScopeHandler<FlowScope> {
    createScope(flags: ScopeFlag): FlowScope;
    declareName(name: string, bindingType: BindingFlag, loc: number): void;
    isRedeclaredInScope(scope: FlowScope, name: string, bindingType: BindingFlag): boolean;
    checkLocalExport(id: N.Identifier): void;
}
export {};
//# sourceMappingURL=scope.d.ts.map