import StatementParser from "./statement.ts";
import ScopeHandler from "../util/scope.ts";
import type { ParserOptions, ParseResult, File } from "@babel/parser";
export type PluginsMap = Map<string, Record<string, any>>;
export default class Parser extends StatementParser {
    constructor(options: ParserOptions | undefined | null, input: string, pluginsMap: PluginsMap);
    getScopeHandler(): new (...args: any) => ScopeHandler;
    parse(): ParseResult<File>;
}
//# sourceMappingURL=index.d.ts.map