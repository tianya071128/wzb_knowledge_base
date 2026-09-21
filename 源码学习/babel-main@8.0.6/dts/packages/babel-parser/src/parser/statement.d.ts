import type * as N from "../types.ts";
import { type TokenType } from "../tokenizer/types.ts";
import ExpressionParser from "./expression.ts";
import { BindingFlag } from "../util/scopeflags.ts";
import type { Token } from "../tokenizer/index.ts";
import type { Position } from "../util/location.ts";
import type { Undone } from "./node.ts";
import type Parser from "./index.ts";
import type { ExportedToken } from "../types.ts";
export declare const enum ParseFunctionFlag {
    Expression = 0,
    Declaration = 1,
    HangingDeclaration = 2,
    NullableId = 4,
    Async = 8
}
export declare const enum ParseStatementFlag {
    StatementOnly = 0,
    AllowImportExport = 1,
    AllowDeclaration = 2,
    AllowFunctionDeclaration = 4,
    AllowLabeledFunction = 8
}
/**
 * Prepare exported tokens.
 * The internal token type will be replaced by the exported one with more metadata.
 * For performance reasons this routine mutates `tokens`, it is okay
 * here since we execute `parseTopLevel` once for every file.
 */
export declare function createExportedTokens(tokens: (Token | N.Comment)[]): (ExportedToken | N.Comment)[];
export default abstract class StatementParser extends ExpressionParser {
    parseTopLevel(this: Parser, file: Undone<N.File>, program: Undone<N.Program>): N.File;
    parseProgram(this: Parser, program: Undone<N.Program>, end: TokenType, sourceType: N.Program["sourceType"]): N.Program;
    /**
     * cast a Statement to a Directive. This method mutates input statement.
     */
    stmtToDirective(stmt: N.ExpressionStatement): N.Directive;
    parseInterpreterDirective(): N.InterpreterDirective | null;
    isLet(): boolean;
    isUsing(): boolean;
    isForUsing(): boolean;
    nextTokenIsIdentifierOnSameLine(): boolean;
    isAwaitUsing(): boolean;
    chStartsBindingIdentifier(ch: number, pos: number): boolean;
    chStartsBindingPattern(ch: number): ch is 91 | 123;
    /**
     * Assuming we have seen a contextual `let` and declaration is allowed, check if it
     * starts a variable declaration so that it should be interpreted as a keyword.
     */
    hasFollowingBindingAtom(): boolean;
    /**
     * Assuming we have seen a contextual `using` and declaration is allowed, check if it
     * starts a variable declaration in the same line so that it should be interpreted as
     * a keyword.
     */
    hasInLineFollowingBindingIdentifierOrBrace(): boolean;
    allowsUsing(): boolean;
    parseModuleItem(this: Parser): N.BlockStatement | N.BreakStatement | N.ClassDeclaration | N.ContinueStatement | N.DebuggerStatement | N.DeclareClass | N.DeclareExportAllDeclaration | N.DeclareExportDeclaration | N.DeclareFunction | N.DeclareInterface | N.DeclareModule | N.DeclareModuleExports | N.DeclareOpaqueType | N.DeclareTypeAlias | N.DeclareVariable | N.DoWhileStatement | N.EmptyStatement | N.EnumDeclaration | N.ExportAllDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExpressionStatement | N.ForInStatement | N.ForOfStatement | N.ForStatement | N.FunctionDeclaration | N.IfStatement | N.ImportDeclaration | N.InterfaceDeclaration | N.LabeledStatement | N.OpaqueType | N.ReturnStatement | N.SwitchStatement | N.TSDeclareFunction | N.TSEnumDeclaration | N.TSExportAssignment | N.TSImportEqualsDeclaration | N.TSInterfaceDeclaration | N.TSModuleDeclaration | N.TSNamespaceExportDeclaration | N.TSTypeAliasDeclaration | N.ThrowStatement | N.TryStatement | N.TypeAlias | N.VariableDeclaration | N.WhileStatement | N.WithStatement;
    parseStatementListItem(this: Parser): N.BlockStatement | N.BreakStatement | N.ClassDeclaration | N.ContinueStatement | N.DebuggerStatement | N.DeclareClass | N.DeclareExportAllDeclaration | N.DeclareExportDeclaration | N.DeclareFunction | N.DeclareInterface | N.DeclareModule | N.DeclareModuleExports | N.DeclareOpaqueType | N.DeclareTypeAlias | N.DeclareVariable | N.DoWhileStatement | N.EmptyStatement | N.EnumDeclaration | N.ExportAllDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExpressionStatement | N.ForInStatement | N.ForOfStatement | N.ForStatement | N.FunctionDeclaration | N.IfStatement | N.ImportDeclaration | N.InterfaceDeclaration | N.LabeledStatement | N.OpaqueType | N.ReturnStatement | N.SwitchStatement | N.TSDeclareFunction | N.TSEnumDeclaration | N.TSExportAssignment | N.TSImportEqualsDeclaration | N.TSInterfaceDeclaration | N.TSModuleDeclaration | N.TSNamespaceExportDeclaration | N.TSTypeAliasDeclaration | N.ThrowStatement | N.TryStatement | N.TypeAlias | N.VariableDeclaration | N.WhileStatement | N.WithStatement;
    parseStatementOrSloppyAnnexBFunctionDeclaration(this: Parser, allowLabeledFunction?: boolean): N.BlockStatement | N.BreakStatement | N.ClassDeclaration | N.ContinueStatement | N.DebuggerStatement | N.DeclareClass | N.DeclareExportAllDeclaration | N.DeclareExportDeclaration | N.DeclareFunction | N.DeclareInterface | N.DeclareModule | N.DeclareModuleExports | N.DeclareOpaqueType | N.DeclareTypeAlias | N.DeclareVariable | N.DoWhileStatement | N.EmptyStatement | N.EnumDeclaration | N.ExportAllDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExpressionStatement | N.ForInStatement | N.ForOfStatement | N.ForStatement | N.FunctionDeclaration | N.IfStatement | N.ImportDeclaration | N.InterfaceDeclaration | N.LabeledStatement | N.OpaqueType | N.ReturnStatement | N.SwitchStatement | N.TSDeclareFunction | N.TSEnumDeclaration | N.TSExportAssignment | N.TSImportEqualsDeclaration | N.TSInterfaceDeclaration | N.TSModuleDeclaration | N.TSNamespaceExportDeclaration | N.TSTypeAliasDeclaration | N.ThrowStatement | N.TryStatement | N.TypeAlias | N.VariableDeclaration | N.WhileStatement | N.WithStatement;
    parseStatement(this: Parser): N.BlockStatement | N.BreakStatement | N.ClassDeclaration | N.ContinueStatement | N.DebuggerStatement | N.DeclareClass | N.DeclareExportAllDeclaration | N.DeclareExportDeclaration | N.DeclareFunction | N.DeclareInterface | N.DeclareModule | N.DeclareModuleExports | N.DeclareOpaqueType | N.DeclareTypeAlias | N.DeclareVariable | N.DoWhileStatement | N.EmptyStatement | N.EnumDeclaration | N.ExportAllDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExpressionStatement | N.ForInStatement | N.ForOfStatement | N.ForStatement | N.FunctionDeclaration | N.IfStatement | N.ImportDeclaration | N.InterfaceDeclaration | N.LabeledStatement | N.OpaqueType | N.ReturnStatement | N.SwitchStatement | N.TSDeclareFunction | N.TSEnumDeclaration | N.TSExportAssignment | N.TSImportEqualsDeclaration | N.TSInterfaceDeclaration | N.TSModuleDeclaration | N.TSNamespaceExportDeclaration | N.TSTypeAliasDeclaration | N.ThrowStatement | N.TryStatement | N.TypeAlias | N.VariableDeclaration | N.WhileStatement | N.WithStatement;
    parseStatementLike(this: Parser, flags: ParseStatementFlag): N.Statement | N.Declaration | N.ImportDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExportAllDeclaration;
    parseStatementContent(this: Parser, flags: ParseStatementFlag, decorators?: N.Decorator[] | null): N.Statement;
    assertModuleNodeAllowed(node: N.Node): void;
    maybeTakeDecorators<T extends Undone<N.Class>>(maybeDecorators: N.Decorator[] | null | undefined, classNode: T, exportNode?: Undone<N.ExportDefaultDeclaration | N.ExportNamedDeclaration>): T;
    canHaveLeadingDecorator(): boolean;
    parseDecorators(this: Parser, allowExport?: boolean): N.Decorator[];
    parseDecorator(this: Parser): N.Decorator;
    parseMaybeDecoratorArguments(this: Parser, expr: N.Expression, startLoc: Position): N.Expression;
    parseBreakContinueStatement(node: Undone<N.Node>, isBreak: true): N.BreakStatement;
    parseBreakContinueStatement(node: Undone<N.Node>, isBreak: false): N.ContinueStatement;
    verifyBreakContinue(node: Undone<N.BreakStatement | N.ContinueStatement>, isBreak: boolean): void;
    parseDebuggerStatement(node: Undone<N.DebuggerStatement>): N.DebuggerStatement;
    parseHeaderExpression(this: Parser): N.Expression;
    parseDoWhileStatement(this: Parser, node: Undone<N.DoWhileStatement>): N.DoWhileStatement;
    parseForStatement(this: Parser, node: Undone<N.For>): N.For;
    parseFunctionStatement(this: Parser, node: Undone<N.FunctionDeclaration>, isAsync: boolean, isHangingDeclaration: boolean): N.FunctionDeclaration;
    parseIfStatement(this: Parser, node: Undone<N.IfStatement>): N.IfStatement;
    parseReturnStatement(this: Parser, node: Undone<N.ReturnStatement>): N.ReturnStatement;
    parseSwitchStatement(this: Parser, node: Undone<N.SwitchStatement>): N.SwitchStatement;
    parseThrowStatement(this: Parser, node: Undone<N.ThrowStatement>): N.ThrowStatement;
    parseCatchClauseParam(this: Parser): Exclude<ReturnType<typeof this.parseBindingAtom>, N.VoidPattern>;
    parseTryStatement(this: Parser, node: Undone<N.TryStatement>): N.TryStatement;
    parseVarStatement(this: Parser, node: Undone<N.VariableDeclaration>, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): N.VariableDeclaration;
    parseWhileStatement(this: Parser, node: Undone<N.WhileStatement>): N.WhileStatement;
    parseWithStatement(this: Parser, node: Undone<N.WithStatement>): N.WithStatement;
    parseEmptyStatement(node: Undone<N.EmptyStatement>): N.EmptyStatement;
    parseLabeledStatement(this: Parser, node: Undone<N.LabeledStatement>, maybeName: string, expr: N.Identifier, flags: ParseStatementFlag): N.LabeledStatement;
    parseExpressionStatement(node: Undone<N.ExpressionStatement>, expr: N.Expression): N.ExpressionStatement;
    parseBlock(this: Parser, allowDirectives?: boolean, createNewLexicalScope?: boolean, afterBlockParse?: (hasStrictModeDirective: boolean) => void): N.BlockStatement;
    isValidDirective(stmt: N.Statement): stmt is N.ExpressionStatement;
    parseBlockBody(this: Parser, node: Undone<N.BlockStatementLike>, allowDirectives: boolean | undefined | null, topLevel: boolean, end: TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
    parseBlockOrModuleBlockBody(this: Parser, body: N.Statement[], directives: N.Directive[] | undefined | null, topLevel: boolean, end: TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
    parseFor(this: Parser, node: Undone<N.ForStatement>, init?: N.VariableDeclaration | N.Expression | null): N.ForStatement;
    parseForX(this: Parser, node: Undone<N.ForXStatement>, init: N.VariableDeclaration | N.AssignmentPattern | N.Identifier | N.MemberExpression, awaitAt?: Position | null): N.ForXStatement;
    parseVar(this: Parser, node: Undone<N.VariableDeclaration>, isFor: boolean, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): Undone<N.VariableDeclaration>;
    parseVarId(this: Parser, decl: Undone<N.VariableDeclarator>, kind: "var" | "let" | "const" | "using" | "await using"): void;
    parseAsyncFunctionExpression(this: Parser, node: Undone<N.FunctionExpression>): N.FunctionExpression;
    parseFunction<T extends N.NormalFunction>(this: Parser, node: Undone<T>, flags?: ParseFunctionFlag): T;
    parseFunctionId(requireId?: boolean): N.Identifier | undefined | null;
    parseFunctionParams(this: Parser, node: Undone<N.Function>, isConstructor?: boolean): void;
    registerFunctionStatementId(node: N.NormalFunction): void;
    parseClass<T extends N.Class>(this: Parser, node: Undone<T>, isStatement: boolean, optionalId?: boolean): T;
    isClassProperty(): boolean;
    isClassMethod(): boolean;
    nameIsConstructor(key: N.Expression | N.PrivateName): boolean;
    isNonstaticConstructor(method: Undone<N.ClassMethod | N.ClassProperty>): boolean;
    parseClassBody(this: Parser, hadSuperClass: boolean, oldStrict: boolean): N.ClassBody;
    parseClassMemberFromModifier(this: Parser, classBody: Undone<N.ClassBody>, member: Undone<N.ClassMember>): boolean;
    parseClassMember(this: Parser, classBody: Undone<N.ClassBody>, member: Undone<N.ClassMember>, state: N.ParseClassMemberState): void;
    parseClassMemberWithIsStatic(this: Parser, classBody: Undone<N.ClassBody>, member: Undone<N.ClassMember>, state: N.ParseClassMemberState, isStatic: boolean): void;
    parseClassElementName(this: Parser, member: Undone<N.ClassMember>): N.Expression | N.Identifier | N.PrivateName;
    parseClassStaticBlock(this: Parser, classBody: Undone<N.ClassBody>, member: Undone<N.StaticBlock & {
        decorators?: N.Decorator[];
    }>): void;
    pushClassProperty(this: Parser, classBody: Undone<N.ClassBody>, prop: Undone<N.ClassProperty>): void;
    pushClassPrivateProperty(this: Parser, classBody: Undone<N.ClassBody>, prop: Undone<N.ClassPrivateProperty>): void;
    pushClassAccessorProperty(this: Parser, classBody: Undone<N.ClassBody>, prop: Undone<N.ClassAccessorProperty>, isPrivate: boolean): void;
    pushClassMethod(this: Parser, classBody: Undone<N.ClassBody>, method: Undone<N.ClassMethod>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowsDirectSuper: boolean): void;
    pushClassPrivateMethod(this: Parser, classBody: Undone<N.ClassBody>, method: Undone<N.ClassPrivateMethod>, isGenerator: boolean, isAsync: boolean): void;
    declareClassPrivateMethodInScope(node: Undone<N.ClassPrivateMethod | N.TSDeclareMethod>, kind: number): void;
    parsePostMemberNameModifiers(methodOrProp: Undone<N.ClassMethod | N.ClassProperty>): void;
    parseClassPrivateProperty(this: Parser, node: Undone<N.ClassPrivateProperty>): N.ClassPrivateProperty;
    parseClassProperty(this: Parser, node: Undone<N.ClassProperty>): N.ClassProperty;
    parseClassAccessorProperty(this: Parser, node: Undone<N.ClassAccessorProperty>): N.ClassAccessorProperty;
    parseInitializer(this: Parser, node: Undone<N.ClassProperty | N.ClassPrivateProperty | N.ClassAccessorProperty>): void;
    parseClassId(node: Undone<N.Class>, isStatement: boolean, optionalId?: boolean | null, bindingType?: BindingFlag): void;
    parseClassSuper(this: Parser, node: Undone<N.Class>): void;
    parseExport(this: Parser, node: Undone<N.ExportDefaultDeclaration | N.ExportAllDeclaration | N.ExportNamedDeclaration>, decorators: N.Decorator[] | null | undefined): N.AnyExport;
    eatExportStar(_: Undone<N.Node>): _ is Undone<N.ExportNamedDeclaration | N.ExportAllDeclaration>;
    maybeParseExportDefaultSpecifier(node: Undone<N.ExportDefaultDeclaration | N.ExportAllDeclaration | N.ExportNamedDeclaration>, maybeDefaultIdentifier: N.Identifier | null): node is Undone<N.ExportNamedDeclaration>;
    maybeParseExportNamespaceSpecifier(node: Undone<N.ExportNamedDeclaration | N.ExportAllDeclaration>): node is Undone<N.ExportNamedDeclaration>;
    maybeParseExportNamedSpecifiers(node: Undone<N.Node>): node is Undone<N.ExportNamedDeclaration>;
    maybeParseExportDeclaration(this: Parser, node: Undone<N.ExportNamedDeclaration>): boolean;
    isAsyncFunction(): boolean;
    parseExportDefaultExpression(this: Parser): N.ExportDefaultDeclaration["declaration"] | N.EnumDeclaration;
    parseExportDeclaration(this: Parser, node: Undone<N.ExportNamedDeclaration>): N.ExportNamedDeclaration["declaration"] | undefined;
    isExportDefaultSpecifier(): boolean;
    parseExportFrom(this: Parser, node: Undone<N.ExportNamedDeclaration | N.ExportAllDeclaration>, expect?: boolean): void;
    shouldParseExportDeclaration(): boolean;
    checkNamedExport(node: Undone<N.ExportNamedDeclaration>, isFrom?: boolean): void;
    checkDeclaration(node: N.Identifier | N.Pattern | N.RestElement | N.ObjectProperty): void;
    checkDuplicateExports(node: Undone<N.Identifier | N.StringLiteral | N.ExportNamedDeclaration | N.ExportSpecifier | N.ExportDefaultSpecifier>, exportName: string): void;
    parseExportSpecifiers(isInTypeExport: boolean): N.ExportSpecifier[];
    parseExportSpecifier(node: Undone<N.ExportSpecifier>, isString: boolean, isInTypeExport: boolean, isMaybeTypeOnly: boolean): N.ExportSpecifier;
    parseModuleExportName(): N.StringLiteral | N.Identifier;
    checkImportPhase(node: Undone<N.ImportDeclaration>): void;
    isPotentialImportPhase(isExport: boolean): boolean;
    applyImportPhase(node: Undone<N.ImportDeclaration | N.ExportNamedDeclaration>, isExport: boolean, phase: string | null, loc?: number): void;
    parseMaybeImportPhase(node: Undone<N.ImportDeclaration | N.TSImportEqualsDeclaration>, isExport: boolean): N.Identifier | null;
    isPrecedingIdImportPhase(phase: string): boolean;
    parseImport(this: Parser, node: Undone<N.ImportDeclaration>): N.AnyImport;
    parseImportSpecifiersAndAfter(this: Parser, node: Undone<N.ImportDeclaration>, maybeDefaultIdentifier: N.Identifier | null): N.ImportDeclaration;
    parseImportSourceAndAttributes(this: Parser, node: Undone<N.ImportDeclaration>): N.ImportDeclaration;
    parseImportSource(this: Parser): N.StringLiteral;
    parseImportSpecifierLocal<T extends N.ImportSpecifier | N.ImportDefaultSpecifier | N.ImportNamespaceSpecifier>(node: Undone<N.ImportDeclaration>, specifier: Undone<T>, type: T["type"]): void;
    finishImportSpecifier<T extends N.ImportSpecifier | N.ImportDefaultSpecifier | N.ImportNamespaceSpecifier>(specifier: Undone<T>, type: T["type"], bindingType?: BindingFlag): T;
    /**
     * parse assert entries
     *
     * @see {@link https://tc39.es/proposal-import-attributes/#prod-WithEntries WithEntries}
     */
    parseImportAttributes(): N.ImportAttribute[];
    maybeParseImportAttributes(node: Undone<N.ImportDeclaration | N.ExportNamedDeclaration | N.ExportAllDeclaration>): void;
    maybeParseDefaultImportSpecifier(node: Undone<N.ImportDeclaration>, maybeDefaultIdentifier: N.Identifier | null): boolean;
    maybeParseStarImportSpecifier(node: Undone<N.ImportDeclaration>): boolean;
    parseNamedImportSpecifiers(node: Undone<N.ImportDeclaration>): void;
    parseImportSpecifier(specifier: Undone<N.ImportSpecifier>, importedIsString: boolean, isInTypeOnlyImport: boolean, isMaybeTypeOnly: boolean, bindingType: BindingFlag | undefined): N.ImportSpecifier;
    isThisParam(param: N.Pattern | N.Identifier | N.TSParameterProperty | N.RestElement): boolean;
}
//# sourceMappingURL=statement.d.ts.map