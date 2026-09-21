import type { OptionFlags, Options } from "../options.ts";
import type State from "../tokenizer/state.ts";
import type { PluginsMap } from "./index.ts";
import type ScopeHandler from "../util/scope.ts";
import type ExpressionScopeHandler from "../util/expression-scope.ts";
import type ClassScopeHandler from "../util/class-scope.ts";
import type ProductionParameterHandler from "../util/production-parameter.ts";
import type { ParserPluginWithOptions, PluginConfig, PluginOptions } from "../typings.d.ts";
import type * as N from "../types.ts";
export default class BaseParser {
    options: Options;
    optionFlags: OptionFlags;
    inModule: boolean;
    scope: ScopeHandler<any>;
    classScope: ClassScopeHandler;
    prodParam: ProductionParameterHandler;
    expressionScope: ExpressionScopeHandler;
    plugins: PluginsMap;
    filename: string | undefined | null;
    startIndex: number;
    exportedIdentifiers: Set<string>;
    sawUnambiguousESM: boolean;
    ambiguousScriptDifferentAst: boolean;
    state: State;
    input: string;
    length: number;
    comments: N.Comment[];
    locData: Uint32Array;
    sourceToOffsetPos(sourcePos: number): number;
    offsetToSourcePos(offsetPos: number): number;
    hasPlugin(pluginConfig: PluginConfig): boolean;
    getPluginOption<PluginName extends ParserPluginWithOptions[0], OptionName extends keyof PluginOptions<PluginName>>(plugin: PluginName, name: OptionName): NonNullable<PluginOptions<PluginName>>[OptionName] | undefined;
}
//# sourceMappingURL=base.d.ts.map