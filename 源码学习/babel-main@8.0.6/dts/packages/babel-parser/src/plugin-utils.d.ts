import type { PluginConfig } from "./typings.d.ts";
export type Plugin = PluginConfig;
export declare function validatePlugins(pluginsMap: Map<string, any>): void;
export declare const mixinPlugins: {
    estree: (superClass: typeof import("./parser/index.ts").default) => {
        new (options: import("./index.ts").ParserOptions | undefined | null, input: string, pluginsMap: import("./parser/index.ts").PluginsMap): {
            createPosition(loc: import("./util/location.ts").Position): import("./util/location.ts").Position;
            parse(): import("./index.ts").ParseResult<import("@babel/types").File>;
            parseRegExpLiteral({ pattern, flags }: {
                pattern: any;
                flags: any;
            }): import("./types.ts").EstreeRegExpLiteral;
            parseBigIntLiteral(value: any): import("./types.ts").Node;
            estreeParseLiteral<T extends import("./types.ts").EstreeLiteral>(value: any): T;
            parseStringLiteral(value: any): import("./types.ts").EstreeLiteral;
            parseNumericLiteral(value: any): import("./types.ts").EstreeLiteral;
            parseNullLiteral(): import("./types.ts").EstreeLiteral;
            parseBooleanLiteral(value: boolean): import("@babel/types").BooleanLiteral;
            estreeParseChainExpression(node: import("@babel/types").Expression, endNode: import("./types.ts").Node): import("./types.ts").EstreeChainExpression;
            directiveToStmt(directive: import("@babel/types").Directive): import("@babel/types").ExpressionStatement;
            fillOptionalPropertiesForTSESLint(node: import("./types.ts").Node): void;
            cloneEstreeStringLiteral(node: import("./types.ts").EstreeLiteral): import("./types.ts").EstreeLiteral;
            initFunction(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isAsync: boolean): void;
            checkDeclaration(node: import("@babel/types").Pattern | import("@babel/types").ObjectProperty): void;
            getObjectOrClassMethodParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): import("@babel/types").FunctionParameter[];
            isValidDirective(stmt: import("@babel/types").Statement): stmt is import("@babel/types").ExpressionStatement;
            parseBlockBody(node: import("./types.ts").BlockStatementLike, allowDirectives: boolean | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parsePrivateName(): any;
            convertPrivateNameToPrivateIdentifier(node: import("@babel/types").PrivateName): import("./types.ts").EstreePrivateIdentifier;
            isPrivateName(node: import("./types.ts").Node): node is import("./types.ts").EstreePrivateIdentifier;
            getPrivateNameSV(node: import("./types.ts").EstreePrivateIdentifier): string;
            parseLiteral<T extends import("@babel/types").Literal>(value: any, type: T["type"]): T;
            parseFunctionBody(node: import("@babel/types").Function, allowExpression?: boolean | null, isMethod?: boolean): void;
            parseMethod<T extends import("@babel/types").ClassPrivateMethod | import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>(node: import("./parser/node.ts").Undone<T>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowDirectSuper: boolean, type: T["type"], inClassScope?: boolean): import("./types.ts").EstreeProperty | import("./types.ts").EstreeMethodDefinition | import("./types.ts").EstreeTSAbstractMethodDefinition;
            nameIsConstructor(key: import("@babel/types").Expression | import("@babel/types").PrivateName | import("./types.ts").EstreeLiteral): boolean;
            parseClassProperty(args_0: import("@babel/types").ClassProperty): any;
            parseClassPrivateProperty(args_0: import("@babel/types").ClassPrivateProperty): any;
            parseClassAccessorProperty(this: import("./parser/index.ts").default, node: import("@babel/types").ClassAccessorProperty): any;
            parseObjectProperty(prop: import("@babel/types").ObjectProperty, startLoc: import("./util/location.ts").Position | undefined | null, isPattern: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectProperty | undefined | null;
            finishObjectProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>): import("@babel/types").ObjectProperty;
            isValidLVal(type: string, disallowCallExpression: boolean, isUnparenthesizedInAssign: boolean, binding: import("./util/scopeflags.ts").BindingFlag): string | boolean | [string, boolean];
            isAssignable(node: import("./types.ts").Node, isBinding?: boolean): boolean;
            toAssignable(node: import("./types.ts").Node, isLHS?: boolean): void;
            toAssignableObjectExpressionProp(prop: import("./types.ts").Node, isLast: boolean, isLHS: boolean): void;
            finishCallExpression<T extends import("@babel/types").CallExpression | import("@babel/types").OptionalCallExpression>(unfinished: import("./parser/node.ts").Undone<T>, optional: boolean): T;
            parseExport(unfinished: import("./parser/node.ts").Undone<import("./types.ts").AnyExport>, decorators: import("@babel/types").Decorator[] | null): import("./types.ts").AnyExport;
            stopParseSubscript(base: import("@babel/types").Expression, state: import("./types.ts").ParseSubscriptState): import("./types.ts").EstreeChainExpression | import("@babel/types").Expression;
            parseMember(base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, computed: boolean, optional: boolean): import("@babel/types").MemberExpression | import("@babel/types").OptionalMemberExpression;
            isOptionalMemberExpression(node: import("./types.ts").Node): boolean;
            hasPropertyAsPrivateName(node: import("./types.ts").Node): boolean;
            isObjectProperty(node: import("./types.ts").Node): node is import("./types.ts").EstreeProperty;
            isObjectMethod(node: import("./types.ts").Node): node is import("./types.ts").EstreeProperty;
            castNodeTo<T extends import("./types.ts").Node["type"]>(node: import("./types.ts").Node, type: T): Extract<import("./types.ts").Node, {
                type: T;
            }>;
            cloneIdentifier<T extends import("@babel/types").Identifier | import("./types.ts").Placeholder>(node: T): T;
            cloneStringLiteral<T extends import("./types.ts").EstreeLiteral | import("@babel/types").StringLiteral | import("./types.ts").Placeholder>(node: T): T;
            finishNodeAt<T extends import("./types.ts").Node>(node: import("./parser/node.ts").Undone<T>, type: T["type"], endLoc: import("./util/location.ts").Position): T;
            finishNodeAtNode<T extends import("./types.ts").Node>(node: import("./parser/node.ts").Undone<T>, type: T["type"], endNode: import("./types.ts").Node): T;
            finishNode<T extends import("./types.ts").Node>(node: import("./parser/node.ts").Undone<T>, type: T["type"]): T;
            resetStartLocation(node: import("./types.ts").Node, startLoc: import("./util/location.ts").Position): void;
            resetEndLocation(node: import("./types.ts").BaseNode, endLoc?: import("./util/location.ts").Position): void;
            getScopeHandler(): new (...args: any) => import("./util/scope.ts").default;
            parseTopLevel(this: import("./parser/index.ts").default, file: import("./parser/node.ts").Undone<import("@babel/types").File>, program: import("./parser/node.ts").Undone<import("@babel/types").Program>): import("@babel/types").File;
            parseProgram(this: import("./parser/index.ts").default, program: import("./parser/node.ts").Undone<import("@babel/types").Program>, end: import("./tokenizer/types.ts").TokenType, sourceType: import("@babel/types").Program["sourceType"]): import("@babel/types").Program;
            stmtToDirective(stmt: import("@babel/types").ExpressionStatement): import("@babel/types").Directive;
            parseInterpreterDirective(): import("@babel/types").InterpreterDirective | null;
            isLet(): boolean;
            isUsing(): boolean;
            isForUsing(): boolean;
            nextTokenIsIdentifierOnSameLine(): boolean;
            isAwaitUsing(): boolean;
            chStartsBindingIdentifier(ch: number, pos: number): boolean;
            chStartsBindingPattern(ch: number): ch is 91 | 123;
            hasFollowingBindingAtom(): boolean;
            hasInLineFollowingBindingIdentifierOrBrace(): boolean;
            allowsUsing(): boolean;
            parseModuleItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementListItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementOrSloppyAnnexBFunctionDeclaration(this: import("./parser/index.ts").default, allowLabeledFunction?: boolean): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatement(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementLike(this: import("./parser/index.ts").default, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").Statement | import("@babel/types").Declaration | import("@babel/types").ImportDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration;
            parseStatementContent(this: import("./parser/index.ts").default, flags: import("./parser/statement.ts").ParseStatementFlag, decorators?: import("@babel/types").Decorator[] | null): import("@babel/types").Statement;
            assertModuleNodeAllowed(node: import("./types.ts").Node): void;
            maybeTakeDecorators<T extends import("./parser/node.ts").Undone<import("@babel/types").Class>>(maybeDecorators: import("@babel/types").Decorator[] | null | undefined, classNode: T, exportNode?: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration>): T;
            canHaveLeadingDecorator(): boolean;
            parseDecorators(this: import("./parser/index.ts").default, allowExport?: boolean): import("@babel/types").Decorator[];
            parseDecorator(this: import("./parser/index.ts").default): import("@babel/types").Decorator;
            parseMaybeDecoratorArguments(this: import("./parser/index.ts").default, expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position): import("@babel/types").Expression;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: true): import("@babel/types").BreakStatement;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: false): import("@babel/types").ContinueStatement;
            verifyBreakContinue(node: import("./parser/node.ts").Undone<import("@babel/types").BreakStatement | import("@babel/types").ContinueStatement>, isBreak: boolean): void;
            parseDebuggerStatement(node: import("./parser/node.ts").Undone<import("@babel/types").DebuggerStatement>): import("@babel/types").DebuggerStatement;
            parseHeaderExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            parseDoWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoWhileStatement>): import("@babel/types").DoWhileStatement;
            parseForStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").For>): import("@babel/types").For;
            parseFunctionStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionDeclaration>, isAsync: boolean, isHangingDeclaration: boolean): import("@babel/types").FunctionDeclaration;
            parseIfStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").IfStatement>): import("@babel/types").IfStatement;
            parseReturnStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ReturnStatement>): import("@babel/types").ReturnStatement;
            parseSwitchStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").SwitchStatement>): import("@babel/types").SwitchStatement;
            parseThrowStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ThrowStatement>): import("@babel/types").ThrowStatement;
            parseCatchClauseParam(this: import("./parser/index.ts").default): Exclude<ReturnType<typeof this.parseBindingAtom>, import("@babel/types").VoidPattern>;
            parseTryStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").TryStatement>): import("@babel/types").TryStatement;
            parseVarStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("@babel/types").VariableDeclaration;
            parseWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WhileStatement>): import("@babel/types").WhileStatement;
            parseWithStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WithStatement>): import("@babel/types").WithStatement;
            parseEmptyStatement(node: import("./parser/node.ts").Undone<import("@babel/types").EmptyStatement>): import("@babel/types").EmptyStatement;
            parseLabeledStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").LabeledStatement>, maybeName: string, expr: import("@babel/types").Identifier, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").LabeledStatement;
            parseExpressionStatement(node: import("./parser/node.ts").Undone<import("@babel/types").ExpressionStatement>, expr: import("@babel/types").Expression): import("@babel/types").ExpressionStatement;
            parseBlock(this: import("./parser/index.ts").default, allowDirectives?: boolean, createNewLexicalScope?: boolean, afterBlockParse?: (hasStrictModeDirective: boolean) => void): import("@babel/types").BlockStatement;
            parseBlockOrModuleBlockBody(this: import("./parser/index.ts").default, body: import("@babel/types").Statement[], directives: import("@babel/types").Directive[] | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseFor(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForStatement>, init?: import("@babel/types").VariableDeclaration | import("@babel/types").Expression | null): import("@babel/types").ForStatement;
            parseForX(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForXStatement>, init: import("@babel/types").VariableDeclaration | import("@babel/types").AssignmentPattern | import("@babel/types").Identifier | import("@babel/types").MemberExpression, awaitAt?: import("./util/location.ts").Position | null): import("@babel/types").ForXStatement;
            parseVar(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, isFor: boolean, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>;
            parseVarId(this: import("./parser/index.ts").default, decl: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclarator>, kind: "var" | "let" | "const" | "using" | "await using"): void;
            parseAsyncFunctionExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionExpression>): import("@babel/types").FunctionExpression;
            parseFunction<T extends import("./types.ts").NormalFunction>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, flags?: import("./parser/statement.ts").ParseFunctionFlag): T;
            parseFunctionId(requireId?: boolean): import("@babel/types").Identifier | undefined | null;
            parseFunctionParams(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isConstructor?: boolean): void;
            registerFunctionStatementId(node: import("./types.ts").NormalFunction): void;
            parseClass<T extends import("@babel/types").Class>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, isStatement: boolean, optionalId?: boolean): T;
            isClassProperty(): boolean;
            isClassMethod(): boolean;
            isNonstaticConstructor(method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty>): boolean;
            parseClassBody(this: import("./parser/index.ts").default, hadSuperClass: boolean, oldStrict: boolean): import("@babel/types").ClassBody;
            parseClassMemberFromModifier(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): boolean;
            parseClassMember(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>, state: import("./types.ts").ParseClassMemberState): void;
            parseClassMemberWithIsStatic(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>, state: import("./types.ts").ParseClassMemberState, isStatic: boolean): void;
            parseClassElementName(this: import("./parser/index.ts").default, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): import("@babel/types").Expression | import("@babel/types").Identifier | import("@babel/types").PrivateName;
            parseClassStaticBlock(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("@babel/types").StaticBlock & {
                decorators?: import("@babel/types").Decorator[];
            }>): void;
            pushClassProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty>): void;
            pushClassPrivateProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateProperty>): void;
            pushClassAccessorProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>, isPrivate: boolean): void;
            pushClassMethod(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowsDirectSuper: boolean): void;
            pushClassPrivateMethod(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod>, isGenerator: boolean, isAsync: boolean): void;
            declareClassPrivateMethodInScope(node: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod | import("@babel/types").TSDeclareMethod>, kind: number): void;
            parsePostMemberNameModifiers(methodOrProp: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty>): void;
            parseInitializer(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty | import("@babel/types").ClassPrivateProperty | import("@babel/types").ClassAccessorProperty>): void;
            parseClassId(node: import("./parser/node.ts").Undone<import("@babel/types").Class>, isStatement: boolean, optionalId?: boolean | null, bindingType?: import("./util/scopeflags.ts").BindingFlag): void;
            parseClassSuper(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Class>): void;
            eatExportStar(_: import("./parser/node.ts").Undone<import("./types.ts").Node>): _ is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>;
            maybeParseExportDefaultSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportNamespaceSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportNamedSpecifiers(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportDeclaration(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>): boolean;
            isAsyncFunction(): boolean;
            parseExportDefaultExpression(this: import("./parser/index.ts").default): import("@babel/types").ExportDefaultDeclaration["declaration"] | import("@babel/types").EnumDeclaration;
            parseExportDeclaration(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>): import("@babel/types").ExportNamedDeclaration["declaration"] | undefined;
            isExportDefaultSpecifier(): boolean;
            parseExportFrom(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>, expect?: boolean): void;
            shouldParseExportDeclaration(): boolean;
            checkNamedExport(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>, isFrom?: boolean): void;
            checkDuplicateExports(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier | import("@babel/types").StringLiteral | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportSpecifier | import("@babel/types").ExportDefaultSpecifier>, exportName: string): void;
            parseExportSpecifiers(isInTypeExport: boolean): import("@babel/types").ExportSpecifier[];
            parseExportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportSpecifier>, isString: boolean, isInTypeExport: boolean, isMaybeTypeOnly: boolean): import("@babel/types").ExportSpecifier;
            parseModuleExportName(): import("@babel/types").StringLiteral | import("@babel/types").Identifier;
            checkImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            isPotentialImportPhase(isExport: boolean): boolean;
            applyImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration>, isExport: boolean, phase: string | null, loc?: number): void;
            parseMaybeImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").TSImportEqualsDeclaration>, isExport: boolean): import("@babel/types").Identifier | null;
            isPrecedingIdImportPhase(phase: string): boolean;
            parseImport(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("./types.ts").AnyImport;
            parseImportSpecifiersAndAfter(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): import("@babel/types").ImportDeclaration;
            parseImportSourceAndAttributes(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("@babel/types").ImportDeclaration;
            parseImportSource(this: import("./parser/index.ts").default): import("@babel/types").StringLiteral;
            parseImportSpecifierLocal<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, specifier: import("./parser/node.ts").Undone<T>, type: T["type"]): void;
            finishImportSpecifier<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(specifier: import("./parser/node.ts").Undone<T>, type: T["type"], bindingType?: import("./util/scopeflags.ts").BindingFlag): T;
            parseImportAttributes(): import("@babel/types").ImportAttribute[];
            maybeParseImportAttributes(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): void;
            maybeParseDefaultImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): boolean;
            maybeParseStarImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): boolean;
            parseNamedImportSpecifiers(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            parseImportSpecifier(specifier: import("./parser/node.ts").Undone<import("@babel/types").ImportSpecifier>, importedIsString: boolean, isInTypeOnlyImport: boolean, isMaybeTypeOnly: boolean, bindingType: import("./util/scopeflags.ts").BindingFlag | undefined): import("@babel/types").ImportSpecifier;
            isThisParam(param: import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty | import("@babel/types").RestElement): boolean;
            checkProto(prop: import("./types.ts").ObjectMember | import("@babel/types").SpreadElement, sawProto: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): boolean;
            shouldExitDescending(expr: import("@babel/types").Expression | import("@babel/types").PrivateName | import("@babel/types").Super | import("@babel/types").Import): expr is import("@babel/types").ArrowFunctionExpression;
            getExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression & import("./types.ts").ParserOutput;
            parseExpression(this: import("./parser/index.ts").default, disallowIn?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExpressionBase(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseMaybeAssignDisallowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            setOptionalParametersError(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            parseMaybeAssign(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssign(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeConditional(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseConditional(this: import("./parser/index.ts").default, expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeUnaryOrPrivate(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression | import("@babel/types").PrivateName;
            parseExprOps(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExprOp(this: import("./parser/index.ts").default, left: import("@babel/types").Expression | import("@babel/types").PrivateName, leftStartLoc: import("./util/location.ts").Position, minPrec: number): import("@babel/types").Expression;
            parseExprOpRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseExprOpBaseRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseHackPipeBody(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            checkExponentialAfterUnary(node: import("@babel/types").AwaitExpression | import("./parser/node.ts").Undone<import("@babel/types").UnaryExpression>): void;
            parseMaybeUnary(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, sawUnary?: boolean): import("@babel/types").Expression;
            parseUpdate(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").UpdateExpression>, update: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseExprSubscripts(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: false | null): import("@babel/types").Expression;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls: true): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: boolean | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscript(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls: boolean | undefined | null, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseBind(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseCoverCallAndAsyncArrowHead(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, optional: boolean): import("@babel/types").Expression;
            parseTaggedTemplateExpression(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").TaggedTemplateExpression;
            atPossibleAsyncArrow(base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import): boolean;
            parseCallExpressionArguments(this: import("./parser/index.ts").default, allowPlaceholder?: boolean, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): (import("@babel/types").Expression | import("@babel/types").SpreadElement)[];
            shouldParseAsyncArrow(): boolean;
            parseAsyncArrowFromCallExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, call: import("@babel/types").CallExpression): import("@babel/types").ArrowFunctionExpression;
            parseNoCallExpr(this: import("./parser/index.ts").default, onUnparenthesizedImportExpression: (base: import("@babel/types").ImportExpression) => void): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseExprAtom(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseTopicReferenceThenEqualsSign(topicTokenType: import("./tokenizer/types.ts").TokenType, topicTokenValue: string): import("@babel/types").Expression;
            parseTopicReference(pipeProposal: string): import("@babel/types").Expression;
            finishTopicReference(node: import("./parser/node.ts").Undone<import("@babel/types").TopicReference>, startLoc: import("./util/location.ts").Position, pipeProposal: string, tokenType: import("./tokenizer/types.ts").TokenType): import("@babel/types").TopicReference;
            testTopicReferenceConfiguration(pipeProposal: string, startLoc: import("./util/location.ts").Position, tokenType: import("./tokenizer/types.ts").TokenType): boolean;
            parseAsyncArrowUnaryFunction(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("@babel/types").ArrowFunctionExpression;
            parseDo(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoExpression>, isAsync: boolean): import("@babel/types").DoExpression;
            parseSuper(): import("@babel/types").Super;
            parseFunctionOrFunctionSent(this: import("./parser/index.ts").default): import("@babel/types").FunctionExpression | import("@babel/types").MetaProperty;
            parseMetaProperty(node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty>, meta: import("@babel/types").Identifier, propertyName: string): import("@babel/types").MetaProperty;
            parseImportMetaPropertyOrPhaseCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty | import("@babel/types").ImportExpression>): import("@babel/types").MetaProperty | import("@babel/types").ImportExpression;
            parseLiteralAtNode<T extends import("./types.ts").Node>(value: any, type: T["type"], node: any): T;
            parseParenAndDistinguishExpression(this: import("./parser/index.ts").default, canStartArrow: boolean): import("@babel/types").Expression;
            wrapParenthesis(startLoc: import("./util/location.ts").Position, expression: import("@babel/types").Expression): import("@babel/types").Expression;
            shouldParseArrow(params: import("./types.ts").Node[]): boolean;
            parseArrow(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression> | undefined | null;
            parseParenItem<T extends import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").SpreadElement | import("./types.ts").TSTypeCastExpression>(node: T, startLoc: import("./util/location.ts").Position): T | import("@babel/types").TypeCastExpression | import("./types.ts").TSTypeCastExpression;
            parseNewOrNewTarget(this: import("./parser/index.ts").default): import("@babel/types").NewExpression | import("@babel/types").MetaProperty;
            parseNew(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").NewExpression>): import("@babel/types").NewExpression;
            parseNewCallee(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").NewExpression>): void;
            parseTemplateElement(isTagged: boolean): import("@babel/types").TemplateElement;
            parseTemplate(this: import("./parser/index.ts").default, isTagged: boolean): import("@babel/types").TemplateLiteral;
            parseTemplateSubstitution(this: import("./parser/index.ts").default): import("@babel/types").Expression | import("@babel/types").TSType;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: true, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectPattern;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectExpression;
            addTrailingCommaExtraToNode(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): void;
            maybeAsyncOrAccessorProp(prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty | import("@babel/types").ObjectMethod>): prop is typeof prop & {
                key: import("@babel/types").Identifier;
            };
            parsePropertyDefinition(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("./types.ts").ObjectMember | import("@babel/types").SpreadElement;
            getGetterSetterExpectedParamCount(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): number;
            checkGetterSetterParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): void;
            parseObjectMethod(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod>, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean): import("@babel/types").ObjectMethod | undefined | null;
            parseObjPropValue<T extends import("./types.ts").ObjectMember>(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<T>, startLoc: import("./util/location.ts").Position | undefined | null, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): T;
            parsePropertyName(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember> | import("@babel/types").TSPropertySignature | import("@babel/types").TSMethodSignature, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): void;
            parseArrayLike(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ArrayExpression;
            parseArrowExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | null | undefined, isAsync: boolean, trailingCommaLoc?: import("./util/location.ts").Position | null): import("@babel/types").ArrowFunctionExpression;
            setArrowFunctionParameters(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[], trailingCommaLoc?: import("./util/location.ts").Position | null): void;
            parseFunctionBodyAndFinish<T extends import("@babel/types").Function | import("@babel/types").TSDeclareMethod | import("@babel/types").TSDeclareFunction | import("@babel/types").ClassPrivateMethod>(node: import("./parser/node.ts").Undone<T>, type: T["type"], isMethod?: boolean): T;
            isSimpleParameter(node: import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty): boolean;
            isSimpleParamList(params: readonly (import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty)[]): boolean;
            checkParams(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, allowDuplicates: boolean, isArrowFunction?: boolean | null, strictModeChanged?: boolean): void;
            parseExprList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null): (import("@babel/types").Expression | null)[];
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression | null;
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression;
            parseIdentifier(liberal?: boolean): import("@babel/types").Identifier;
            createIdentifier(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string): import("@babel/types").Identifier;
            createIdentifierAt(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string, endLoc: import("./util/location.ts").Position): import("@babel/types").Identifier;
            parseIdentifierName(liberal?: boolean): string;
            checkReservedWord(word: string, startLoc: number, checkKeywords: boolean, isBinding: boolean): void;
            recordAwaitIfAllowed(): boolean;
            parseAwait(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position, soloAwait?: boolean): import("@babel/types").AwaitExpression;
            isAmbiguousPrefixOrIdentifier(): boolean;
            parseYield(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position): import("@babel/types").YieldExpression;
            parseImportCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportExpression>): import("@babel/types").ImportExpression;
            withTopicBindingContext<T>(callback: () => T): T;
            allowInAnd<T>(callback: () => T): T;
            disallowInAnd<T>(callback: () => T): T;
            registerTopicReference(): void;
            topicReferenceIsAllowedInCurrentContext(): boolean;
            topicReferenceWasUsedInCurrentContext(): boolean;
            parseFSharpPipelineBody(this: import("./parser/index.ts").default, prec: number): import("@babel/types").Expression;
            parseModuleExpression(this: import("./parser/index.ts").default): import("@babel/types").ModuleExpression;
            parseVoidPattern(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").VoidPattern;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parsePropertyNamePrefixOperator(prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember>): void;
            toAssignableList(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[], trailingCommaLoc: import("./util/location.ts").Position | undefined | null, isLHS: boolean): void;
            toAssignableListItem(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression)[], index: number, isLHS: boolean): void;
            toReferencedList(exprList: readonly (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[] | readonly (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression | null)[], isParenthesizedExpr?: boolean): readonly (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[] | readonly (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression | null)[];
            parseSpread(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").SpreadElement;
            parseRestBinding(this: import("./parser/index.ts").default): import("@babel/types").RestElement;
            parseBindingAtom(this: import("./parser/index.ts").default): import("@babel/types").ArrayPattern | import("@babel/types").ObjectPattern | import("@babel/types").VoidPattern | import("@babel/types").Identifier;
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.ALLOW_EMPTY): (import("@babel/types").Pattern | import("@babel/types").RestElement | null)[];
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.IS_FUNCTION_PARAMS): (import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").TSParameterProperty)[];
            parseBindingRestProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").RestElement>): import("@babel/types").RestElement;
            parseBindingProperty(this: import("./parser/index.ts").default): import("./types.ts").AssignmentProperty | import("@babel/types").RestElement;
            parseBindingElement(this: import("./parser/index.ts").default, flags: import("./parser/lval.ts").ParseBindingListFlags, decorators: import("@babel/types").Decorator[]): import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty;
            parseFunctionParamType<T extends import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").RestElement>(param: T): T;
            parseMaybeDefault<P extends import("@babel/types").Pattern | import("@babel/types").Identifier>(this: import("./parser/index.ts").default, startLoc?: import("./util/location.ts").Position | null, left?: P | null): P | import("@babel/types").AssignmentPattern;
            checkLVal(expression: import("@babel/types").Expression | import("./types.ts").ObjectMember | import("@babel/types").RestElement | import("@babel/types").Pattern | import("@babel/types").TSParameterProperty | import("./types.ts").TSTypeCastExpression, ancestor: import("./parse-error.ts").LValAncestor, binding?: import("./util/scopeflags.ts").BindingFlag, checkClashes?: Set<string> | false, strictModeChanged?: boolean, hasParenthesizedAncestor?: boolean, disallowCallExpression?: boolean): void;
            checkIdentifier(at: import("@babel/types").Identifier, bindingType: import("./util/scopeflags.ts").BindingFlag, strictModeChanged?: boolean): void;
            declareNameFromIdentifier(identifier: import("@babel/types").Identifier, binding: import("./util/scopeflags.ts").BindingFlag): void;
            checkToRestConversion(node: import("./types.ts").Node, allowPattern: boolean): void;
            checkCommaAfterRest(close: typeof import("charcodes")[keyof typeof import("charcodes")]): boolean;
            startNode<T extends import("./types.ts").Node = never>(): import("./parser/node.ts").Undone<T>;
            startNodeAt<T extends import("./types.ts").Node = never>(loc: import("./util/location.ts").Position): import("./parser/node.ts").Undone<T>;
            startNodeAtNode<T extends import("./types.ts").Node = never>(type: import("./parser/node.ts").Undone<import("./types.ts").Node>): import("./parser/node.ts").Undone<T>;
            resetStartLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            resetEndLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            addExtra(node: Partial<import("./types.ts").Node>, key: string, value: any, enumerable?: boolean): void;
            isContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            isUnparsedContextual(nameStart: number, name: string): boolean;
            isLookaheadContextual(name: string): boolean;
            eatContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            expectContextual(token: import("./tokenizer/types.ts").TokenType, toParseError?: import("./parse-error.ts").ParseErrorConstructor<any>): void;
            canInsertSemicolon(): boolean;
            hasPrecedingLineBreak(): boolean;
            hasFollowingLineBreak(): boolean;
            isLineTerminator(): boolean;
            semicolon(allowAsi?: boolean): void;
            expect(type: import("./tokenizer/types.ts").TokenType, loc?: import("./util/location.ts").Position | null): void;
            tryParse<T extends import("./types.ts").Node | readonly import("./types.ts").Node[] | null>(fn: (abort: (node?: T) => never) => T, oldState?: import("./tokenizer/state.ts").default): {
                node: T;
                error: null;
                thrown: false;
                aborted: false;
                failState: null;
            } | {
                node: T | null;
                error: import("./parse-error.ts").ParseError;
                thrown: boolean;
                aborted: false;
                failState: import("./tokenizer/state.ts").default;
            } | {
                node: T | null;
                error: null;
                thrown: false;
                aborted: true;
                failState: import("./tokenizer/state.ts").default;
            };
            checkExpressionErrors(refExpressionErrors: import("./parser/util.ts").ExpressionErrors | undefined | null, andThrow: boolean): boolean | undefined;
            isLiteralPropertyName(): boolean;
            initializeScopes(this: import("./parser/index.ts").default, inModule?: boolean): () => void;
            enterInitialScopes(): void;
            checkDestructuringPrivate(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            isLookahead: boolean;
            tokens: (import("./index.ts").Token | import("./types.ts").Comment)[];
            setLoc(loc: import("./util/location.ts").Position): void;
            getLoc(locIndex: number): import("./util/location.ts").Position;
            pushToken(token: import("./index.ts").Token | import("./types.ts").Comment): void;
            next(): void;
            eat(type: import("./tokenizer/types.ts").TokenType): boolean;
            match(type: import("./tokenizer/types.ts").TokenType): boolean;
            createLookaheadState(state: import("./tokenizer/state.ts").default): import("./tokenizer/state.ts").LookaheadState;
            lookahead(): import("./tokenizer/state.ts").LookaheadState;
            nextTokenStart(): number;
            nextTokenStartSince(pos: number): number;
            lookaheadCharCode(): number;
            lookaheadCharCodeSince(pos: number): number;
            nextTokenInLineStart(): number;
            nextTokenInLineStartSince(pos: number): number;
            lookaheadInLineCharCode(): number;
            codePointAtPos(pos: number): number;
            setStrict(strict: boolean): void;
            curContext(): import("./tokenizer/context.ts").TokContext;
            nextToken(): void;
            skipBlockComment(commentEnd: "*/" | "*-/"): import("./types.ts").CommentBlock | undefined;
            skipLineComment(startSkip: number): import("./types.ts").CommentLine | undefined;
            skipSpace(): void;
            finishToken(type: import("./tokenizer/types.ts").TokenType, val?: any): void;
            replaceToken(type: import("./tokenizer/types.ts").TokenType): void;
            readToken_numberSign(): void;
            readToken_dot(): void;
            readToken_slash(): void;
            readToken_interpreter(): boolean;
            readToken_mult_modulo(code: number): void;
            readToken_pipe_amp(code: number): void;
            readToken_caret(): void;
            readToken_atSign(): void;
            readToken_plus_min(code: number): void;
            readToken_lt(): void;
            readToken_gt(): void;
            readToken_eq_excl(code: number): void;
            readToken_question(): void;
            getTokenFromCode(code: number): void;
            finishOp(type: import("./tokenizer/types.ts").TokenType, size: number): void;
            readRegexp(): void;
            readInt(radix: number, len?: number, forceLen?: boolean, allowNumSeparator?: boolean | "bail"): number | null;
            readRadixNumber(radix: number): void;
            readNumber(startsWithDot: boolean): void;
            readCodePoint(throwOnInvalid: boolean): number | null;
            readString(quote: number): void;
            readTemplateContinuation(): void;
            readTemplateToken(): void;
            recordStrictModeErrors(toParseError: import("./tokenizer/state.ts").DeferredStrictError, at: import("./util/location.ts").Position): void;
            readWord1(firstCode?: number): string;
            readWord(firstCode?: number): void;
            checkKeywordEscapes(): void;
            raise<ErrorDetails = object>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node> | number, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            raiseOverwrite<ErrorDetails>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node>, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            updateContext(prevType?: import("./tokenizer/types.ts").TokenType): void;
            unexpected(loc?: import("./util/location.ts").Position | number | null, type?: import("./tokenizer/types.ts").TokenType): any;
            expectPlugin(pluginName: import("./typings.d.ts").Plugin, loc?: import("./util/location.ts").Position | number | null): true;
            expectOnePlugin(pluginNames: import("./typings.d.ts").Plugin[]): any;
            errorBuilder(error: import("./parse-error.ts").ParseErrorConstructor<object>): (pos: number, lineStart: number, curLine: number) => void;
            errorHandlers_readInt: import("@babel/helper-string-parser").IntErrorHandlers;
            errorHandlers_readCodePoint: import("@babel/helper-string-parser").CodePointErrorHandlers;
            errorHandlers_readStringContents_string: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            errorHandlers_readStringContents_template: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            addComment(comment: import("./types.ts").Comment): void;
            processComment(node: import("./types.ts").Node): void;
            finalizeComment(commentWS: import("./parser/comments.ts").CommentWhitespace): void;
            finalizeRemainingComments(): void;
            resetPreviousNodeTrailingComments(node: import("./types.ts").Node): void;
            takeSurroundingComments(node: import("./types.ts").Node, start: number, end: number): void;
            options: import("./options.ts").Options;
            optionFlags: import("./options.ts").OptionFlags;
            inModule: boolean;
            scope: import("./util/scope.ts").default<any>;
            classScope: import("./util/class-scope.ts").default;
            prodParam: import("./util/production-parameter.ts").default;
            expressionScope: import("./util/expression-scope.ts").default;
            plugins: import("./parser/index.ts").PluginsMap;
            filename: string | undefined | null;
            startIndex: number;
            exportedIdentifiers: Set<string>;
            sawUnambiguousESM: boolean;
            ambiguousScriptDifferentAst: boolean;
            state: import("./tokenizer/state.ts").default;
            input: string;
            length: number;
            comments: import("./types.ts").Comment[];
            locData: Uint32Array;
            sourceToOffsetPos(sourcePos: number): number;
            offsetToSourcePos(offsetPos: number): number;
            hasPlugin(pluginConfig: PluginConfig): boolean;
            getPluginOption<PluginName extends import("./typings.d.ts").ParserPluginWithOptions[0], OptionName extends keyof import("./typings.d.ts").PluginOptions<PluginName>>(plugin: PluginName, name: OptionName): NonNullable<import("./typings.d.ts").PluginOptions<PluginName>>[OptionName] | undefined;
        };
    };
    jsx: (superClass: typeof import("./parser/index.ts").default) => {
        new (options: import("./index.ts").ParserOptions | undefined | null, input: string, pluginsMap: import("./parser/index.ts").PluginsMap): {
            jsxReadToken(): void;
            jsxReadNewLine(normalizeCRLF: boolean): string;
            jsxReadString(quote: number): void;
            jsxReadEntity(): string;
            jsxReadWord(): void;
            jsxParseIdentifier(): import("@babel/types").JSXIdentifier;
            jsxParseNamespacedName(): import("@babel/types").JSXNamespacedName | import("@babel/types").JSXIdentifier;
            jsxParseElementName(): import("@babel/types").JSXIdentifier | import("@babel/types").JSXNamespacedName | import("@babel/types").JSXMemberExpression;
            jsxParseAttributeValue(): import("@babel/types").JSXExpressionContainer | import("@babel/types").JSXElement | import("@babel/types").StringLiteral;
            jsxParseEmptyExpression(): import("@babel/types").JSXEmptyExpression;
            jsxParseSpreadChild(node: import("./parser/node.ts").Undone<import("@babel/types").JSXSpreadChild>): import("@babel/types").JSXSpreadChild;
            jsxParseExpressionContainer(node: import("./parser/node.ts").Undone<import("@babel/types").JSXExpressionContainer>, previousContext: import("./tokenizer/context.ts").TokContext): import("@babel/types").JSXExpressionContainer;
            jsxParseAttribute(): import("@babel/types").JSXAttribute | import("@babel/types").JSXSpreadAttribute;
            jsxParseOpeningElementAt(startLoc: import("./util/location.ts").Position): import("@babel/types").JSXOpeningElement | import("@babel/types").JSXOpeningFragment;
            jsxParseOpeningElementAfterName(node: import("./parser/node.ts").Undone<import("@babel/types").JSXOpeningElement>): import("@babel/types").JSXOpeningElement;
            jsxParseClosingElementAt(startLoc: import("./util/location.ts").Position): import("@babel/types").JSXClosingElement | import("@babel/types").JSXClosingFragment;
            jsxParseElementAt(startLoc: import("./util/location.ts").Position): import("@babel/types").JSXElement | import("@babel/types").JSXFragment;
            jsxParseElement(): import("@babel/types").JSXElement | import("@babel/types").JSXFragment;
            setContext(newContext: import("./tokenizer/context.ts").TokContext): void;
            parseExprAtom(refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Import | import("@babel/types").Super | import("@babel/types").Expression;
            skipSpace(): void;
            getTokenFromCode(code: number): void;
            updateContext(prevType?: import("./tokenizer/types.ts").TokenType): void;
            getScopeHandler(): new (...args: any) => import("./util/scope.ts").default;
            parse(): import("./index.ts").ParseResult<import("@babel/types").File>;
            parseTopLevel(this: import("./parser/index.ts").default, file: import("./parser/node.ts").Undone<import("@babel/types").File>, program: import("./parser/node.ts").Undone<import("@babel/types").Program>): import("@babel/types").File;
            parseProgram(this: import("./parser/index.ts").default, program: import("./parser/node.ts").Undone<import("@babel/types").Program>, end: import("./tokenizer/types.ts").TokenType, sourceType: import("@babel/types").Program["sourceType"]): import("@babel/types").Program;
            stmtToDirective(stmt: import("@babel/types").ExpressionStatement): import("@babel/types").Directive;
            parseInterpreterDirective(): import("@babel/types").InterpreterDirective | null;
            isLet(): boolean;
            isUsing(): boolean;
            isForUsing(): boolean;
            nextTokenIsIdentifierOnSameLine(): boolean;
            isAwaitUsing(): boolean;
            chStartsBindingIdentifier(ch: number, pos: number): boolean;
            chStartsBindingPattern(ch: number): ch is 91 | 123;
            hasFollowingBindingAtom(): boolean;
            hasInLineFollowingBindingIdentifierOrBrace(): boolean;
            allowsUsing(): boolean;
            parseModuleItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementListItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementOrSloppyAnnexBFunctionDeclaration(this: import("./parser/index.ts").default, allowLabeledFunction?: boolean): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatement(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementLike(this: import("./parser/index.ts").default, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").Statement | import("@babel/types").Declaration | import("@babel/types").ImportDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration;
            parseStatementContent(this: import("./parser/index.ts").default, flags: import("./parser/statement.ts").ParseStatementFlag, decorators?: import("@babel/types").Decorator[] | null): import("@babel/types").Statement;
            assertModuleNodeAllowed(node: import("./types.ts").Node): void;
            maybeTakeDecorators<T extends import("./parser/node.ts").Undone<import("@babel/types").Class>>(maybeDecorators: import("@babel/types").Decorator[] | null | undefined, classNode: T, exportNode?: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration>): T;
            canHaveLeadingDecorator(): boolean;
            parseDecorators(this: import("./parser/index.ts").default, allowExport?: boolean): import("@babel/types").Decorator[];
            parseDecorator(this: import("./parser/index.ts").default): import("@babel/types").Decorator;
            parseMaybeDecoratorArguments(this: import("./parser/index.ts").default, expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position): import("@babel/types").Expression;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: true): import("@babel/types").BreakStatement;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: false): import("@babel/types").ContinueStatement;
            verifyBreakContinue(node: import("./parser/node.ts").Undone<import("@babel/types").BreakStatement | import("@babel/types").ContinueStatement>, isBreak: boolean): void;
            parseDebuggerStatement(node: import("./parser/node.ts").Undone<import("@babel/types").DebuggerStatement>): import("@babel/types").DebuggerStatement;
            parseHeaderExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            parseDoWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoWhileStatement>): import("@babel/types").DoWhileStatement;
            parseForStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").For>): import("@babel/types").For;
            parseFunctionStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionDeclaration>, isAsync: boolean, isHangingDeclaration: boolean): import("@babel/types").FunctionDeclaration;
            parseIfStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").IfStatement>): import("@babel/types").IfStatement;
            parseReturnStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ReturnStatement>): import("@babel/types").ReturnStatement;
            parseSwitchStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").SwitchStatement>): import("@babel/types").SwitchStatement;
            parseThrowStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ThrowStatement>): import("@babel/types").ThrowStatement;
            parseCatchClauseParam(this: import("./parser/index.ts").default): Exclude<ReturnType<typeof this.parseBindingAtom>, import("@babel/types").VoidPattern>;
            parseTryStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").TryStatement>): import("@babel/types").TryStatement;
            parseVarStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("@babel/types").VariableDeclaration;
            parseWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WhileStatement>): import("@babel/types").WhileStatement;
            parseWithStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WithStatement>): import("@babel/types").WithStatement;
            parseEmptyStatement(node: import("./parser/node.ts").Undone<import("@babel/types").EmptyStatement>): import("@babel/types").EmptyStatement;
            parseLabeledStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").LabeledStatement>, maybeName: string, expr: import("@babel/types").Identifier, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").LabeledStatement;
            parseExpressionStatement(node: import("./parser/node.ts").Undone<import("@babel/types").ExpressionStatement>, expr: import("@babel/types").Expression): import("@babel/types").ExpressionStatement;
            parseBlock(this: import("./parser/index.ts").default, allowDirectives?: boolean, createNewLexicalScope?: boolean, afterBlockParse?: (hasStrictModeDirective: boolean) => void): import("@babel/types").BlockStatement;
            isValidDirective(stmt: import("@babel/types").Statement): stmt is import("@babel/types").ExpressionStatement;
            parseBlockBody(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("./types.ts").BlockStatementLike>, allowDirectives: boolean | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseBlockOrModuleBlockBody(this: import("./parser/index.ts").default, body: import("@babel/types").Statement[], directives: import("@babel/types").Directive[] | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseFor(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForStatement>, init?: import("@babel/types").VariableDeclaration | import("@babel/types").Expression | null): import("@babel/types").ForStatement;
            parseForX(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForXStatement>, init: import("@babel/types").VariableDeclaration | import("@babel/types").AssignmentPattern | import("@babel/types").Identifier | import("@babel/types").MemberExpression, awaitAt?: import("./util/location.ts").Position | null): import("@babel/types").ForXStatement;
            parseVar(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, isFor: boolean, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>;
            parseVarId(this: import("./parser/index.ts").default, decl: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclarator>, kind: "var" | "let" | "const" | "using" | "await using"): void;
            parseAsyncFunctionExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionExpression>): import("@babel/types").FunctionExpression;
            parseFunction<T extends import("./types.ts").NormalFunction>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, flags?: import("./parser/statement.ts").ParseFunctionFlag): T;
            parseFunctionId(requireId?: boolean): import("@babel/types").Identifier | undefined | null;
            parseFunctionParams(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isConstructor?: boolean): void;
            registerFunctionStatementId(node: import("./types.ts").NormalFunction): void;
            parseClass<T extends import("@babel/types").Class>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, isStatement: boolean, optionalId?: boolean): T;
            isClassProperty(): boolean;
            isClassMethod(): boolean;
            nameIsConstructor(key: import("@babel/types").Expression | import("@babel/types").PrivateName): boolean;
            isNonstaticConstructor(method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty>): boolean;
            parseClassBody(this: import("./parser/index.ts").default, hadSuperClass: boolean, oldStrict: boolean): import("@babel/types").ClassBody;
            parseClassMemberFromModifier(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): boolean;
            parseClassMember(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>, state: import("./types.ts").ParseClassMemberState): void;
            parseClassMemberWithIsStatic(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>, state: import("./types.ts").ParseClassMemberState, isStatic: boolean): void;
            parseClassElementName(this: import("./parser/index.ts").default, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): import("@babel/types").Expression | import("@babel/types").Identifier | import("@babel/types").PrivateName;
            parseClassStaticBlock(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("@babel/types").StaticBlock & {
                decorators?: import("@babel/types").Decorator[];
            }>): void;
            pushClassProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty>): void;
            pushClassPrivateProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateProperty>): void;
            pushClassAccessorProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>, isPrivate: boolean): void;
            pushClassMethod(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowsDirectSuper: boolean): void;
            pushClassPrivateMethod(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod>, isGenerator: boolean, isAsync: boolean): void;
            declareClassPrivateMethodInScope(node: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod | import("@babel/types").TSDeclareMethod>, kind: number): void;
            parsePostMemberNameModifiers(methodOrProp: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty>): void;
            parseClassPrivateProperty(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateProperty>): import("@babel/types").ClassPrivateProperty;
            parseClassProperty(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty>): import("@babel/types").ClassProperty;
            parseClassAccessorProperty(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>): import("@babel/types").ClassAccessorProperty;
            parseInitializer(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty | import("@babel/types").ClassPrivateProperty | import("@babel/types").ClassAccessorProperty>): void;
            parseClassId(node: import("./parser/node.ts").Undone<import("@babel/types").Class>, isStatement: boolean, optionalId?: boolean | null, bindingType?: import("./util/scopeflags.ts").BindingFlag): void;
            parseClassSuper(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Class>): void;
            parseExport(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, decorators: import("@babel/types").Decorator[] | null | undefined): import("./types.ts").AnyExport;
            eatExportStar(_: import("./parser/node.ts").Undone<import("./types.ts").Node>): _ is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>;
            maybeParseExportDefaultSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportNamespaceSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportNamedSpecifiers(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportDeclaration(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>): boolean;
            isAsyncFunction(): boolean;
            parseExportDefaultExpression(this: import("./parser/index.ts").default): import("@babel/types").ExportDefaultDeclaration["declaration"] | import("@babel/types").EnumDeclaration;
            parseExportDeclaration(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>): import("@babel/types").ExportNamedDeclaration["declaration"] | undefined;
            isExportDefaultSpecifier(): boolean;
            parseExportFrom(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>, expect?: boolean): void;
            shouldParseExportDeclaration(): boolean;
            checkNamedExport(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>, isFrom?: boolean): void;
            checkDeclaration(node: import("@babel/types").Identifier | import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").ObjectProperty): void;
            checkDuplicateExports(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier | import("@babel/types").StringLiteral | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportSpecifier | import("@babel/types").ExportDefaultSpecifier>, exportName: string): void;
            parseExportSpecifiers(isInTypeExport: boolean): import("@babel/types").ExportSpecifier[];
            parseExportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportSpecifier>, isString: boolean, isInTypeExport: boolean, isMaybeTypeOnly: boolean): import("@babel/types").ExportSpecifier;
            parseModuleExportName(): import("@babel/types").StringLiteral | import("@babel/types").Identifier;
            checkImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            isPotentialImportPhase(isExport: boolean): boolean;
            applyImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration>, isExport: boolean, phase: string | null, loc?: number): void;
            parseMaybeImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").TSImportEqualsDeclaration>, isExport: boolean): import("@babel/types").Identifier | null;
            isPrecedingIdImportPhase(phase: string): boolean;
            parseImport(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("./types.ts").AnyImport;
            parseImportSpecifiersAndAfter(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): import("@babel/types").ImportDeclaration;
            parseImportSourceAndAttributes(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("@babel/types").ImportDeclaration;
            parseImportSource(this: import("./parser/index.ts").default): import("@babel/types").StringLiteral;
            parseImportSpecifierLocal<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, specifier: import("./parser/node.ts").Undone<T>, type: T["type"]): void;
            finishImportSpecifier<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(specifier: import("./parser/node.ts").Undone<T>, type: T["type"], bindingType?: import("./util/scopeflags.ts").BindingFlag): T;
            parseImportAttributes(): import("@babel/types").ImportAttribute[];
            maybeParseImportAttributes(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): void;
            maybeParseDefaultImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): boolean;
            maybeParseStarImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): boolean;
            parseNamedImportSpecifiers(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            parseImportSpecifier(specifier: import("./parser/node.ts").Undone<import("@babel/types").ImportSpecifier>, importedIsString: boolean, isInTypeOnlyImport: boolean, isMaybeTypeOnly: boolean, bindingType: import("./util/scopeflags.ts").BindingFlag | undefined): import("@babel/types").ImportSpecifier;
            isThisParam(param: import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty | import("@babel/types").RestElement): boolean;
            checkProto(prop: import("./types.ts").ObjectMember | import("@babel/types").SpreadElement, sawProto: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): boolean;
            shouldExitDescending(expr: import("@babel/types").Expression | import("@babel/types").PrivateName | import("@babel/types").Super | import("@babel/types").Import): expr is import("@babel/types").ArrowFunctionExpression;
            getExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression & import("./types.ts").ParserOutput;
            parseExpression(this: import("./parser/index.ts").default, disallowIn?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExpressionBase(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseMaybeAssignDisallowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            setOptionalParametersError(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            parseMaybeAssign(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssign(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeConditional(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseConditional(this: import("./parser/index.ts").default, expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeUnaryOrPrivate(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression | import("@babel/types").PrivateName;
            parseExprOps(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExprOp(this: import("./parser/index.ts").default, left: import("@babel/types").Expression | import("@babel/types").PrivateName, leftStartLoc: import("./util/location.ts").Position, minPrec: number): import("@babel/types").Expression;
            parseExprOpRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseExprOpBaseRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseHackPipeBody(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            checkExponentialAfterUnary(node: import("@babel/types").AwaitExpression | import("./parser/node.ts").Undone<import("@babel/types").UnaryExpression>): void;
            parseMaybeUnary(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, sawUnary?: boolean): import("@babel/types").Expression;
            parseUpdate(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").UpdateExpression>, update: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseExprSubscripts(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: false | null): import("@babel/types").Expression;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls: true): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: boolean | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscript(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls: boolean | undefined | null, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            stopParseSubscript(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseMember(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, computed: boolean, optional: boolean): import("@babel/types").OptionalMemberExpression | import("@babel/types").MemberExpression;
            parseBind(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseCoverCallAndAsyncArrowHead(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, optional: boolean): import("@babel/types").Expression;
            parseTaggedTemplateExpression(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").TaggedTemplateExpression;
            atPossibleAsyncArrow(base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import): boolean;
            finishCallExpression<T extends import("@babel/types").CallExpression | import("@babel/types").OptionalCallExpression>(node: import("./parser/node.ts").Undone<T>, optional: boolean): T;
            parseCallExpressionArguments(this: import("./parser/index.ts").default, allowPlaceholder?: boolean, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): (import("@babel/types").Expression | import("@babel/types").SpreadElement)[];
            shouldParseAsyncArrow(): boolean;
            parseAsyncArrowFromCallExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, call: import("@babel/types").CallExpression): import("@babel/types").ArrowFunctionExpression;
            parseNoCallExpr(this: import("./parser/index.ts").default, onUnparenthesizedImportExpression: (base: import("@babel/types").ImportExpression) => void): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseTopicReferenceThenEqualsSign(topicTokenType: import("./tokenizer/types.ts").TokenType, topicTokenValue: string): import("@babel/types").Expression;
            parseTopicReference(pipeProposal: string): import("@babel/types").Expression;
            finishTopicReference(node: import("./parser/node.ts").Undone<import("@babel/types").TopicReference>, startLoc: import("./util/location.ts").Position, pipeProposal: string, tokenType: import("./tokenizer/types.ts").TokenType): import("@babel/types").TopicReference;
            testTopicReferenceConfiguration(pipeProposal: string, startLoc: import("./util/location.ts").Position, tokenType: import("./tokenizer/types.ts").TokenType): boolean;
            parseAsyncArrowUnaryFunction(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("@babel/types").ArrowFunctionExpression;
            parseDo(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoExpression>, isAsync: boolean): import("@babel/types").DoExpression;
            parseSuper(): import("@babel/types").Super;
            parsePrivateName(): import("@babel/types").PrivateName;
            parseFunctionOrFunctionSent(this: import("./parser/index.ts").default): import("@babel/types").FunctionExpression | import("@babel/types").MetaProperty;
            parseMetaProperty(node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty>, meta: import("@babel/types").Identifier, propertyName: string): import("@babel/types").MetaProperty;
            parseImportMetaPropertyOrPhaseCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty | import("@babel/types").ImportExpression>): import("@babel/types").MetaProperty | import("@babel/types").ImportExpression;
            parseLiteralAtNode<T extends import("./types.ts").Node>(value: any, type: T["type"], node: any): T;
            parseLiteral<T extends import("./types.ts").Node>(value: any, type: T["type"]): T;
            parseStringLiteral(value: any): import("@babel/types").StringLiteral;
            parseNumericLiteral(value: any): import("@babel/types").NumericLiteral;
            parseBigIntLiteral(value: any): import("@babel/types").BigIntLiteral;
            parseRegExpLiteral(value: {
                value: any;
                pattern: string;
                flags: import("@babel/types").RegExpLiteral["flags"];
            }): import("@babel/types").RegExpLiteral;
            parseBooleanLiteral(value: boolean): import("@babel/types").BooleanLiteral;
            parseNullLiteral(): import("@babel/types").NullLiteral;
            parseParenAndDistinguishExpression(this: import("./parser/index.ts").default, canStartArrow: boolean): import("@babel/types").Expression;
            wrapParenthesis(startLoc: import("./util/location.ts").Position, expression: import("@babel/types").Expression): import("@babel/types").Expression;
            shouldParseArrow(params: import("./types.ts").Node[]): boolean;
            parseArrow(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression> | undefined | null;
            parseParenItem<T extends import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").SpreadElement | import("./types.ts").TSTypeCastExpression>(node: T, startLoc: import("./util/location.ts").Position): T | import("@babel/types").TypeCastExpression | import("./types.ts").TSTypeCastExpression;
            parseNewOrNewTarget(this: import("./parser/index.ts").default): import("@babel/types").NewExpression | import("@babel/types").MetaProperty;
            parseNew(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").NewExpression>): import("@babel/types").NewExpression;
            parseNewCallee(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").NewExpression>): void;
            parseTemplateElement(isTagged: boolean): import("@babel/types").TemplateElement;
            parseTemplate(this: import("./parser/index.ts").default, isTagged: boolean): import("@babel/types").TemplateLiteral;
            parseTemplateSubstitution(this: import("./parser/index.ts").default): import("@babel/types").Expression | import("@babel/types").TSType;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: true, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectPattern;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectExpression;
            addTrailingCommaExtraToNode(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): void;
            maybeAsyncOrAccessorProp(prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty | import("@babel/types").ObjectMethod>): prop is typeof prop & {
                key: import("@babel/types").Identifier;
            };
            parsePropertyDefinition(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("./types.ts").ObjectMember | import("@babel/types").SpreadElement;
            getGetterSetterExpectedParamCount(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): number;
            getObjectOrClassMethodParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): (import("@babel/types").TSParameterProperty | import("@babel/types").FunctionParameter)[] | import("@babel/types").FunctionParameter[];
            checkGetterSetterParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): void;
            parseObjectMethod(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod>, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean): import("@babel/types").ObjectMethod | undefined | null;
            parseObjectProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>, startLoc: import("./util/location.ts").Position | undefined | null, isPattern: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectProperty | undefined | null;
            finishObjectProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>): import("@babel/types").ObjectProperty;
            parseObjPropValue<T extends import("./types.ts").ObjectMember>(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<T>, startLoc: import("./util/location.ts").Position | undefined | null, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): T;
            parsePropertyName(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember> | import("@babel/types").TSPropertySignature | import("@babel/types").TSMethodSignature, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): void;
            initFunction(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isAsync: boolean): void;
            parseMethod<T extends import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod | import("@babel/types").ClassPrivateMethod>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowDirectSuper: boolean, type: T["type"], inClassScope?: boolean): T;
            parseArrayLike(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ArrayExpression;
            parseArrowExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | null | undefined, isAsync: boolean, trailingCommaLoc?: import("./util/location.ts").Position | null): import("@babel/types").ArrowFunctionExpression;
            setArrowFunctionParameters(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[], trailingCommaLoc?: import("./util/location.ts").Position | null): void;
            parseFunctionBodyAndFinish<T extends import("@babel/types").Function | import("@babel/types").TSDeclareMethod | import("@babel/types").TSDeclareFunction | import("@babel/types").ClassPrivateMethod>(node: import("./parser/node.ts").Undone<T>, type: T["type"], isMethod?: boolean): T;
            parseFunctionBody(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Function>, allowExpression?: boolean | null, isMethod?: boolean): void;
            isSimpleParameter(node: import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty): boolean;
            isSimpleParamList(params: readonly (import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty)[]): boolean;
            checkParams(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, allowDuplicates: boolean, isArrowFunction?: boolean | null, strictModeChanged?: boolean): void;
            parseExprList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null): (import("@babel/types").Expression | null)[];
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression | null;
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression;
            parseIdentifier(liberal?: boolean): import("@babel/types").Identifier;
            createIdentifier(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string): import("@babel/types").Identifier;
            createIdentifierAt(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string, endLoc: import("./util/location.ts").Position): import("@babel/types").Identifier;
            parseIdentifierName(liberal?: boolean): string;
            checkReservedWord(word: string, startLoc: number, checkKeywords: boolean, isBinding: boolean): void;
            recordAwaitIfAllowed(): boolean;
            parseAwait(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position, soloAwait?: boolean): import("@babel/types").AwaitExpression;
            isAmbiguousPrefixOrIdentifier(): boolean;
            parseYield(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position): import("@babel/types").YieldExpression;
            parseImportCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportExpression>): import("@babel/types").ImportExpression;
            withTopicBindingContext<T>(callback: () => T): T;
            allowInAnd<T>(callback: () => T): T;
            disallowInAnd<T>(callback: () => T): T;
            registerTopicReference(): void;
            topicReferenceIsAllowedInCurrentContext(): boolean;
            topicReferenceWasUsedInCurrentContext(): boolean;
            parseFSharpPipelineBody(this: import("./parser/index.ts").default, prec: number): import("@babel/types").Expression;
            parseModuleExpression(this: import("./parser/index.ts").default): import("@babel/types").ModuleExpression;
            parseVoidPattern(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").VoidPattern;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parsePropertyNamePrefixOperator(prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember>): void;
            toAssignable(node: import("./types.ts").Node, isLHS?: boolean): asserts node is import("./types.ts").Assignable;
            toAssignableObjectExpressionProp(prop: import("./types.ts").Node, isLast: boolean, isLHS: boolean): void;
            toAssignableList(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[], trailingCommaLoc: import("./util/location.ts").Position | undefined | null, isLHS: boolean): void;
            toAssignableListItem(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression)[], index: number, isLHS: boolean): void;
            isAssignable(node: import("./types.ts").Node, isBinding?: boolean): boolean;
            toReferencedList(exprList: readonly (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[] | readonly (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression | null)[], isParenthesizedExpr?: boolean): readonly (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[] | readonly (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression | null)[];
            parseSpread(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").SpreadElement;
            parseRestBinding(this: import("./parser/index.ts").default): import("@babel/types").RestElement;
            parseBindingAtom(this: import("./parser/index.ts").default): import("@babel/types").ArrayPattern | import("@babel/types").ObjectPattern | import("@babel/types").VoidPattern | import("@babel/types").Identifier;
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.ALLOW_EMPTY): (import("@babel/types").Pattern | import("@babel/types").RestElement | null)[];
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.IS_FUNCTION_PARAMS): (import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").TSParameterProperty)[];
            parseBindingRestProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").RestElement>): import("@babel/types").RestElement;
            parseBindingProperty(this: import("./parser/index.ts").default): import("./types.ts").AssignmentProperty | import("@babel/types").RestElement;
            parseBindingElement(this: import("./parser/index.ts").default, flags: import("./parser/lval.ts").ParseBindingListFlags, decorators: import("@babel/types").Decorator[]): import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty;
            parseFunctionParamType<T extends import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").RestElement>(param: T): T;
            parseMaybeDefault<P extends import("@babel/types").Pattern | import("@babel/types").Identifier>(this: import("./parser/index.ts").default, startLoc?: import("./util/location.ts").Position | null, left?: P | null): P | import("@babel/types").AssignmentPattern;
            isValidLVal(type: string, disallowCallExpression: boolean, isUnparenthesizedInAssign: boolean, binding: import("./util/scopeflags.ts").BindingFlag): string | boolean | [string, boolean];
            isOptionalMemberExpression(expression: import("./types.ts").Node): boolean;
            checkLVal(expression: import("@babel/types").Expression | import("./types.ts").ObjectMember | import("@babel/types").RestElement | import("@babel/types").Pattern | import("@babel/types").TSParameterProperty | import("./types.ts").TSTypeCastExpression, ancestor: import("./parse-error.ts").LValAncestor, binding?: import("./util/scopeflags.ts").BindingFlag, checkClashes?: Set<string> | false, strictModeChanged?: boolean, hasParenthesizedAncestor?: boolean, disallowCallExpression?: boolean): void;
            checkIdentifier(at: import("@babel/types").Identifier, bindingType: import("./util/scopeflags.ts").BindingFlag, strictModeChanged?: boolean): void;
            declareNameFromIdentifier(identifier: import("@babel/types").Identifier, binding: import("./util/scopeflags.ts").BindingFlag): void;
            checkToRestConversion(node: import("./types.ts").Node, allowPattern: boolean): void;
            checkCommaAfterRest(close: typeof import("charcodes")[keyof typeof import("charcodes")]): boolean;
            createPosition(loc: import("./util/location.ts").Position): import("./util/location.ts").Position;
            startNode<T extends import("./types.ts").Node = never>(): import("./parser/node.ts").Undone<T>;
            startNodeAt<T extends import("./types.ts").Node = never>(loc: import("./util/location.ts").Position): import("./parser/node.ts").Undone<T>;
            startNodeAtNode<T extends import("./types.ts").Node = never>(type: import("./parser/node.ts").Undone<import("./types.ts").Node>): import("./parser/node.ts").Undone<T>;
            finishNode<T extends import("./types.ts").Node>(node: import("./parser/node.ts").Undone<T>, type: T["type"]): T;
            finishNodeAt<T extends import("./types.ts").Node>(node: Omit<T, "type">, type: T["type"], endLoc: import("./util/location.ts").Position): T;
            finishNodeAtNode<T extends import("./types.ts").Node>(node: Omit<T, "type">, type: T["type"], endNode: import("./types.ts").Node): T;
            resetStartLocation(node: import("./types.ts").BaseNode, startLoc: import("./util/location.ts").Position): void;
            resetEndLocation(node: import("./types.ts").BaseNode, endLoc?: import("./util/location.ts").Position): void;
            resetStartLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            resetEndLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            castNodeTo<T extends import("./types.ts").Node["type"]>(node: import("./types.ts").Node, type: T): Extract<import("./types.ts").Node, {
                type: T;
            }>;
            cloneIdentifier<T extends import("@babel/types").Identifier | import("./types.ts").Placeholder>(node: T): T;
            cloneStringLiteral<T extends import("@babel/types").StringLiteral | import("./types.ts").EstreeLiteral | import("./types.ts").Placeholder>(node: T): T;
            addExtra(node: Partial<import("./types.ts").Node>, key: string, value: any, enumerable?: boolean): void;
            isContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            isUnparsedContextual(nameStart: number, name: string): boolean;
            isLookaheadContextual(name: string): boolean;
            eatContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            expectContextual(token: import("./tokenizer/types.ts").TokenType, toParseError?: import("./parse-error.ts").ParseErrorConstructor<any>): void;
            canInsertSemicolon(): boolean;
            hasPrecedingLineBreak(): boolean;
            hasFollowingLineBreak(): boolean;
            isLineTerminator(): boolean;
            semicolon(allowAsi?: boolean): void;
            expect(type: import("./tokenizer/types.ts").TokenType, loc?: import("./util/location.ts").Position | null): void;
            tryParse<T extends import("./types.ts").Node | readonly import("./types.ts").Node[] | null>(fn: (abort: (node?: T) => never) => T, oldState?: import("./tokenizer/state.ts").default): {
                node: T;
                error: null;
                thrown: false;
                aborted: false;
                failState: null;
            } | {
                node: T | null;
                error: import("./parse-error.ts").ParseError;
                thrown: boolean;
                aborted: false;
                failState: import("./tokenizer/state.ts").default;
            } | {
                node: T | null;
                error: null;
                thrown: false;
                aborted: true;
                failState: import("./tokenizer/state.ts").default;
            };
            checkExpressionErrors(refExpressionErrors: import("./parser/util.ts").ExpressionErrors | undefined | null, andThrow: boolean): boolean | undefined;
            isLiteralPropertyName(): boolean;
            isPrivateName(node: import("./types.ts").Node): node is import("@babel/types").PrivateName;
            getPrivateNameSV(node: import("@babel/types").PrivateName): string;
            hasPropertyAsPrivateName(node: import("./types.ts").Node): boolean;
            isObjectProperty(node: import("./types.ts").Node): node is import("@babel/types").ObjectProperty | import("./types.ts").EstreePropertyDefinition;
            isObjectMethod(node: import("./types.ts").Node): node is import("@babel/types").ObjectMethod;
            initializeScopes(this: import("./parser/index.ts").default, inModule?: boolean): () => void;
            enterInitialScopes(): void;
            checkDestructuringPrivate(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            isLookahead: boolean;
            tokens: (import("./index.ts").Token | import("./types.ts").Comment)[];
            setLoc(loc: import("./util/location.ts").Position): void;
            getLoc(locIndex: number): import("./util/location.ts").Position;
            pushToken(token: import("./index.ts").Token | import("./types.ts").Comment): void;
            next(): void;
            eat(type: import("./tokenizer/types.ts").TokenType): boolean;
            match(type: import("./tokenizer/types.ts").TokenType): boolean;
            createLookaheadState(state: import("./tokenizer/state.ts").default): import("./tokenizer/state.ts").LookaheadState;
            lookahead(): import("./tokenizer/state.ts").LookaheadState;
            nextTokenStart(): number;
            nextTokenStartSince(pos: number): number;
            lookaheadCharCode(): number;
            lookaheadCharCodeSince(pos: number): number;
            nextTokenInLineStart(): number;
            nextTokenInLineStartSince(pos: number): number;
            lookaheadInLineCharCode(): number;
            codePointAtPos(pos: number): number;
            setStrict(strict: boolean): void;
            curContext(): import("./tokenizer/context.ts").TokContext;
            nextToken(): void;
            skipBlockComment(commentEnd: "*/" | "*-/"): import("./types.ts").CommentBlock | undefined;
            skipLineComment(startSkip: number): import("./types.ts").CommentLine | undefined;
            finishToken(type: import("./tokenizer/types.ts").TokenType, val?: any): void;
            replaceToken(type: import("./tokenizer/types.ts").TokenType): void;
            readToken_numberSign(): void;
            readToken_dot(): void;
            readToken_slash(): void;
            readToken_interpreter(): boolean;
            readToken_mult_modulo(code: number): void;
            readToken_pipe_amp(code: number): void;
            readToken_caret(): void;
            readToken_atSign(): void;
            readToken_plus_min(code: number): void;
            readToken_lt(): void;
            readToken_gt(): void;
            readToken_eq_excl(code: number): void;
            readToken_question(): void;
            finishOp(type: import("./tokenizer/types.ts").TokenType, size: number): void;
            readRegexp(): void;
            readInt(radix: number, len?: number, forceLen?: boolean, allowNumSeparator?: boolean | "bail"): number | null;
            readRadixNumber(radix: number): void;
            readNumber(startsWithDot: boolean): void;
            readCodePoint(throwOnInvalid: boolean): number | null;
            readString(quote: number): void;
            readTemplateContinuation(): void;
            readTemplateToken(): void;
            recordStrictModeErrors(toParseError: import("./tokenizer/state.ts").DeferredStrictError, at: import("./util/location.ts").Position): void;
            readWord1(firstCode?: number): string;
            readWord(firstCode?: number): void;
            checkKeywordEscapes(): void;
            raise<ErrorDetails = object>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node> | number, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            raiseOverwrite<ErrorDetails>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node>, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            unexpected(loc?: import("./util/location.ts").Position | number | null, type?: import("./tokenizer/types.ts").TokenType): any;
            expectPlugin(pluginName: import("./typings.d.ts").Plugin, loc?: import("./util/location.ts").Position | number | null): true;
            expectOnePlugin(pluginNames: import("./typings.d.ts").Plugin[]): any;
            errorBuilder(error: import("./parse-error.ts").ParseErrorConstructor<object>): (pos: number, lineStart: number, curLine: number) => void;
            errorHandlers_readInt: import("@babel/helper-string-parser").IntErrorHandlers;
            errorHandlers_readCodePoint: import("@babel/helper-string-parser").CodePointErrorHandlers;
            errorHandlers_readStringContents_string: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            errorHandlers_readStringContents_template: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            addComment(comment: import("./types.ts").Comment): void;
            processComment(node: import("./types.ts").Node): void;
            finalizeComment(commentWS: import("./parser/comments.ts").CommentWhitespace): void;
            finalizeRemainingComments(): void;
            resetPreviousNodeTrailingComments(node: import("./types.ts").Node): void;
            takeSurroundingComments(node: import("./types.ts").Node, start: number, end: number): void;
            options: import("./options.ts").Options;
            optionFlags: import("./options.ts").OptionFlags;
            inModule: boolean;
            scope: import("./util/scope.ts").default<any>;
            classScope: import("./util/class-scope.ts").default;
            prodParam: import("./util/production-parameter.ts").default;
            expressionScope: import("./util/expression-scope.ts").default;
            plugins: import("./parser/index.ts").PluginsMap;
            filename: string | undefined | null;
            startIndex: number;
            exportedIdentifiers: Set<string>;
            sawUnambiguousESM: boolean;
            ambiguousScriptDifferentAst: boolean;
            state: import("./tokenizer/state.ts").default;
            input: string;
            length: number;
            comments: import("./types.ts").Comment[];
            locData: Uint32Array;
            sourceToOffsetPos(sourcePos: number): number;
            offsetToSourcePos(offsetPos: number): number;
            hasPlugin(pluginConfig: PluginConfig): boolean;
            getPluginOption<PluginName extends import("./typings.d.ts").ParserPluginWithOptions[0], OptionName extends keyof import("./typings.d.ts").PluginOptions<PluginName>>(plugin: PluginName, name: OptionName): NonNullable<import("./typings.d.ts").PluginOptions<PluginName>>[OptionName] | undefined;
        };
    };
    flow: (superClass: import("./plugins/jsx/index.ts").ClassWithMixin<typeof import("./parser/index.ts").default, import("./plugins/jsx/index.ts").IJSXParserMixin>) => {
        new (options: Partial<import("./options.ts").Options> | null | undefined, input: string, pluginsMap: import("./parser/index.ts").PluginsMap): {
            flowPragma: void | null | "flow" | "noflow";
            getScopeHandler(): new (...args: any) => import("./plugins/flow/scope.ts").default;
            shouldParseTypes(): boolean;
            finishToken(type: import("./tokenizer/types.ts").TokenType, val: any): void;
            addComment(comment: import("./types.ts").Comment): void;
            flowParseTypeInitialiser(tok?: import("./tokenizer/types.ts").TokenType): import("@babel/types").FlowType;
            flowParsePredicate(): import("@babel/types").FlowPredicate;
            flowParseTypeAndPredicateInitialiser(allowLonePredicate: true): [import("@babel/types").FlowType | null, import("@babel/types").FlowPredicate | null];
            flowParseTypeAndPredicateInitialiser(allowLonePredicate: false): [import("@babel/types").FlowType, import("@babel/types").FlowPredicate | null];
            flowParseDeclareClass(node: import("./parser/node.ts").Undone<import("@babel/types").DeclareClass>): import("@babel/types").DeclareClass;
            flowParseDeclareFunction(node: import("./parser/node.ts").Undone<import("@babel/types").DeclareFunction>): import("@babel/types").DeclareFunction;
            flowParseDeclare(node: import("./parser/node.ts").Undone<import("./types.ts").FlowDeclare>, insideModule?: boolean): import("./types.ts").FlowDeclare;
            flowParseDeclareVariable(node: import("./parser/node.ts").Undone<import("@babel/types").DeclareVariable>): import("@babel/types").DeclareVariable;
            flowParseDeclareModule(node: import("./parser/node.ts").Undone<import("@babel/types").DeclareModule>): import("@babel/types").DeclareModule;
            flowParseDeclareExportDeclaration(node: import("./parser/node.ts").Undone<import("@babel/types").DeclareExportDeclaration>, insideModule?: boolean | null): import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareExportAllDeclaration;
            flowParseDeclareModuleExports(node: import("./parser/node.ts").Undone<import("@babel/types").DeclareModuleExports>): import("@babel/types").DeclareModuleExports;
            flowParseDeclareTypeAlias(node: import("./parser/node.ts").Undone<import("@babel/types").DeclareTypeAlias>): import("@babel/types").DeclareTypeAlias;
            flowParseDeclareOpaqueType(node: import("./parser/node.ts").Undone<import("@babel/types").DeclareOpaqueType>): import("@babel/types").DeclareOpaqueType;
            flowParseDeclareInterface(node: import("./parser/node.ts").Undone<import("@babel/types").DeclareInterface>): import("@babel/types").DeclareInterface;
            flowParseInterfaceish(node: import("./parser/node.ts").Undone<import("@babel/types").DeclareClass | import("@babel/types").DeclareInterface | import("@babel/types").InterfaceDeclaration>, isClass: boolean): void;
            flowParseInterfaceExtends(): import("@babel/types").InterfaceExtends;
            flowParseInterface(node: import("./parser/node.ts").Undone<import("@babel/types").InterfaceDeclaration>): import("@babel/types").InterfaceDeclaration;
            checkNotUnderscore(word: string): void;
            checkReservedType(word: string, startLoc: import("./util/location.ts").Position | number, declaration?: boolean): void;
            flowParseRestrictedIdentifierName(liberal?: boolean, declaration?: boolean): string;
            flowParseRestrictedIdentifier(liberal?: boolean, declaration?: boolean): import("@babel/types").Identifier;
            flowParseTypeAlias(node: import("./parser/node.ts").Undone<import("@babel/types").TypeAlias>): import("@babel/types").TypeAlias;
            flowParseOpaqueType<T extends import("@babel/types").OpaqueType | import("@babel/types").DeclareOpaqueType>(node: import("./parser/node.ts").Undone<T>, declare: boolean): T;
            flowParseTypeParameterBound(): import("@babel/types").TypeAnnotation | undefined;
            flowParseTypeParameter(requireDefault?: boolean): import("@babel/types").TypeParameter;
            flowParseTypeParameterDeclaration(): import("@babel/types").TypeParameterDeclaration;
            flowInTopLevelContext<T>(cb: () => T): T;
            flowParseTypeParameterInstantiationInExpression(): import("@babel/types").TypeParameterInstantiation | undefined;
            flowParseTypeParameterInstantiation(): import("@babel/types").TypeParameterInstantiation;
            flowParseTypeParameterInstantiationCallOrNew(): import("@babel/types").TypeParameterInstantiation | null;
            flowParseInterfaceType(): import("@babel/types").InterfaceTypeAnnotation;
            flowParseObjectPropertyKey(): import("@babel/types").Identifier | import("@babel/types").NumericLiteral | import("@babel/types").StringLiteral;
            flowParseObjectTypeIndexer(node: import("./parser/node.ts").Undone<import("@babel/types").ObjectTypeIndexer>, isStatic: boolean, variance?: import("@babel/types").Variance | null): import("@babel/types").ObjectTypeIndexer;
            flowParseObjectTypeInternalSlot(node: import("./parser/node.ts").Undone<import("@babel/types").ObjectTypeInternalSlot>, isStatic: boolean): import("@babel/types").ObjectTypeInternalSlot;
            flowParseObjectTypeMethodish(node: import("./parser/node.ts").Undone<import("@babel/types").FunctionTypeAnnotation>): import("@babel/types").FunctionTypeAnnotation;
            flowParseObjectTypeCallProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ObjectTypeCallProperty>, isStatic: boolean): import("@babel/types").ObjectTypeCallProperty;
            flowParseObjectType({ allowStatic, allowExact, allowSpread, allowProto, allowInexact, }: {
                allowStatic: boolean;
                allowExact: boolean;
                allowSpread: boolean;
                allowProto: boolean;
                allowInexact: boolean;
            }): import("@babel/types").ObjectTypeAnnotation;
            flowParseObjectTypeProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ObjectTypeProperty | import("@babel/types").ObjectTypeSpreadProperty>, isStatic: boolean, protoStartLoc: import("./util/location.ts").Position | undefined | null, variance: import("@babel/types").Variance | undefined | null, kind: import("@babel/types").ObjectTypeProperty["kind"], allowSpread: boolean, allowInexact: boolean): import("@babel/types").ObjectTypeProperty | import("@babel/types").ObjectTypeSpreadProperty | null;
            flowCheckGetterSetterParams(property: import("./parser/node.ts").Undone<import("@babel/types").ObjectTypeProperty>): void;
            flowObjectTypeSemicolon(): void;
            flowParseQualifiedTypeIdentifier(startLoc?: import("./util/location.ts").Position, id?: import("@babel/types").Identifier): import("@babel/types").QualifiedTypeIdentifier | import("@babel/types").Identifier;
            flowParseGenericType(startLoc: import("./util/location.ts").Position, id: import("@babel/types").Identifier): import("@babel/types").GenericTypeAnnotation;
            flowParseTypeofType(): import("@babel/types").TypeofTypeAnnotation;
            flowParseTupleType(): import("@babel/types").TupleTypeAnnotation;
            flowParseFunctionTypeParam(first: boolean): import("@babel/types").FunctionTypeParam;
            reinterpretTypeAsFunctionTypeParam(type: import("@babel/types").FlowType): import("@babel/types").FunctionTypeParam;
            flowParseFunctionTypeParams(params?: import("@babel/types").FunctionTypeParam[]): {
                params: import("@babel/types").FunctionTypeParam[];
                rest: import("@babel/types").FunctionTypeParam | undefined | null;
                _this: import("@babel/types").FunctionTypeParam | undefined | null;
            };
            flowIdentToTypeAnnotation(startLoc: import("./util/location.ts").Position, node: import("./parser/node.ts").Undone<import("@babel/types").FlowType>, id: import("@babel/types").Identifier): import("@babel/types").FlowType;
            flowParsePrimaryType(): import("@babel/types").FlowType;
            flowParsePostfixType(): import("@babel/types").FlowType;
            flowParsePrefixType(): import("@babel/types").FlowType;
            flowParseAnonFunctionWithoutParens(): import("@babel/types").FlowType;
            flowParseIntersectionType(): import("@babel/types").FlowType;
            flowParseUnionType(): import("@babel/types").FlowType;
            flowParseType(): import("@babel/types").FlowType;
            flowParseTypeOrImplicitInstantiation(): import("@babel/types").FlowType;
            flowParseTypeAnnotation(): import("@babel/types").TypeAnnotation;
            flowParseTypeAnnotatableIdentifier(): import("@babel/types").Identifier;
            typeCastToParameter(node: import("@babel/types").TypeCastExpression): import("@babel/types").Expression;
            flowParseVariance(): import("@babel/types").Variance | undefined | null;
            parseFunctionBody(node: import("@babel/types").Function, allowExpressionBody?: boolean | null, isMethod?: boolean): void;
            parseFunctionBodyAndFinish<T extends import("@babel/types").Function | import("@babel/types").TSDeclareMethod | import("@babel/types").TSDeclareFunction | import("@babel/types").ClassPrivateMethod>(node: import("./parser/node.ts").Undone<T>, type: T["type"], isMethod?: boolean): T;
            parseStatementLike(flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").Statement;
            parseExpressionStatement(node: import("./parser/node.ts").Undone<import("@babel/types").ExpressionStatement>, expr: import("@babel/types").Expression): import("@babel/types").ExpressionStatement;
            shouldParseExportDeclaration(): boolean;
            isExportDefaultSpecifier(): boolean;
            parseExportDefaultExpression(): import("@babel/types").ClassDeclaration | import("@babel/types").EnumDeclaration | import("@babel/types").FunctionDeclaration | import("@babel/types").TSDeclareFunction | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").Expression;
            parseConditional(expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            tryParseConditionalConsequent(): {
                consequent: import("@babel/types").Expression;
                failed: boolean;
            };
            getArrowLikeExpressions(node: import("@babel/types").Expression, disallowInvalid?: boolean): [import("@babel/types").ArrowFunctionExpression[], import("@babel/types").ArrowFunctionExpression[]];
            finishArrowValidation(node: import("@babel/types").ArrowFunctionExpression): void;
            forwardNoArrowParamsConversionAt<T>(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, parse: () => T): T;
            parseParenItem<T extends import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").SpreadElement | import("./types.ts").TSTypeCastExpression>(node: T, startLoc: import("./util/location.ts").Position): T | import("@babel/types").TypeCastExpression | import("./types.ts").TSTypeCastExpression;
            assertModuleNodeAllowed(node: import("./types.ts").Node): void;
            parseExportDeclaration(node: import("@babel/types").ExportNamedDeclaration): import("@babel/types").ExportNamedDeclaration["declaration"] | undefined;
            eatExportStar(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>;
            maybeParseExportNamespaceSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            parseClassId(node: import("@babel/types").Class, isStatement: boolean, optionalId?: boolean | null): void;
            parseClassMember(classBody: import("@babel/types").ClassBody, member: any, state: import("./types.ts").ParseClassMemberState): void;
            isIterator(word: string): boolean;
            readIterator(): void;
            getTokenFromCode(code: number): void;
            isAssignable(node: import("./types.ts").Node, isBinding?: boolean): boolean;
            toAssignable(node: import("./types.ts").Node, isLHS?: boolean): void;
            toAssignableListItem(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement)[], index: number, isLHS: boolean): void;
            toReferencedList(exprList: readonly (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[] | readonly (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression | null)[], isParenthesizedExpr?: boolean): readonly (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[] | readonly (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression | null)[];
            parseArrayLike(close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ArrayExpression;
            isValidLVal(type: string, disallowCallExpression: boolean, isParenthesized: boolean, binding: import("./util/scopeflags.ts").BindingFlag): string | boolean | [string, boolean];
            parseClassProperty(node: import("@babel/types").ClassProperty): import("@babel/types").ClassProperty;
            parseClassPrivateProperty(node: import("@babel/types").ClassPrivateProperty): import("@babel/types").ClassPrivateProperty;
            isClassMethod(): boolean;
            isClassProperty(): boolean;
            isNonstaticConstructor(method: import("@babel/types").ClassMethod | import("@babel/types").ClassProperty): boolean;
            pushClassMethod(classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowsDirectSuper: boolean): void;
            pushClassPrivateMethod(classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod>, isGenerator: boolean, isAsync: boolean): void;
            flowParseClassImplements(): import("@babel/types").ClassImplements;
            parseClassSuper(node: import("./parser/node.ts").Undone<import("@babel/types").Class>): void;
            checkGetterSetterParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): void;
            parsePropertyNamePrefixOperator(node: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember>): void;
            parseObjPropValue<T extends import("./types.ts").ObjectMember>(prop: import("./parser/node.ts").Undone<T>, startLoc: import("./util/location.ts").Position | undefined | null, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): T;
            parseFunctionParamType<T extends import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").RestElement>(param: T): T;
            parseMaybeDefault<P extends import("@babel/types").Pattern | import("@babel/types").Identifier>(startLoc?: import("./util/location.ts").Position | null, left?: P | null): P | import("@babel/types").AssignmentPattern;
            parseImportSpecifierLocal<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(node: import("@babel/types").ImportDeclaration, specifier: import("./parser/node.ts").Undone<T>, type: T["type"]): void;
            isPotentialImportPhase(isExport: boolean): boolean;
            applyImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration>, isExport: boolean, phase: string | null, loc?: number): void;
            parseImportSpecifier(specifier: any, importedIsString: boolean, isInTypeOnlyImport: boolean, isMaybeTypeOnly: boolean, bindingType: import("./util/scopeflags.ts").BindingFlag | undefined): import("@babel/types").ImportSpecifier;
            parseBindingAtom(): import("@babel/types").ArrayPattern | import("@babel/types").Identifier | import("@babel/types").ObjectPattern | import("@babel/types").VoidPattern;
            parseFunctionParams(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isConstructor: boolean): void;
            parseVarId(decl: import("@babel/types").VariableDeclarator, kind: "var" | "let" | "const" | "using" | "await using"): void;
            parseAsyncArrowFromCallExpression(node: import("@babel/types").ArrowFunctionExpression, call: import("@babel/types").CallExpression): import("@babel/types").ArrowFunctionExpression;
            shouldParseAsyncArrow(): boolean;
            parseMaybeAssign(refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssign(refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseArrow(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression> | undefined | null;
            shouldParseArrow(params: import("./types.ts").Node[]): boolean;
            setArrowFunctionParameters(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement)[] | (import("@babel/types").Expression | import("@babel/types").RestElement)[]): void;
            checkParams(node: import("@babel/types").Function, allowDuplicates: boolean, isArrowFunction?: boolean | null, strictModeChanged?: boolean): void;
            parseParenAndDistinguishExpression(canStartArrow: boolean): import("@babel/types").Expression;
            parseSubscripts(base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: false | null): import("@babel/types").Expression;
            parseSubscripts(base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls: true): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscripts(base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: boolean | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscript(base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, noCalls: boolean | undefined | null, subscriptState: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseNewCallee(node: import("@babel/types").NewExpression): void;
            parseAsyncArrowWithTypeParameters(startLoc: import("./util/location.ts").Position): import("@babel/types").ArrowFunctionExpression | undefined | null;
            readToken_mult_modulo(code: number): void;
            readToken_pipe_amp(code: number): void;
            parseTopLevel(file: import("@babel/types").File, program: import("@babel/types").Program): import("@babel/types").File;
            skipBlockComment(): import("./types.ts").CommentBlock | undefined;
            skipFlowComment(): number | false;
            hasFlowCommentCompletion(): void;
            flowEnumErrorBooleanMemberNotInitialized(loc: import("./util/location.ts").Position | number, names: {
                enumName: string;
                memberName: string;
            }): void;
            flowEnumErrorInvalidMemberInitializer(loc: import("./util/location.ts").Position | number, enumContext: {
                enumName: string;
                explicitType: "string" | "number" | "boolean" | "symbol" | null;
                memberName: string;
            }): import("./parse-error.ts").ParseError;
            flowEnumErrorNumberMemberNotInitialized(loc: import("./util/location.ts").Position | number, details: {
                enumName: string;
                memberName: string;
            }): void;
            flowEnumErrorStringMemberInconsistentlyInitialized(node: import("./types.ts").Node, details: {
                enumName: string;
            }): void;
            flowEnumMemberInit(): {
                type: "number";
                loc: number;
                value: import("@babel/types").NumericLiteral;
            } | {
                type: "string";
                loc: number;
                value: import("@babel/types").StringLiteral;
            } | {
                type: "boolean";
                loc: number;
                value: import("@babel/types").BooleanLiteral;
            } | {
                type: "invalid";
                loc: import("./util/location.ts").Position;
            } | {
                type: "none";
                loc: import("./util/location.ts").Position;
            };
            flowEnumMemberRaw(): {
                id: import("@babel/types").Identifier;
                init: {
                    type: "number";
                    loc: number;
                    value: import("@babel/types").NumericLiteral;
                } | {
                    type: "string";
                    loc: number;
                    value: import("@babel/types").StringLiteral;
                } | {
                    type: "boolean";
                    loc: number;
                    value: import("@babel/types").BooleanLiteral;
                } | {
                    type: "invalid";
                    loc: import("./util/location.ts").Position;
                } | {
                    type: "none";
                    loc: import("./util/location.ts").Position;
                };
            };
            flowEnumCheckExplicitTypeMismatch(loc: number, context: {
                enumName: string;
                explicitType: "string" | "number" | "boolean" | "symbol" | null;
                memberName: string;
            }, expectedType: "string" | "number" | "boolean" | "symbol" | null): void;
            flowEnumMembers({ enumName, explicitType, }: {
                enumName: string;
                explicitType: "string" | "number" | "boolean" | "symbol" | null;
            }): {
                members: {
                    booleanMembers: import("@babel/types").EnumBooleanMember[];
                    numberMembers: import("@babel/types").EnumNumberMember[];
                    stringMembers: import("@babel/types").EnumStringMember[];
                    defaultedMembers: import("@babel/types").EnumDefaultedMember[];
                };
                hasUnknownMembers: boolean;
            };
            flowEnumStringMembers(initializedMembers: import("@babel/types").EnumStringMember[], defaultedMembers: import("@babel/types").EnumDefaultedMember[], { enumName, }: {
                enumName: string;
            }): import("@babel/types").EnumDefaultedMember[] | import("@babel/types").EnumStringMember[];
            flowEnumParseExplicitType({ enumName, }: {
                enumName: string;
            }): "string" | "number" | "boolean" | "symbol" | null;
            flowEnumBody(node: import("./parser/node.ts").Undone<import("@babel/types").EnumBody>, id: import("@babel/types").Identifier): import("@babel/types").EnumBody;
            flowParseEnumDeclaration(node: import("./parser/node.ts").Undone<import("@babel/types").EnumDeclaration>): import("@babel/types").EnumDeclaration;
            jsxParseOpeningElementAfterName(node: import("@babel/types").JSXOpeningElement): import("@babel/types").JSXOpeningElement;
            isLookaheadToken_lt(): boolean;
            reScan_lt_gt(): void;
            reScan_lt(): number;
            maybeUnwrapTypeCastExpression(node: import("./types.ts").Node): import("@babel/types").AnyTypeAnnotation | import("@babel/types").ArgumentPlaceholder | import("@babel/types").ArrayPattern | import("@babel/types").ArrayTypeAnnotation | import("@babel/types").AssignmentPattern | import("@babel/types").BigIntLiteralTypeAnnotation | import("@babel/types").BlockStatement | import("@babel/types").BooleanLiteralTypeAnnotation | import("@babel/types").BooleanTypeAnnotation | import("@babel/types").BreakStatement | import("@babel/types").CatchClause | import("@babel/types").ClassAccessorPropertyComputed | import("@babel/types").ClassAccessorPropertyNonComputed | import("@babel/types").ClassBody | import("@babel/types").ClassDeclaration | import("@babel/types").ClassImplements | import("@babel/types").ClassMethodComputed | import("@babel/types").ClassMethodNonComputed | import("@babel/types").ClassPrivateMethod | import("@babel/types").ClassPrivateProperty | import("@babel/types").ClassPropertyComputed | import("@babel/types").ClassPropertyNonComputed | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DeclaredPredicate | import("@babel/types").Decorator | import("@babel/types").Directive | import("@babel/types").DirectiveLiteral | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EmptyTypeAnnotation | import("@babel/types").EnumBooleanBody | import("@babel/types").EnumBooleanMember | import("@babel/types").EnumDeclaration | import("@babel/types").EnumDefaultedMember | import("@babel/types").EnumNumberBody | import("@babel/types").EnumNumberMember | import("@babel/types").EnumStringBody | import("@babel/types").EnumStringMember | import("@babel/types").EnumSymbolBody | import("@babel/types").ExistsTypeAnnotation | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportDefaultSpecifier | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportNamespaceSpecifier | import("@babel/types").ExportSpecifier | import("@babel/types").ExpressionStatement | import("@babel/types").File | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").FunctionTypeAnnotation | import("@babel/types").FunctionTypeParam | import("@babel/types").GenericTypeAnnotation | import("@babel/types").IfStatement | import("@babel/types").Import | import("@babel/types").ImportAttribute | import("@babel/types").ImportDeclaration | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier | import("@babel/types").ImportSpecifier | import("@babel/types").IndexedAccessType | import("@babel/types").InferredPredicate | import("@babel/types").InterfaceDeclaration | import("@babel/types").InterfaceExtends | import("@babel/types").InterfaceTypeAnnotation | import("@babel/types").InterpreterDirective | import("@babel/types").IntersectionTypeAnnotation | import("@babel/types").JSXAttribute | import("@babel/types").JSXClosingElement | import("@babel/types").JSXClosingFragment | import("@babel/types").JSXEmptyExpression | import("@babel/types").JSXExpressionContainer | import("@babel/types").JSXIdentifier | import("@babel/types").JSXMemberExpression | import("@babel/types").JSXNamespacedName | import("@babel/types").JSXOpeningElement | import("@babel/types").JSXOpeningFragment | import("@babel/types").JSXSpreadAttribute | import("@babel/types").JSXSpreadChild | import("@babel/types").JSXText | import("@babel/types").LabeledStatement | import("@babel/types").MixedTypeAnnotation | import("@babel/types").NullLiteralTypeAnnotation | import("@babel/types").NullableTypeAnnotation | import("@babel/types").NumberLiteral | import("@babel/types").NumberLiteralTypeAnnotation | import("@babel/types").NumberTypeAnnotation | import("@babel/types").ObjectMethodComputed | import("@babel/types").ObjectMethodNonComputed | import("@babel/types").ObjectPattern | import("@babel/types").ObjectPropertyComputed | import("@babel/types").ObjectPropertyNonComputed | import("@babel/types").ObjectTypeAnnotation | import("@babel/types").ObjectTypeCallProperty | import("@babel/types").ObjectTypeIndexer | import("@babel/types").ObjectTypeInternalSlot | import("@babel/types").ObjectTypeProperty | import("@babel/types").ObjectTypeSpreadProperty | import("@babel/types").OpaqueType | import("@babel/types").OptionalIndexedAccessType | import("@babel/types").Placeholder | import("@babel/types").PrivateName | import("@babel/types").Program | import("@babel/types").QualifiedTypeIdentifier | import("@babel/types").RegexLiteral | import("@babel/types").RestElement | import("@babel/types").RestProperty | import("@babel/types").ReturnStatement | import("@babel/types").SpreadElement | import("@babel/types").SpreadProperty | import("@babel/types").StaticBlock | import("@babel/types").StringLiteralTypeAnnotation | import("@babel/types").StringTypeAnnotation | import("@babel/types").Super | import("@babel/types").SwitchCase | import("@babel/types").SwitchStatement | import("@babel/types").SymbolTypeAnnotation | import("@babel/types").TSAnyKeyword | import("@babel/types").TSArrayType | import("@babel/types").TSBigIntKeyword | import("@babel/types").TSBooleanKeyword | import("@babel/types").TSCallSignatureDeclaration | import("@babel/types").TSClassImplements | import("@babel/types").TSConditionalType | import("@babel/types").TSConstructSignatureDeclaration | import("@babel/types").TSConstructorType | import("@babel/types").TSDeclareFunction | import("@babel/types").TSDeclareMethodComputed | import("@babel/types").TSDeclareMethodNonComputed | import("@babel/types").TSEnumBody | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSEnumMember | import("@babel/types").TSExportAssignment | import("@babel/types").TSExternalModuleReference | import("@babel/types").TSFunctionType | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSImportType | import("@babel/types").TSIndexSignature | import("@babel/types").TSIndexedAccessType | import("@babel/types").TSInferType | import("@babel/types").TSInterfaceBody | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSInterfaceHeritage | import("@babel/types").TSIntersectionType | import("@babel/types").TSIntrinsicKeyword | import("@babel/types").TSLiteralType | import("@babel/types").TSMappedType | import("@babel/types").TSMethodSignature | import("@babel/types").TSModuleBlock | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamedTupleMember | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSNeverKeyword | import("@babel/types").TSNullKeyword | import("@babel/types").TSNumberKeyword | import("@babel/types").TSObjectKeyword | import("@babel/types").TSOptionalType | import("@babel/types").TSParameterProperty | import("@babel/types").TSParenthesizedType | import("@babel/types").TSPropertySignature | import("@babel/types").TSQualifiedName | import("@babel/types").TSRestType | import("@babel/types").TSStringKeyword | import("@babel/types").TSSymbolKeyword | import("@babel/types").TSTemplateLiteralType | import("@babel/types").TSThisType | import("@babel/types").TSTupleType | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").TSTypeAnnotation | import("@babel/types").TSTypeLiteral | import("@babel/types").TSTypeOperator | import("@babel/types").TSTypeParameter | import("@babel/types").TSTypeParameterDeclaration | import("@babel/types").TSTypeParameterInstantiation | import("@babel/types").TSTypePredicate | import("@babel/types").TSTypeQuery | import("@babel/types").TSTypeReference | import("@babel/types").TSUndefinedKeyword | import("@babel/types").TSUnionType | import("@babel/types").TSUnknownKeyword | import("@babel/types").TSVoidKeyword | import("@babel/types").TemplateElement | import("@babel/types").ThisTypeAnnotation | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TupleTypeAnnotation | import("@babel/types").TypeAlias | import("@babel/types").TypeAnnotation | import("@babel/types").TypeParameter | import("@babel/types").TypeParameterDeclaration | import("@babel/types").TypeParameterInstantiation | import("@babel/types").TypeofTypeAnnotation | import("@babel/types").UnionTypeAnnotation | import("@babel/types").V8IntrinsicIdentifier | import("@babel/types").VariableDeclaration | import("@babel/types").VariableDeclarator | import("@babel/types").Variance | import("@babel/types").VoidPattern | import("@babel/types").VoidTypeAnnotation | import("@babel/types").WhileStatement | import("@babel/types").WithStatement | import("./types.ts").EstreeAccessorProperty | import("./types.ts").EstreeMethodDefinition | import("./types.ts").EstreePropertyDefinition | import("./types.ts").EstreeTSAbstractMethodDefinition | import("./types.ts").EstreeTSAbstractPropertyDefinition | import("./types.ts").EstreeTSAbstractAccessorProperty | import("./types.ts").EstreeChainExpression | import("./types.ts").EstreeLiteral | import("./types.ts").EstreeTSEmptyBodyFunctionExpression | import("./types.ts").EstreePrivateIdentifier | import("./types.ts").EstreeProperty | import("./types.ts").TSTypeCastExpression | import("@babel/types").Expression;
            parse(): import("./index.ts").ParseResult<import("@babel/types").File>;
            parseProgram(this: import("./parser/index.ts").default, program: import("./parser/node.ts").Undone<import("@babel/types").Program>, end: import("./tokenizer/types.ts").TokenType, sourceType: import("@babel/types").Program["sourceType"]): import("@babel/types").Program;
            stmtToDirective(stmt: import("@babel/types").ExpressionStatement): import("@babel/types").Directive;
            parseInterpreterDirective(): import("@babel/types").InterpreterDirective | null;
            isLet(): boolean;
            isUsing(): boolean;
            isForUsing(): boolean;
            nextTokenIsIdentifierOnSameLine(): boolean;
            isAwaitUsing(): boolean;
            chStartsBindingIdentifier(ch: number, pos: number): boolean;
            chStartsBindingPattern(ch: number): ch is 91 | 123;
            hasFollowingBindingAtom(): boolean;
            hasInLineFollowingBindingIdentifierOrBrace(): boolean;
            allowsUsing(): boolean;
            parseModuleItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementListItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementOrSloppyAnnexBFunctionDeclaration(this: import("./parser/index.ts").default, allowLabeledFunction?: boolean): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatement(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementContent(this: import("./parser/index.ts").default, flags: import("./parser/statement.ts").ParseStatementFlag, decorators?: import("@babel/types").Decorator[] | null): import("@babel/types").Statement;
            maybeTakeDecorators<T extends import("./parser/node.ts").Undone<import("@babel/types").Class>>(maybeDecorators: import("@babel/types").Decorator[] | null | undefined, classNode: T, exportNode?: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration>): T;
            canHaveLeadingDecorator(): boolean;
            parseDecorators(this: import("./parser/index.ts").default, allowExport?: boolean): import("@babel/types").Decorator[];
            parseDecorator(this: import("./parser/index.ts").default): import("@babel/types").Decorator;
            parseMaybeDecoratorArguments(this: import("./parser/index.ts").default, expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position): import("@babel/types").Expression;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: true): import("@babel/types").BreakStatement;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: false): import("@babel/types").ContinueStatement;
            verifyBreakContinue(node: import("./parser/node.ts").Undone<import("@babel/types").BreakStatement | import("@babel/types").ContinueStatement>, isBreak: boolean): void;
            parseDebuggerStatement(node: import("./parser/node.ts").Undone<import("@babel/types").DebuggerStatement>): import("@babel/types").DebuggerStatement;
            parseHeaderExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            parseDoWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoWhileStatement>): import("@babel/types").DoWhileStatement;
            parseForStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").For>): import("@babel/types").For;
            parseFunctionStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionDeclaration>, isAsync: boolean, isHangingDeclaration: boolean): import("@babel/types").FunctionDeclaration;
            parseIfStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").IfStatement>): import("@babel/types").IfStatement;
            parseReturnStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ReturnStatement>): import("@babel/types").ReturnStatement;
            parseSwitchStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").SwitchStatement>): import("@babel/types").SwitchStatement;
            parseThrowStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ThrowStatement>): import("@babel/types").ThrowStatement;
            parseCatchClauseParam(this: import("./parser/index.ts").default): Exclude<ReturnType<typeof this.parseBindingAtom>, import("@babel/types").VoidPattern>;
            parseTryStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").TryStatement>): import("@babel/types").TryStatement;
            parseVarStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("@babel/types").VariableDeclaration;
            parseWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WhileStatement>): import("@babel/types").WhileStatement;
            parseWithStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WithStatement>): import("@babel/types").WithStatement;
            parseEmptyStatement(node: import("./parser/node.ts").Undone<import("@babel/types").EmptyStatement>): import("@babel/types").EmptyStatement;
            parseLabeledStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").LabeledStatement>, maybeName: string, expr: import("@babel/types").Identifier, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").LabeledStatement;
            parseBlock(this: import("./parser/index.ts").default, allowDirectives?: boolean, createNewLexicalScope?: boolean, afterBlockParse?: (hasStrictModeDirective: boolean) => void): import("@babel/types").BlockStatement;
            isValidDirective(stmt: import("@babel/types").Statement): stmt is import("@babel/types").ExpressionStatement;
            parseBlockBody(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("./types.ts").BlockStatementLike>, allowDirectives: boolean | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseBlockOrModuleBlockBody(this: import("./parser/index.ts").default, body: import("@babel/types").Statement[], directives: import("@babel/types").Directive[] | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseFor(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForStatement>, init?: import("@babel/types").VariableDeclaration | import("@babel/types").Expression | null): import("@babel/types").ForStatement;
            parseForX(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForXStatement>, init: import("@babel/types").VariableDeclaration | import("@babel/types").AssignmentPattern | import("@babel/types").Identifier | import("@babel/types").MemberExpression, awaitAt?: import("./util/location.ts").Position | null): import("@babel/types").ForXStatement;
            parseVar(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, isFor: boolean, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>;
            parseAsyncFunctionExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionExpression>): import("@babel/types").FunctionExpression;
            parseFunction<T extends import("./types.ts").NormalFunction>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, flags?: import("./parser/statement.ts").ParseFunctionFlag): T;
            parseFunctionId(requireId?: boolean): import("@babel/types").Identifier | undefined | null;
            registerFunctionStatementId(node: import("./types.ts").NormalFunction): void;
            parseClass<T extends import("@babel/types").Class>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, isStatement: boolean, optionalId?: boolean): T;
            nameIsConstructor(key: import("@babel/types").Expression | import("@babel/types").PrivateName): boolean;
            parseClassBody(this: import("./parser/index.ts").default, hadSuperClass: boolean, oldStrict: boolean): import("@babel/types").ClassBody;
            parseClassMemberFromModifier(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): boolean;
            parseClassMemberWithIsStatic(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>, state: import("./types.ts").ParseClassMemberState, isStatic: boolean): void;
            parseClassElementName(this: import("./parser/index.ts").default, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): import("@babel/types").Expression | import("@babel/types").Identifier | import("@babel/types").PrivateName;
            parseClassStaticBlock(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("@babel/types").StaticBlock & {
                decorators?: import("@babel/types").Decorator[];
            }>): void;
            pushClassProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty>): void;
            pushClassPrivateProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateProperty>): void;
            pushClassAccessorProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>, isPrivate: boolean): void;
            declareClassPrivateMethodInScope(node: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod | import("@babel/types").TSDeclareMethod>, kind: number): void;
            parsePostMemberNameModifiers(methodOrProp: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty>): void;
            parseClassAccessorProperty(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>): import("@babel/types").ClassAccessorProperty;
            parseInitializer(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty | import("@babel/types").ClassPrivateProperty | import("@babel/types").ClassAccessorProperty>): void;
            parseExport(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, decorators: import("@babel/types").Decorator[] | null | undefined): import("./types.ts").AnyExport;
            maybeParseExportDefaultSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportNamedSpecifiers(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportDeclaration(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>): boolean;
            isAsyncFunction(): boolean;
            parseExportFrom(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>, expect?: boolean): void;
            checkNamedExport(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>, isFrom?: boolean): void;
            checkDeclaration(node: import("@babel/types").Identifier | import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").ObjectProperty): void;
            checkDuplicateExports(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier | import("@babel/types").StringLiteral | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportSpecifier | import("@babel/types").ExportDefaultSpecifier>, exportName: string): void;
            parseExportSpecifiers(isInTypeExport: boolean): import("@babel/types").ExportSpecifier[];
            parseExportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportSpecifier>, isString: boolean, isInTypeExport: boolean, isMaybeTypeOnly: boolean): import("@babel/types").ExportSpecifier;
            parseModuleExportName(): import("@babel/types").StringLiteral | import("@babel/types").Identifier;
            checkImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            parseMaybeImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").TSImportEqualsDeclaration>, isExport: boolean): import("@babel/types").Identifier | null;
            isPrecedingIdImportPhase(phase: string): boolean;
            parseImport(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("./types.ts").AnyImport;
            parseImportSpecifiersAndAfter(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): import("@babel/types").ImportDeclaration;
            parseImportSourceAndAttributes(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("@babel/types").ImportDeclaration;
            parseImportSource(this: import("./parser/index.ts").default): import("@babel/types").StringLiteral;
            finishImportSpecifier<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(specifier: import("./parser/node.ts").Undone<T>, type: T["type"], bindingType?: import("./util/scopeflags.ts").BindingFlag): T;
            parseImportAttributes(): import("@babel/types").ImportAttribute[];
            maybeParseImportAttributes(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): void;
            maybeParseDefaultImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): boolean;
            maybeParseStarImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): boolean;
            parseNamedImportSpecifiers(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            isThisParam(param: import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty | import("@babel/types").RestElement): boolean;
            checkProto(prop: import("./types.ts").ObjectMember | import("@babel/types").SpreadElement, sawProto: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): boolean;
            shouldExitDescending(expr: import("@babel/types").Expression | import("@babel/types").PrivateName | import("@babel/types").Super | import("@babel/types").Import): expr is import("@babel/types").ArrowFunctionExpression;
            getExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression & import("./types.ts").ParserOutput;
            parseExpression(this: import("./parser/index.ts").default, disallowIn?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExpressionBase(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseMaybeAssignDisallowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            setOptionalParametersError(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            parseMaybeConditional(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseMaybeUnaryOrPrivate(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression | import("@babel/types").PrivateName;
            parseExprOps(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExprOp(this: import("./parser/index.ts").default, left: import("@babel/types").Expression | import("@babel/types").PrivateName, leftStartLoc: import("./util/location.ts").Position, minPrec: number): import("@babel/types").Expression;
            parseExprOpRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseExprOpBaseRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseHackPipeBody(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            checkExponentialAfterUnary(node: import("@babel/types").AwaitExpression | import("./parser/node.ts").Undone<import("@babel/types").UnaryExpression>): void;
            parseMaybeUnary(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, sawUnary?: boolean): import("@babel/types").Expression;
            parseUpdate(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").UpdateExpression>, update: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseExprSubscripts(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            stopParseSubscript(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseMember(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, computed: boolean, optional: boolean): import("@babel/types").OptionalMemberExpression | import("@babel/types").MemberExpression;
            parseBind(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseCoverCallAndAsyncArrowHead(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, optional: boolean): import("@babel/types").Expression;
            parseTaggedTemplateExpression(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").TaggedTemplateExpression;
            atPossibleAsyncArrow(base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import): boolean;
            finishCallExpression<T extends import("@babel/types").CallExpression | import("@babel/types").OptionalCallExpression>(node: import("./parser/node.ts").Undone<T>, optional: boolean): T;
            parseCallExpressionArguments(this: import("./parser/index.ts").default, allowPlaceholder?: boolean, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): (import("@babel/types").Expression | import("@babel/types").SpreadElement)[];
            parseNoCallExpr(this: import("./parser/index.ts").default, onUnparenthesizedImportExpression: (base: import("@babel/types").ImportExpression) => void): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseExprAtom(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseTopicReferenceThenEqualsSign(topicTokenType: import("./tokenizer/types.ts").TokenType, topicTokenValue: string): import("@babel/types").Expression;
            parseTopicReference(pipeProposal: string): import("@babel/types").Expression;
            finishTopicReference(node: import("./parser/node.ts").Undone<import("@babel/types").TopicReference>, startLoc: import("./util/location.ts").Position, pipeProposal: string, tokenType: import("./tokenizer/types.ts").TokenType): import("@babel/types").TopicReference;
            testTopicReferenceConfiguration(pipeProposal: string, startLoc: import("./util/location.ts").Position, tokenType: import("./tokenizer/types.ts").TokenType): boolean;
            parseAsyncArrowUnaryFunction(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("@babel/types").ArrowFunctionExpression;
            parseDo(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoExpression>, isAsync: boolean): import("@babel/types").DoExpression;
            parseSuper(): import("@babel/types").Super;
            parsePrivateName(): import("@babel/types").PrivateName;
            parseFunctionOrFunctionSent(this: import("./parser/index.ts").default): import("@babel/types").FunctionExpression | import("@babel/types").MetaProperty;
            parseMetaProperty(node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty>, meta: import("@babel/types").Identifier, propertyName: string): import("@babel/types").MetaProperty;
            parseImportMetaPropertyOrPhaseCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty | import("@babel/types").ImportExpression>): import("@babel/types").MetaProperty | import("@babel/types").ImportExpression;
            parseLiteralAtNode<T extends import("./types.ts").Node>(value: any, type: T["type"], node: any): T;
            parseLiteral<T extends import("./types.ts").Node>(value: any, type: T["type"]): T;
            parseStringLiteral(value: any): import("@babel/types").StringLiteral;
            parseNumericLiteral(value: any): import("@babel/types").NumericLiteral;
            parseBigIntLiteral(value: any): import("@babel/types").BigIntLiteral;
            parseRegExpLiteral(value: {
                value: any;
                pattern: string;
                flags: import("@babel/types").RegExpLiteral["flags"];
            }): import("@babel/types").RegExpLiteral;
            parseBooleanLiteral(value: boolean): import("@babel/types").BooleanLiteral;
            parseNullLiteral(): import("@babel/types").NullLiteral;
            wrapParenthesis(startLoc: import("./util/location.ts").Position, expression: import("@babel/types").Expression): import("@babel/types").Expression;
            parseNewOrNewTarget(this: import("./parser/index.ts").default): import("@babel/types").NewExpression | import("@babel/types").MetaProperty;
            parseNew(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").NewExpression>): import("@babel/types").NewExpression;
            parseTemplateElement(isTagged: boolean): import("@babel/types").TemplateElement;
            parseTemplate(this: import("./parser/index.ts").default, isTagged: boolean): import("@babel/types").TemplateLiteral;
            parseTemplateSubstitution(this: import("./parser/index.ts").default): import("@babel/types").Expression | import("@babel/types").TSType;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: true, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectPattern;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectExpression;
            addTrailingCommaExtraToNode(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): void;
            maybeAsyncOrAccessorProp(prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty | import("@babel/types").ObjectMethod>): prop is typeof prop & {
                key: import("@babel/types").Identifier;
            };
            parsePropertyDefinition(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("./types.ts").ObjectMember | import("@babel/types").SpreadElement;
            getGetterSetterExpectedParamCount(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): number;
            getObjectOrClassMethodParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): (import("@babel/types").TSParameterProperty | import("@babel/types").FunctionParameter)[] | import("@babel/types").FunctionParameter[];
            parseObjectMethod(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod>, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean): import("@babel/types").ObjectMethod | undefined | null;
            parseObjectProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>, startLoc: import("./util/location.ts").Position | undefined | null, isPattern: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectProperty | undefined | null;
            finishObjectProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>): import("@babel/types").ObjectProperty;
            parsePropertyName(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember> | import("@babel/types").TSPropertySignature | import("@babel/types").TSMethodSignature, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): void;
            initFunction(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isAsync: boolean): void;
            parseMethod<T extends import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod | import("@babel/types").ClassPrivateMethod>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowDirectSuper: boolean, type: T["type"], inClassScope?: boolean): T;
            parseArrowExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | null | undefined, isAsync: boolean, trailingCommaLoc?: import("./util/location.ts").Position | null): import("@babel/types").ArrowFunctionExpression;
            isSimpleParameter(node: import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty): boolean;
            isSimpleParamList(params: readonly (import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty)[]): boolean;
            parseExprList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null): (import("@babel/types").Expression | null)[];
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression | null;
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression;
            parseIdentifier(liberal?: boolean): import("@babel/types").Identifier;
            createIdentifier(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string): import("@babel/types").Identifier;
            createIdentifierAt(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string, endLoc: import("./util/location.ts").Position): import("@babel/types").Identifier;
            parseIdentifierName(liberal?: boolean): string;
            checkReservedWord(word: string, startLoc: number, checkKeywords: boolean, isBinding: boolean): void;
            recordAwaitIfAllowed(): boolean;
            parseAwait(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position, soloAwait?: boolean): import("@babel/types").AwaitExpression;
            isAmbiguousPrefixOrIdentifier(): boolean;
            parseYield(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position): import("@babel/types").YieldExpression;
            parseImportCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportExpression>): import("@babel/types").ImportExpression;
            withTopicBindingContext<T>(callback: () => T): T;
            allowInAnd<T>(callback: () => T): T;
            disallowInAnd<T>(callback: () => T): T;
            registerTopicReference(): void;
            topicReferenceIsAllowedInCurrentContext(): boolean;
            topicReferenceWasUsedInCurrentContext(): boolean;
            parseFSharpPipelineBody(this: import("./parser/index.ts").default, prec: number): import("@babel/types").Expression;
            parseModuleExpression(this: import("./parser/index.ts").default): import("@babel/types").ModuleExpression;
            parseVoidPattern(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").VoidPattern;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            toAssignableObjectExpressionProp(prop: import("./types.ts").Node, isLast: boolean, isLHS: boolean): void;
            toAssignableList(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[], trailingCommaLoc: import("./util/location.ts").Position | undefined | null, isLHS: boolean): void;
            parseSpread(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").SpreadElement;
            parseRestBinding(this: import("./parser/index.ts").default): import("@babel/types").RestElement;
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.ALLOW_EMPTY): (import("@babel/types").Pattern | import("@babel/types").RestElement | null)[];
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.IS_FUNCTION_PARAMS): (import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").TSParameterProperty)[];
            parseBindingRestProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").RestElement>): import("@babel/types").RestElement;
            parseBindingProperty(this: import("./parser/index.ts").default): import("./types.ts").AssignmentProperty | import("@babel/types").RestElement;
            parseBindingElement(this: import("./parser/index.ts").default, flags: import("./parser/lval.ts").ParseBindingListFlags, decorators: import("@babel/types").Decorator[]): import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty;
            isOptionalMemberExpression(expression: import("./types.ts").Node): boolean;
            checkLVal(expression: import("@babel/types").Expression | import("./types.ts").ObjectMember | import("@babel/types").RestElement | import("@babel/types").Pattern | import("@babel/types").TSParameterProperty | import("./types.ts").TSTypeCastExpression, ancestor: import("./parse-error.ts").LValAncestor, binding?: import("./util/scopeflags.ts").BindingFlag, checkClashes?: Set<string> | false, strictModeChanged?: boolean, hasParenthesizedAncestor?: boolean, disallowCallExpression?: boolean): void;
            checkIdentifier(at: import("@babel/types").Identifier, bindingType: import("./util/scopeflags.ts").BindingFlag, strictModeChanged?: boolean): void;
            declareNameFromIdentifier(identifier: import("@babel/types").Identifier, binding: import("./util/scopeflags.ts").BindingFlag): void;
            checkToRestConversion(node: import("./types.ts").Node, allowPattern: boolean): void;
            checkCommaAfterRest(close: typeof import("charcodes")[keyof typeof import("charcodes")]): boolean;
            createPosition(loc: import("./util/location.ts").Position): import("./util/location.ts").Position;
            startNode<T extends import("./types.ts").Node = never>(): import("./parser/node.ts").Undone<T>;
            startNodeAt<T extends import("./types.ts").Node = never>(loc: import("./util/location.ts").Position): import("./parser/node.ts").Undone<T>;
            startNodeAtNode<T extends import("./types.ts").Node = never>(type: import("./parser/node.ts").Undone<import("./types.ts").Node>): import("./parser/node.ts").Undone<T>;
            finishNode<T extends import("./types.ts").Node>(node: import("./parser/node.ts").Undone<T>, type: T["type"]): T;
            finishNodeAt<T extends import("./types.ts").Node>(node: Omit<T, "type">, type: T["type"], endLoc: import("./util/location.ts").Position): T;
            finishNodeAtNode<T extends import("./types.ts").Node>(node: Omit<T, "type">, type: T["type"], endNode: import("./types.ts").Node): T;
            resetStartLocation(node: import("./types.ts").BaseNode, startLoc: import("./util/location.ts").Position): void;
            resetEndLocation(node: import("./types.ts").BaseNode, endLoc?: import("./util/location.ts").Position): void;
            resetStartLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            resetEndLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            castNodeTo<T extends import("./types.ts").Node["type"]>(node: import("./types.ts").Node, type: T): Extract<import("@babel/types").AnyTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ArgumentPlaceholder, {
                type: T;
            }> | Extract<import("@babel/types").ArrayExpression, {
                type: T;
            }> | Extract<import("@babel/types").ArrayPattern, {
                type: T;
            }> | Extract<import("@babel/types").ArrayTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ArrowFunctionExpression, {
                type: T;
            }> | Extract<import("@babel/types").AssignmentExpression, {
                type: T;
            }> | Extract<import("@babel/types").AssignmentPattern, {
                type: T;
            }> | Extract<import("@babel/types").AwaitExpression, {
                type: T;
            }> | Extract<import("@babel/types").BigIntLiteral, {
                type: T;
            }> | Extract<import("@babel/types").BigIntLiteralTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").BinaryExpressionIn, {
                type: T;
            }> | Extract<import("@babel/types").BinaryExpressionNotIn, {
                type: T;
            }> | Extract<import("@babel/types").BindExpression, {
                type: T;
            }> | Extract<import("@babel/types").BlockStatement, {
                type: T;
            }> | Extract<import("@babel/types").BooleanLiteral, {
                type: T;
            }> | Extract<import("@babel/types").BooleanLiteralTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").BooleanTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").BreakStatement, {
                type: T;
            }> | Extract<import("@babel/types").CallExpression, {
                type: T;
            }> | Extract<import("@babel/types").CatchClause, {
                type: T;
            }> | Extract<import("@babel/types").ClassAccessorPropertyComputed, {
                type: T;
            }> | Extract<import("@babel/types").ClassAccessorPropertyNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ClassBody, {
                type: T;
            }> | Extract<import("@babel/types").ClassDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").ClassExpression, {
                type: T;
            }> | Extract<import("@babel/types").ClassImplements, {
                type: T;
            }> | Extract<import("@babel/types").ClassMethodComputed, {
                type: T;
            }> | Extract<import("@babel/types").ClassMethodNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ClassPrivateMethod, {
                type: T;
            }> | Extract<import("@babel/types").ClassPrivateProperty, {
                type: T;
            }> | Extract<import("@babel/types").ClassPropertyComputed, {
                type: T;
            }> | Extract<import("@babel/types").ClassPropertyNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ConditionalExpression, {
                type: T;
            }> | Extract<import("@babel/types").ContinueStatement, {
                type: T;
            }> | Extract<import("@babel/types").DebuggerStatement, {
                type: T;
            }> | Extract<import("@babel/types").DeclareClass, {
                type: T;
            }> | Extract<import("@babel/types").DeclareExportAllDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").DeclareExportDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").DeclareFunction, {
                type: T;
            }> | Extract<import("@babel/types").DeclareInterface, {
                type: T;
            }> | Extract<import("@babel/types").DeclareModule, {
                type: T;
            }> | Extract<import("@babel/types").DeclareModuleExports, {
                type: T;
            }> | Extract<import("@babel/types").DeclareOpaqueType, {
                type: T;
            }> | Extract<import("@babel/types").DeclareTypeAlias, {
                type: T;
            }> | Extract<import("@babel/types").DeclareVariable, {
                type: T;
            }> | Extract<import("@babel/types").DeclaredPredicate, {
                type: T;
            }> | Extract<import("@babel/types").Decorator, {
                type: T;
            }> | Extract<import("@babel/types").Directive, {
                type: T;
            }> | Extract<import("@babel/types").DirectiveLiteral, {
                type: T;
            }> | Extract<import("@babel/types").DoExpression, {
                type: T;
            }> | Extract<import("@babel/types").DoWhileStatement, {
                type: T;
            }> | Extract<import("@babel/types").EmptyStatement, {
                type: T;
            }> | Extract<import("@babel/types").EmptyTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").EnumBooleanBody, {
                type: T;
            }> | Extract<import("@babel/types").EnumBooleanMember, {
                type: T;
            }> | Extract<import("@babel/types").EnumDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").EnumDefaultedMember, {
                type: T;
            }> | Extract<import("@babel/types").EnumNumberBody, {
                type: T;
            }> | Extract<import("@babel/types").EnumNumberMember, {
                type: T;
            }> | Extract<import("@babel/types").EnumStringBody, {
                type: T;
            }> | Extract<import("@babel/types").EnumStringMember, {
                type: T;
            }> | Extract<import("@babel/types").EnumSymbolBody, {
                type: T;
            }> | Extract<import("@babel/types").ExistsTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ExportAllDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").ExportDefaultDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").ExportDefaultSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").ExportNamedDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").ExportNamespaceSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").ExportSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").ExpressionStatement, {
                type: T;
            }> | Extract<import("@babel/types").File, {
                type: T;
            }> | Extract<import("@babel/types").ForInStatement, {
                type: T;
            }> | Extract<import("@babel/types").ForOfStatement, {
                type: T;
            }> | Extract<import("@babel/types").ForStatement, {
                type: T;
            }> | Extract<import("@babel/types").FunctionDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").FunctionExpression, {
                type: T;
            }> | Extract<import("@babel/types").FunctionTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").FunctionTypeParam, {
                type: T;
            }> | Extract<import("@babel/types").GenericTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").Identifier, {
                type: T;
            }> | Extract<import("@babel/types").IfStatement, {
                type: T;
            }> | Extract<import("@babel/types").Import, {
                type: T;
            }> | Extract<import("@babel/types").ImportAttribute, {
                type: T;
            }> | Extract<import("@babel/types").ImportDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").ImportDefaultSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").ImportExpression, {
                type: T;
            }> | Extract<import("@babel/types").ImportNamespaceSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").ImportSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").IndexedAccessType, {
                type: T;
            }> | Extract<import("@babel/types").InferredPredicate, {
                type: T;
            }> | Extract<import("@babel/types").InterfaceDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").InterfaceExtends, {
                type: T;
            }> | Extract<import("@babel/types").InterfaceTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").InterpreterDirective, {
                type: T;
            }> | Extract<import("@babel/types").IntersectionTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").JSXAttribute, {
                type: T;
            }> | Extract<import("@babel/types").JSXClosingElement, {
                type: T;
            }> | Extract<import("@babel/types").JSXClosingFragment, {
                type: T;
            }> | Extract<import("@babel/types").JSXElement, {
                type: T;
            }> | Extract<import("@babel/types").JSXEmptyExpression, {
                type: T;
            }> | Extract<import("@babel/types").JSXExpressionContainer, {
                type: T;
            }> | Extract<import("@babel/types").JSXFragment, {
                type: T;
            }> | Extract<import("@babel/types").JSXIdentifier, {
                type: T;
            }> | Extract<import("@babel/types").JSXMemberExpression, {
                type: T;
            }> | Extract<import("@babel/types").JSXNamespacedName, {
                type: T;
            }> | Extract<import("@babel/types").JSXOpeningElement, {
                type: T;
            }> | Extract<import("@babel/types").JSXOpeningFragment, {
                type: T;
            }> | Extract<import("@babel/types").JSXSpreadAttribute, {
                type: T;
            }> | Extract<import("@babel/types").JSXSpreadChild, {
                type: T;
            }> | Extract<import("@babel/types").JSXText, {
                type: T;
            }> | Extract<import("@babel/types").LabeledStatement, {
                type: T;
            }> | Extract<import("@babel/types").LogicalExpression, {
                type: T;
            }> | Extract<import("@babel/types").MemberExpressionComputed, {
                type: T;
            }> | Extract<import("@babel/types").MemberExpressionNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").MetaProperty, {
                type: T;
            }> | Extract<import("@babel/types").MixedTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ModuleExpression, {
                type: T;
            }> | Extract<import("@babel/types").NewExpression, {
                type: T;
            }> | Extract<import("@babel/types").NullLiteral, {
                type: T;
            }> | Extract<import("@babel/types").NullLiteralTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").NullableTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").NumberLiteral, {
                type: T;
            }> | Extract<import("@babel/types").NumberLiteralTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").NumberTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").NumericLiteral, {
                type: T;
            }> | Extract<import("@babel/types").ObjectExpression, {
                type: T;
            }> | Extract<import("@babel/types").ObjectMethodComputed, {
                type: T;
            }> | Extract<import("@babel/types").ObjectMethodNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ObjectPattern, {
                type: T;
            }> | Extract<import("@babel/types").ObjectPropertyComputed, {
                type: T;
            }> | Extract<import("@babel/types").ObjectPropertyNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeCallProperty, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeIndexer, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeInternalSlot, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeProperty, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeSpreadProperty, {
                type: T;
            }> | Extract<import("@babel/types").OpaqueType, {
                type: T;
            }> | Extract<import("@babel/types").OptionalCallExpression, {
                type: T;
            }> | Extract<import("@babel/types").OptionalIndexedAccessType, {
                type: T;
            }> | Extract<import("@babel/types").OptionalMemberExpressionComputed, {
                type: T;
            }> | Extract<import("@babel/types").OptionalMemberExpressionNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ParenthesizedExpression, {
                type: T;
            }> | Extract<import("@babel/types").Placeholder, {
                type: T;
            }> | Extract<import("@babel/types").PrivateName, {
                type: T;
            }> | Extract<import("@babel/types").Program, {
                type: T;
            }> | Extract<import("@babel/types").QualifiedTypeIdentifier, {
                type: T;
            }> | Extract<import("@babel/types").RegExpLiteral, {
                type: T;
            }> | Extract<import("@babel/types").RegexLiteral, {
                type: T;
            }> | Extract<import("@babel/types").RestElement, {
                type: T;
            }> | Extract<import("@babel/types").RestProperty, {
                type: T;
            }> | Extract<import("@babel/types").ReturnStatement, {
                type: T;
            }> | Extract<import("@babel/types").SequenceExpression, {
                type: T;
            }> | Extract<import("@babel/types").SpreadElement, {
                type: T;
            }> | Extract<import("@babel/types").SpreadProperty, {
                type: T;
            }> | Extract<import("@babel/types").StaticBlock, {
                type: T;
            }> | Extract<import("@babel/types").StringLiteral, {
                type: T;
            }> | Extract<import("@babel/types").StringLiteralTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").StringTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").Super, {
                type: T;
            }> | Extract<import("@babel/types").SwitchCase, {
                type: T;
            }> | Extract<import("@babel/types").SwitchStatement, {
                type: T;
            }> | Extract<import("@babel/types").SymbolTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").TSAnyKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSArrayType, {
                type: T;
            }> | Extract<import("@babel/types").TSAsExpression, {
                type: T;
            }> | Extract<import("@babel/types").TSBigIntKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSBooleanKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSCallSignatureDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSClassImplements, {
                type: T;
            }> | Extract<import("@babel/types").TSConditionalType, {
                type: T;
            }> | Extract<import("@babel/types").TSConstructSignatureDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSConstructorType, {
                type: T;
            }> | Extract<import("@babel/types").TSDeclareFunction, {
                type: T;
            }> | Extract<import("@babel/types").TSDeclareMethodComputed, {
                type: T;
            }> | Extract<import("@babel/types").TSDeclareMethodNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").TSEnumBody, {
                type: T;
            }> | Extract<import("@babel/types").TSEnumDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSEnumMember, {
                type: T;
            }> | Extract<import("@babel/types").TSExportAssignment, {
                type: T;
            }> | Extract<import("@babel/types").TSExternalModuleReference, {
                type: T;
            }> | Extract<import("@babel/types").TSFunctionType, {
                type: T;
            }> | Extract<import("@babel/types").TSImportEqualsDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSImportType, {
                type: T;
            }> | Extract<import("@babel/types").TSIndexSignature, {
                type: T;
            }> | Extract<import("@babel/types").TSIndexedAccessType, {
                type: T;
            }> | Extract<import("@babel/types").TSInferType, {
                type: T;
            }> | Extract<import("@babel/types").TSInstantiationExpression, {
                type: T;
            }> | Extract<import("@babel/types").TSInterfaceBody, {
                type: T;
            }> | Extract<import("@babel/types").TSInterfaceDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSInterfaceHeritage, {
                type: T;
            }> | Extract<import("@babel/types").TSIntersectionType, {
                type: T;
            }> | Extract<import("@babel/types").TSIntrinsicKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSLiteralType, {
                type: T;
            }> | Extract<import("@babel/types").TSMappedType, {
                type: T;
            }> | Extract<import("@babel/types").TSMethodSignature, {
                type: T;
            }> | Extract<import("@babel/types").TSModuleBlock, {
                type: T;
            }> | Extract<import("@babel/types").TSModuleDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSNamedTupleMember, {
                type: T;
            }> | Extract<import("@babel/types").TSNamespaceExportDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSNeverKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSNonNullExpression, {
                type: T;
            }> | Extract<import("@babel/types").TSNullKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSNumberKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSObjectKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSOptionalType, {
                type: T;
            }> | Extract<import("@babel/types").TSParameterProperty, {
                type: T;
            }> | Extract<import("@babel/types").TSParenthesizedType, {
                type: T;
            }> | Extract<import("@babel/types").TSPropertySignature, {
                type: T;
            }> | Extract<import("@babel/types").TSQualifiedName, {
                type: T;
            }> | Extract<import("@babel/types").TSRestType, {
                type: T;
            }> | Extract<import("@babel/types").TSSatisfiesExpression, {
                type: T;
            }> | Extract<import("@babel/types").TSStringKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSSymbolKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSTemplateLiteralType, {
                type: T;
            }> | Extract<import("@babel/types").TSThisType, {
                type: T;
            }> | Extract<import("@babel/types").TSTupleType, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeAliasDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeAssertion, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeLiteral, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeOperator, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeParameter, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeParameterDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeParameterInstantiation, {
                type: T;
            }> | Extract<import("@babel/types").TSTypePredicate, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeQuery, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeReference, {
                type: T;
            }> | Extract<import("@babel/types").TSUndefinedKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSUnionType, {
                type: T;
            }> | Extract<import("@babel/types").TSUnknownKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSVoidKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TaggedTemplateExpression, {
                type: T;
            }> | Extract<import("@babel/types").TemplateElement, {
                type: T;
            }> | Extract<import("@babel/types").TemplateLiteral, {
                type: T;
            }> | Extract<import("@babel/types").ThisExpression, {
                type: T;
            }> | Extract<import("@babel/types").ThisTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ThrowStatement, {
                type: T;
            }> | Extract<import("@babel/types").TopicReference, {
                type: T;
            }> | Extract<import("@babel/types").TryStatement, {
                type: T;
            }> | Extract<import("@babel/types").TupleTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").TypeAlias, {
                type: T;
            }> | Extract<import("@babel/types").TypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").TypeCastExpression, {
                type: T;
            }> | Extract<import("@babel/types").TypeParameter, {
                type: T;
            }> | Extract<import("@babel/types").TypeParameterDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TypeParameterInstantiation, {
                type: T;
            }> | Extract<import("@babel/types").TypeofTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").UnaryExpression, {
                type: T;
            }> | Extract<import("@babel/types").UnionTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").UpdateExpression, {
                type: T;
            }> | Extract<import("@babel/types").V8IntrinsicIdentifier, {
                type: T;
            }> | Extract<import("@babel/types").VariableDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").VariableDeclarator, {
                type: T;
            }> | Extract<import("@babel/types").Variance, {
                type: T;
            }> | Extract<import("@babel/types").VoidPattern, {
                type: T;
            }> | Extract<import("@babel/types").VoidTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").WhileStatement, {
                type: T;
            }> | Extract<import("@babel/types").WithStatement, {
                type: T;
            }> | Extract<import("@babel/types").YieldExpression, {
                type: T;
            }> | Extract<import("./types.ts").EstreeAccessorProperty, {
                type: T;
            }> | Extract<import("./types.ts").EstreeMethodDefinition, {
                type: T;
            }> | Extract<import("./types.ts").EstreePropertyDefinition, {
                type: T;
            }> | Extract<import("./types.ts").EstreeTSAbstractMethodDefinition, {
                type: T;
            }> | Extract<import("./types.ts").EstreeTSAbstractPropertyDefinition, {
                type: T;
            }> | Extract<import("./types.ts").EstreeTSAbstractAccessorProperty, {
                type: T;
            }> | Extract<import("./types.ts").EstreeChainExpression, {
                type: T;
            }> | Extract<import("./types.ts").EstreeLiteral, {
                type: T;
            }> | Extract<import("./types.ts").EstreeBigIntLiteral, {
                type: T;
            }> | Extract<import("./types.ts").EstreeTSEmptyBodyFunctionExpression, {
                type: T;
            }> | Extract<import("./types.ts").EstreePrivateIdentifier, {
                type: T;
            }> | Extract<import("./types.ts").EstreeProperty, {
                type: T;
            }> | Extract<import("./types.ts").EstreeRegExpLiteral, {
                type: T;
            }> | Extract<import("./types.ts").TSTypeCastExpression, {
                type: T;
            }>;
            cloneIdentifier<T extends import("@babel/types").Identifier | import("./types.ts").Placeholder>(node: T): T;
            cloneStringLiteral<T extends import("@babel/types").StringLiteral | import("./types.ts").EstreeLiteral | import("./types.ts").Placeholder>(node: T): T;
            addExtra(node: Partial<import("./types.ts").Node>, key: string, value: any, enumerable?: boolean): void;
            isContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            isUnparsedContextual(nameStart: number, name: string): boolean;
            isLookaheadContextual(name: string): boolean;
            eatContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            expectContextual(token: import("./tokenizer/types.ts").TokenType, toParseError?: import("./parse-error.ts").ParseErrorConstructor<any>): void;
            canInsertSemicolon(): boolean;
            hasPrecedingLineBreak(): boolean;
            hasFollowingLineBreak(): boolean;
            isLineTerminator(): boolean;
            semicolon(allowAsi?: boolean): void;
            expect(type: import("./tokenizer/types.ts").TokenType, loc?: import("./util/location.ts").Position | null): void;
            tryParse<T extends import("./types.ts").Node | readonly import("./types.ts").Node[] | null>(fn: (abort: (node?: T) => never) => T, oldState?: import("./tokenizer/state.ts").default): {
                node: T;
                error: null;
                thrown: false;
                aborted: false;
                failState: null;
            } | {
                node: T | null;
                error: import("./parse-error.ts").ParseError;
                thrown: boolean;
                aborted: false;
                failState: import("./tokenizer/state.ts").default;
            } | {
                node: T | null;
                error: null;
                thrown: false;
                aborted: true;
                failState: import("./tokenizer/state.ts").default;
            };
            checkExpressionErrors(refExpressionErrors: import("./parser/util.ts").ExpressionErrors | undefined | null, andThrow: boolean): boolean | undefined;
            isLiteralPropertyName(): boolean;
            isPrivateName(node: import("./types.ts").Node): node is import("@babel/types").PrivateName;
            getPrivateNameSV(node: import("@babel/types").PrivateName): string;
            hasPropertyAsPrivateName(node: import("./types.ts").Node): boolean;
            isObjectProperty(node: import("./types.ts").Node): node is import("@babel/types").ObjectProperty | import("./types.ts").EstreePropertyDefinition;
            isObjectMethod(node: import("./types.ts").Node): node is import("@babel/types").ObjectMethod;
            initializeScopes(this: import("./parser/index.ts").default, inModule?: boolean): () => void;
            enterInitialScopes(): void;
            checkDestructuringPrivate(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            isLookahead: boolean;
            tokens: (import("./index.ts").Token | import("./types.ts").Comment)[];
            setLoc(loc: import("./util/location.ts").Position): void;
            getLoc(locIndex: number): import("./util/location.ts").Position;
            pushToken(token: import("./index.ts").Token | import("./types.ts").Comment): void;
            next(): void;
            eat(type: import("./tokenizer/types.ts").TokenType): boolean;
            match(type: import("./tokenizer/types.ts").TokenType): boolean;
            createLookaheadState(state: import("./tokenizer/state.ts").default): import("./tokenizer/state.ts").LookaheadState;
            lookahead(): import("./tokenizer/state.ts").LookaheadState;
            nextTokenStart(): number;
            nextTokenStartSince(pos: number): number;
            lookaheadCharCode(): number;
            lookaheadCharCodeSince(pos: number): number;
            nextTokenInLineStart(): number;
            nextTokenInLineStartSince(pos: number): number;
            lookaheadInLineCharCode(): number;
            codePointAtPos(pos: number): number;
            setStrict(strict: boolean): void;
            curContext(): import("./tokenizer/context.ts").TokContext;
            nextToken(): void;
            skipLineComment(startSkip: number): import("./types.ts").CommentLine | undefined;
            skipSpace(): void;
            replaceToken(type: import("./tokenizer/types.ts").TokenType): void;
            readToken_numberSign(): void;
            readToken_dot(): void;
            readToken_slash(): void;
            readToken_interpreter(): boolean;
            readToken_caret(): void;
            readToken_atSign(): void;
            readToken_plus_min(code: number): void;
            readToken_lt(): void;
            readToken_gt(): void;
            readToken_eq_excl(code: number): void;
            readToken_question(): void;
            finishOp(type: import("./tokenizer/types.ts").TokenType, size: number): void;
            readRegexp(): void;
            readInt(radix: number, len?: number, forceLen?: boolean, allowNumSeparator?: boolean | "bail"): number | null;
            readRadixNumber(radix: number): void;
            readNumber(startsWithDot: boolean): void;
            readCodePoint(throwOnInvalid: boolean): number | null;
            readString(quote: number): void;
            readTemplateContinuation(): void;
            readTemplateToken(): void;
            recordStrictModeErrors(toParseError: import("./tokenizer/state.ts").DeferredStrictError, at: import("./util/location.ts").Position): void;
            readWord1(firstCode?: number): string;
            readWord(firstCode?: number): void;
            checkKeywordEscapes(): void;
            raise<ErrorDetails = object>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node> | number, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            raiseOverwrite<ErrorDetails>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node>, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            updateContext(prevType?: import("./tokenizer/types.ts").TokenType): void;
            unexpected(loc?: import("./util/location.ts").Position | number | null, type?: import("./tokenizer/types.ts").TokenType): any;
            expectPlugin(pluginName: import("./typings.d.ts").Plugin, loc?: import("./util/location.ts").Position | number | null): true;
            expectOnePlugin(pluginNames: import("./typings.d.ts").Plugin[]): any;
            errorBuilder(error: import("./parse-error.ts").ParseErrorConstructor<object>): (pos: number, lineStart: number, curLine: number) => void;
            errorHandlers_readInt: import("@babel/helper-string-parser").IntErrorHandlers;
            errorHandlers_readCodePoint: import("@babel/helper-string-parser").CodePointErrorHandlers;
            errorHandlers_readStringContents_string: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            errorHandlers_readStringContents_template: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            processComment(node: import("./types.ts").Node): void;
            finalizeComment(commentWS: import("./parser/comments.ts").CommentWhitespace): void;
            finalizeRemainingComments(): void;
            resetPreviousNodeTrailingComments(node: import("./types.ts").Node): void;
            takeSurroundingComments(node: import("./types.ts").Node, start: number, end: number): void;
            options: import("./options.ts").Options;
            optionFlags: import("./options.ts").OptionFlags;
            inModule: boolean;
            scope: import("./util/scope.ts").default<any>;
            classScope: import("./util/class-scope.ts").default;
            prodParam: import("./util/production-parameter.ts").default;
            expressionScope: import("./util/expression-scope.ts").default;
            plugins: import("./parser/index.ts").PluginsMap;
            filename: string | undefined | null;
            startIndex: number;
            exportedIdentifiers: Set<string>;
            sawUnambiguousESM: boolean;
            ambiguousScriptDifferentAst: boolean;
            state: import("./tokenizer/state.ts").default;
            input: string;
            length: number;
            comments: import("./types.ts").Comment[];
            locData: Uint32Array;
            sourceToOffsetPos(sourcePos: number): number;
            offsetToSourcePos(offsetPos: number): number;
            hasPlugin(pluginConfig: PluginConfig): boolean;
            getPluginOption<PluginName extends import("./typings.d.ts").ParserPluginWithOptions[0], OptionName extends keyof import("./typings.d.ts").PluginOptions<PluginName>>(plugin: PluginName, name: OptionName): NonNullable<import("./typings.d.ts").PluginOptions<PluginName>>[OptionName] | undefined;
        };
    };
    typescript: (superClass: import("./plugins/jsx/index.ts").ClassWithMixin<typeof import("./parser/index.ts").default, import("./plugins/jsx/index.ts").IJSXParserMixin>) => {
        new (options: Partial<import("./options.ts").Options> | null | undefined, input: string, pluginsMap: import("./parser/index.ts").PluginsMap): {
            scope: import("./plugins/typescript/scope.ts").default;
            getScopeHandler(): new (...args: any) => import("./plugins/typescript/scope.ts").default;
            tsIsIdentifier(): boolean;
            tsTokenCanFollowModifier(): boolean;
            tsNextTokenOnSameLineAndCanFollowModifier(): boolean;
            tsNextTokenCanFollowModifier(): boolean;
            tsParseModifier<T extends "const" | import("./types.ts").Accessibility | "readonly" | "abstract" | "declare" | "static" | "override" | import("./types.ts").VarianceAnnotations>(modifiers: Map<T, boolean>, stopOnStartOfClassStaticBlock?: boolean, hasSeenStaticModifier?: boolean | null): T | undefined | null;
            tsParseModifiers<N extends {
                accessibility?: import("./types.ts").Accessibility;
            } & Partial<Record<"const" | import("./types.ts").Accessibility | "readonly" | "abstract" | "declare" | "static" | "override" | import("./types.ts").VarianceAnnotations, boolean | null | undefined>>>(modifiers: Map<"const" | import("./types.ts").Accessibility | "readonly" | "abstract" | "declare" | "static" | "override" | import("./types.ts").VarianceAnnotations, boolean>, errorTemplate: import("./parse-error.ts").ParseErrorConstructor<{
                modifier: "const" | import("./types.ts").Accessibility | "readonly" | "abstract" | "declare" | "static" | "override" | import("./types.ts").VarianceAnnotations;
            }> | undefined, modified: N, stopOnStartOfClassStaticBlock?: boolean): void;
            tsIsListTerminator(kind: "EnumMembers" | "HeritageClauseElement" | "TupleElementTypes" | "TypeMembers" | "TypeParametersOrArguments"): boolean;
            tsParseList<T extends import("./types.ts").Node>(kind: "EnumMembers" | "HeritageClauseElement" | "TupleElementTypes" | "TypeMembers" | "TypeParametersOrArguments", parseElement: () => T): T[];
            tsParseDelimitedList<T extends import("./types.ts").Node>(kind: "EnumMembers" | "HeritageClauseElement" | "TupleElementTypes" | "TypeMembers" | "TypeParametersOrArguments", parseElement: () => T, refTrailingCommaPos?: {
                value: number;
            }): T[];
            tsParseDelimitedListWorker<T extends import("./types.ts").Node>(kind: "EnumMembers" | "HeritageClauseElement" | "TupleElementTypes" | "TypeMembers" | "TypeParametersOrArguments", parseElement: () => T | undefined, expectSuccess: boolean, refTrailingCommaPos?: {
                value: number;
            }): T[] | undefined;
            tsParseBracketedList<T extends import("./types.ts").Node>(kind: "EnumMembers" | "HeritageClauseElement" | "TupleElementTypes" | "TypeMembers" | "TypeParametersOrArguments", parseElement: () => T, bracket: boolean, skipFirstToken: boolean, refTrailingCommaPos?: {
                value: number;
            }): T[];
            tsParseImportType(): import("@babel/types").TSImportType;
            tsParseImportTypeOptions(): import("@babel/types").ObjectExpression;
            tsParseImportTypeWithPropertyValue(): import("@babel/types").ObjectExpression;
            tsParseEntityName(flags: import("./plugins/typescript/index.ts").tsParseEntityNameFlags): import("@babel/types").TSEntityName;
            tsParseTypeReference(): import("@babel/types").TSTypeReference;
            tsParseThisTypePredicate(lhs: import("@babel/types").TSThisType): import("@babel/types").TSTypePredicate;
            tsParseThisTypeNode(): import("@babel/types").TSThisType;
            tsParseTypeQuery(): import("@babel/types").TSTypeQuery;
            tsParseInOutModifiers: (modified: {
                accessibility?: import("./types.ts").Accessibility;
            } & Partial<Record<"const" | import("./types.ts").Accessibility | "readonly" | "abstract" | "declare" | "static" | "override" | import("./types.ts").VarianceAnnotations, boolean | null | undefined>>, stopOnStartOfClassStaticBlock?: boolean | undefined) => void;
            tsParseConstModifier: (modified: {
                accessibility?: import("./types.ts").Accessibility;
            } & Partial<Record<"const" | import("./types.ts").Accessibility | "readonly" | "abstract" | "declare" | "static" | "override" | import("./types.ts").VarianceAnnotations, boolean | null | undefined>>, stopOnStartOfClassStaticBlock?: boolean | undefined) => void;
            tsParseInOutConstModifiers: (modified: {
                accessibility?: import("./types.ts").Accessibility;
            } & Partial<Record<"const" | import("./types.ts").Accessibility | "readonly" | "abstract" | "declare" | "static" | "override" | import("./types.ts").VarianceAnnotations, boolean | null | undefined>>, stopOnStartOfClassStaticBlock?: boolean | undefined) => void;
            tsParseTypeParameter(parseModifiers: (node: import("./parser/node.ts").Undone<import("@babel/types").TSTypeParameter>) => void): import("@babel/types").TSTypeParameter;
            tsTryParseTypeParameters(parseModifiers: (node: import("./parser/node.ts").Undone<import("@babel/types").TSTypeParameter>) => void): import("@babel/types").TSTypeParameterDeclaration | undefined | null;
            tsParseTypeParameters(parseModifiers: (node: import("./parser/node.ts").Undone<import("@babel/types").TSTypeParameter>) => void): import("@babel/types").TSTypeParameterDeclaration;
            tsFillSignature(returnToken: import("./tokenizer/types.ts").TokenType, signature: import("./parser/node.ts").Undone<import("./types.ts").TSSignatureDeclaration>): void;
            tsParseBindingListForSignature(): (import("@babel/types").Identifier | import("@babel/types").RestElement | import("@babel/types").ObjectPattern | import("@babel/types").ArrayPattern | import("@babel/types").VoidPattern)[];
            tsParseTypeMemberSemicolon(): void;
            tsParseSignatureMember(kind: "TSCallSignatureDeclaration" | "TSConstructSignatureDeclaration", node: import("./parser/node.ts").Undone<import("@babel/types").TSCallSignatureDeclaration | import("@babel/types").TSConstructSignatureDeclaration>): import("@babel/types").TSCallSignatureDeclaration | import("@babel/types").TSConstructSignatureDeclaration;
            tsIsUnambiguouslyIndexSignature(): boolean;
            tsTryParseIndexSignature(node: import("./parser/node.ts").Undone<import("@babel/types").TSIndexSignature>): import("@babel/types").TSIndexSignature | undefined;
            tsParsePropertyOrMethodSignature(node: import("./parser/node.ts").Undone<import("@babel/types").TSPropertySignature | import("@babel/types").TSMethodSignature>, readonly: boolean): import("@babel/types").TSPropertySignature | import("@babel/types").TSMethodSignature;
            tsParseTypeMember(): import("@babel/types").TSTypeElement;
            tsParseTypeLiteral(): import("@babel/types").TSTypeLiteral;
            tsParseObjectTypeMembers(): import("@babel/types").TSTypeElement[];
            tsIsStartOfMappedType(): boolean;
            tsParseMappedType(): import("@babel/types").TSMappedType;
            tsParseTupleType(): import("@babel/types").TSTupleType;
            tsParseTupleElementType(): import("@babel/types").TSNamedTupleMember | import("@babel/types").TSType;
            tsParseParenthesizedType(): import("@babel/types").TSParenthesizedType;
            tsParseFunctionOrConstructorType(type: "TSFunctionType" | "TSConstructorType", abstract?: boolean): import("@babel/types").TSFunctionType | import("@babel/types").TSConstructorType;
            tsParseLiteralTypeNode(): import("@babel/types").TSLiteralType;
            tsParseTemplateLiteralType(): import("@babel/types").TSTemplateLiteralType | import("@babel/types").TSLiteralType;
            parseTemplateSubstitution(): import("@babel/types").TSType | import("@babel/types").Expression;
            tsParseThisTypeOrThisTypePredicate(): import("@babel/types").TSThisType | import("@babel/types").TSTypePredicate;
            tsParseNonArrayType(): import("@babel/types").TSType;
            tsParseArrayTypeOrHigher(): import("@babel/types").TSType;
            tsParseTypeOperator(): import("@babel/types").TSTypeOperator;
            tsCheckTypeAnnotationForReadOnly(node: import("./parser/node.ts").Undone<import("@babel/types").TSTypeOperator>): void;
            tsParseInferType(): import("@babel/types").TSInferType;
            tsParseConstraintForInferType(): import("@babel/types").TSType | undefined;
            tsParseTypeOperatorOrHigher(): import("@babel/types").TSType;
            tsParseUnionOrIntersectionType(kind: "TSUnionType" | "TSIntersectionType", parseConstituentType: () => import("@babel/types").TSType, operator: import("./tokenizer/types.ts").TokenType): import("@babel/types").TSType;
            tsParseIntersectionTypeOrHigher(): import("@babel/types").TSType;
            tsParseUnionTypeOrHigher(): import("@babel/types").TSType;
            tsIsStartOfFunctionType(): boolean;
            tsSkipParameterStart(): boolean;
            tsIsUnambiguouslyStartOfFunctionType(): boolean;
            tsParseTypeOrTypePredicateAnnotation(returnToken: import("./tokenizer/types.ts").TokenType): import("@babel/types").TSTypeAnnotation;
            tsTryParseTypeOrTypePredicateAnnotation(): import("@babel/types").TSTypeAnnotation | undefined;
            tsTryParseTypeAnnotation(): import("@babel/types").TSTypeAnnotation | undefined;
            tsTryParseType(): import("@babel/types").TSType | undefined;
            tsParseTypePredicatePrefix(): import("@babel/types").Identifier | undefined;
            tsParseTypePredicateAsserts(): boolean;
            tsParseTypeAnnotation(eatColon?: boolean, t?: import("./parser/node.ts").Undone<import("@babel/types").TSTypeAnnotation>): import("@babel/types").TSTypeAnnotation;
            tsParseType(): import("@babel/types").TSType;
            isAbstractConstructorSignature(): boolean;
            tsParseNonConditionalType(): import("@babel/types").TSType;
            tsParseTypeAssertion(): import("@babel/types").TSTypeAssertion;
            tsParseHeritageClause(token: "extends"): import("@babel/types").TSInterfaceHeritage[];
            tsParseHeritageClause(token: "implements"): import("@babel/types").TSClassImplements[];
            tsParseInterfaceDeclaration(node: import("./parser/node.ts").Undone<import("@babel/types").TSInterfaceDeclaration>, properties?: {
                declare?: true;
            }): import("@babel/types").TSInterfaceDeclaration | null;
            tsParseTypeAliasDeclaration(node: import("./parser/node.ts").Undone<import("@babel/types").TSTypeAliasDeclaration>): import("@babel/types").TSTypeAliasDeclaration;
            tsInTopLevelContext<T>(cb: () => T): T;
            tsInType<T>(cb: () => T): T;
            tsInDisallowConditionalTypesContext<T>(cb: () => T): T;
            tsInAllowConditionalTypesContext<T>(cb: () => T): T;
            tsEatThenParseType(token: import("./tokenizer/types.ts").TokenType): import("@babel/types").TSType | undefined;
            tsExpectThenParseType(token: import("./tokenizer/types.ts").TokenType): import("@babel/types").TSType;
            tsNextThenParseType(): import("@babel/types").TSType;
            tsParseEnumMember(): import("@babel/types").TSEnumMember;
            tsParseEnumDeclaration(node: import("./parser/node.ts").Undone<import("@babel/types").TSEnumDeclaration>, properties?: {
                const?: true;
                declare?: true;
            }): import("@babel/types").TSEnumDeclaration;
            tsParseEnumBody(): import("@babel/types").TSEnumBody;
            tsParseModuleBlock(isGlobal: boolean): import("@babel/types").TSModuleBlock;
            tsParseNamespaceDeclaration(node: import("./parser/node.ts").Undone<import("@babel/types").TSModuleDeclaration>): import("@babel/types").TSModuleDeclaration;
            tsParseAmbientExternalModuleDeclaration(node: import("./parser/node.ts").Undone<import("@babel/types").TSModuleDeclaration>): import("@babel/types").TSModuleDeclaration;
            tsParseImportEqualsDeclaration(node: import("./parser/node.ts").Undone<import("@babel/types").TSImportEqualsDeclaration>, maybeDefaultIdentifier?: import("@babel/types").Identifier | null): import("@babel/types").TSImportEqualsDeclaration;
            tsIsExternalModuleReference(): boolean;
            tsParseModuleReference(): import("@babel/types").TSExternalModuleReference | import("@babel/types").TSEntityName;
            tsParseExternalModuleReference(): import("@babel/types").TSExternalModuleReference;
            tsLookAhead<T>(f: () => T): T;
            tsTryParseAndCatch<T extends import("./parser/node.ts").Undone<import("./types.ts").Node> | undefined | null>(f: () => T): T | undefined | null;
            tsTryParse<T>(f: () => T | undefined | false): T | undefined;
            tsTryParseDeclare(node: any): import("@babel/types").ClassDeclaration | import("@babel/types").FunctionDeclaration | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").VariableDeclaration | null | undefined;
            tsTryParseExportDeclaration(): import("@babel/types").ClassDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSTypeAliasDeclaration | null | undefined;
            tsParseDeclaration(node: any, type: number, next: boolean, decorators: import("@babel/types").Decorator[] | null): import("@babel/types").ClassDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").TSModuleDeclaration | null | undefined;
            tsCheckLineTerminator(next: boolean): boolean;
            tsTryParseGenericAsyncArrowFunction(startLoc: import("./util/location.ts").Position): import("@babel/types").ArrowFunctionExpression | undefined;
            tsParseTypeArgumentsInExpression(): import("@babel/types").TSTypeParameterInstantiation | undefined;
            tsParseTypeArguments(): import("@babel/types").TSTypeParameterInstantiation;
            tsIsDeclarationStart(): boolean;
            isExportDefaultSpecifier(): boolean;
            parseBindingElement(flags: import("./parser/lval.ts").ParseBindingListFlags, decorators: import("@babel/types").Decorator[]): import("@babel/types").Identifier | import("@babel/types").Pattern | import("@babel/types").TSParameterProperty;
            isSimpleParameter(node: import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty): boolean;
            tsDisallowOptionalPattern(node: import("./parser/node.ts").Undone<import("@babel/types").Function | import("@babel/types").TSDeclareMethod | import("@babel/types").TSDeclareFunction>): void;
            setArrowFunctionParameters(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: import("@babel/types").Expression[], trailingCommaLoc?: import("./util/location.ts").Position | null): void;
            parseFunctionBodyAndFinish<T extends import("@babel/types").Function | import("@babel/types").TSDeclareMethod | import("@babel/types").TSDeclareFunction>(node: import("./parser/node.ts").Undone<T>, type: T["type"], isMethod?: boolean): T;
            registerFunctionStatementId(node: import("./types.ts").NormalFunction): void;
            tsCheckForInvalidTypeCasts(items: (import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression | import("@babel/types").SpreadElement | import("@babel/types").ArgumentPlaceholder | null)[]): void;
            toReferencedList(exprList: (import("@babel/types").Expression | null)[], isInParens?: boolean): (import("@babel/types").Expression | null)[];
            parseArrayLike(close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ArrayExpression;
            parseSubscript(base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, noCalls: boolean | undefined | null, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseNewCallee(node: import("@babel/types").NewExpression): void;
            parseExprOp(left: import("@babel/types").Expression, leftStartLoc: import("./util/location.ts").Position, minPrec: number): import("@babel/types").Expression;
            checkReservedWord(word: string, startLoc: number, checkKeywords: boolean, isBinding: boolean): void;
            checkDuplicateExports(): void;
            isPotentialImportPhase(isExport: boolean): boolean;
            applyImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration>, isExport: boolean, phase: string | null, loc?: number): void;
            parseImport(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").TSImportEqualsDeclaration>): import("./types.ts").AnyImport;
            parseExport(node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, decorators: import("@babel/types").Decorator[] | null): import("./types.ts").AnyExport;
            isAbstractClass(): boolean;
            parseExportDefaultExpression(): import("@babel/types").ExportDefaultDeclaration["declaration"];
            parseVarStatement(node: import("@babel/types").VariableDeclaration, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("@babel/types").VariableDeclaration;
            parseStatementContent(flags: import("./parser/statement.ts").ParseStatementFlag, decorators: import("@babel/types").Decorator[] | null): import("@babel/types").Statement;
            parseAccessModifier(): import("./types.ts").Accessibility | undefined | null;
            tsHasSomeModifiers(member: any, modifiers: readonly ("const" | import("./types.ts").Accessibility | "readonly" | "abstract" | "declare" | "static" | "override" | import("./types.ts").VarianceAnnotations)[]): boolean;
            tsIsStartOfStaticBlocks(): boolean;
            parseClassMember(classBody: import("@babel/types").ClassBody, member: any, state: import("./types.ts").ParseClassMemberState): void;
            parseClassMemberWithIsStatic(classBody: import("@babel/types").ClassBody, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember | import("@babel/types").TSIndexSignature>, state: import("./types.ts").ParseClassMemberState, isStatic: boolean): void;
            parsePostMemberNameModifiers(methodOrProp: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty | import("@babel/types").ClassPrivateProperty>): void;
            shouldParseExportDeclaration(): boolean;
            parseConditional(expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseParenItem<T extends import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").SpreadElement | import("./types.ts").TSTypeCastExpression>(node: T, startLoc: import("./util/location.ts").Position): T | import("./types.ts").TSTypeCastExpression;
            parseExportDeclaration(node: import("@babel/types").ExportNamedDeclaration): import("@babel/types").ExportNamedDeclaration["declaration"] | undefined;
            parseClassId(node: import("./parser/node.ts").Undone<import("@babel/types").Class>, isStatement: boolean, optionalId?: boolean | null, bindingType?: import("./util/scopeflags.ts").BindingFlag): void;
            parseClassPropertyAnnotation(node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty | import("@babel/types").ClassPrivateProperty | import("@babel/types").ClassAccessorProperty>): void;
            parseClassProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty>): import("@babel/types").ClassProperty;
            parseClassPrivateProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateProperty>): import("@babel/types").ClassPrivateProperty;
            parseClassAccessorProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>): import("@babel/types").ClassAccessorProperty;
            pushClassMethod(classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowsDirectSuper: boolean): void;
            pushClassPrivateMethod(classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod>, isGenerator: boolean, isAsync: boolean): void;
            declareClassPrivateMethodInScope(node: import("@babel/types").ClassPrivateMethod | import("@babel/types").TSDeclareMethod, kind: number): void;
            parseClassSuper(node: import("./parser/node.ts").Undone<import("@babel/types").Class>): void;
            parseObjPropValue<T extends import("./types.ts").ObjectMember>(prop: import("./parser/node.ts").Undone<T>, startLoc: import("./util/location.ts").Position | undefined | null, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): T;
            parseFunctionParams(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isConstructor: boolean): void;
            parseVarId(decl: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclarator>, kind: "var" | "let" | "const" | "using" | "await using"): void;
            parseAsyncArrowFromCallExpression(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, call: import("@babel/types").CallExpression): import("@babel/types").ArrowFunctionExpression;
            parseMaybeAssign(refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssign(refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            reportReservedArrowTypeParam(node: import("@babel/types").TSTypeParameterDeclaration): void;
            parseMaybeUnary(refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, sawUnary?: boolean): import("@babel/types").Expression;
            parseArrow(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression> | null | undefined;
            parseFunctionParamType<T extends import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").RestElement>(param: T): T;
            isAssignable(node: import("./types.ts").Node, isBinding?: boolean): boolean;
            toAssignable(node: import("./types.ts").Node, isLHS?: boolean): void;
            toAssignableParenthesizedExpression(node: import("@babel/types").ParenthesizedExpression, isLHS: boolean): void;
            checkToRestConversion(node: import("./types.ts").Node, allowPattern: boolean): void;
            isValidLVal(type: "TSTypeCastExpression" | "TSParameterProperty" | "TSNonNullExpression" | "TSInstantiationExpression" | "TSAsExpression" | "TSSatisfiesExpression" | "TSTypeAssertion", disallowCallExpression: boolean, isUnparenthesizedInAssign: boolean, binding: import("./util/scopeflags.ts").BindingFlag): string | boolean | [string, boolean];
            parseBindingAtom(): import("@babel/types").ArrayPattern | import("@babel/types").Identifier | import("@babel/types").ObjectPattern | import("@babel/types").VoidPattern;
            parseMaybeDecoratorArguments(expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position): import("@babel/types").Expression;
            checkCommaAfterRest(close: typeof import("charcodes")[keyof typeof import("charcodes")]): boolean;
            isClassMethod(): boolean;
            isClassProperty(): boolean;
            parseMaybeDefault<P extends import("@babel/types").Pattern | import("@babel/types").Identifier>(startLoc?: import("./util/location.ts").Position | null, left?: P | null): P | import("@babel/types").AssignmentPattern;
            getTokenFromCode(code: number): void;
            reScan_lt_gt(): void;
            reScan_lt(): number;
            toAssignableListItem(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("./types.ts").TSTypeCastExpression)[], index: number, isLHS: boolean): void;
            typeCastToParameter(node: import("./types.ts").TSTypeCastExpression): import("@babel/types").Expression;
            shouldParseArrow(params: import("./types.ts").Node[]): boolean;
            shouldParseAsyncArrow(): boolean;
            parseParenAndDistinguishExpression(canStartArrow: boolean): import("@babel/types").Expression;
            canHaveLeadingDecorator(): boolean;
            jsxParseOpeningElementAfterName(node: import("@babel/types").JSXOpeningElement): import("@babel/types").JSXOpeningElement;
            getGetterSetterExpectedParamCount(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): number;
            parseCatchClauseParam(): import("@babel/types").ArrayPattern | import("@babel/types").Identifier | import("@babel/types").ObjectPattern;
            tsInAmbientContext<T>(cb: () => T): T;
            parseClass<T extends import("@babel/types").Class>(node: import("./parser/node.ts").Undone<T>, isStatement: boolean, optionalId?: boolean): T;
            tsParseAbstractDeclaration(node: any, decorators: import("@babel/types").Decorator[] | null): import("@babel/types").ClassDeclaration | import("@babel/types").TSInterfaceDeclaration | null;
            parseMethod<T extends import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod | import("@babel/types").ClassPrivateMethod>(node: import("./parser/node.ts").Undone<T>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowDirectSuper: boolean, type: T["type"], inClassScope?: boolean): T;
            tsParseTypeParameterName(): import("@babel/types").Identifier;
            shouldParseAsAmbientContext(): boolean;
            parse(): import("./index.ts").ParseResult<import("@babel/types").File>;
            getExpression(): import("@babel/types").Expression & import("./types.ts").ParserOutput;
            parseExportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportSpecifier>, isString: boolean, isInTypeExport: boolean, isMaybeTypeOnly: boolean): import("@babel/types").ExportSpecifier;
            parseImportSpecifier(specifier: import("./parser/node.ts").Undone<import("@babel/types").ImportSpecifier>, importedIsString: boolean, isInTypeOnlyImport: boolean, isMaybeTypeOnly: boolean, bindingType: import("./util/scopeflags.ts").BindingFlag | undefined): import("@babel/types").ImportSpecifier;
            parseTypeOnlyImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportSpecifier>, isInTypeOnly: boolean): void;
            parseTypeOnlyExportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportSpecifier>, isInTypeOnly: boolean): void;
            fillOptionalPropertiesForTSESLint(node: import("./types.ts").Node): void;
            chStartsBindingIdentifierAndNotRelationalOperator(ch: number, pos: number): boolean;
            nextTokenIsIdentifierAndNotTSRelationalOperatorOnSameLine(): boolean;
            nextTokenIsStringLiteralOnSameLine(): boolean;
            parseTopLevel(this: import("./parser/index.ts").default, file: import("./parser/node.ts").Undone<import("@babel/types").File>, program: import("./parser/node.ts").Undone<import("@babel/types").Program>): import("@babel/types").File;
            parseProgram(this: import("./parser/index.ts").default, program: import("./parser/node.ts").Undone<import("@babel/types").Program>, end: import("./tokenizer/types.ts").TokenType, sourceType: import("@babel/types").Program["sourceType"]): import("@babel/types").Program;
            stmtToDirective(stmt: import("@babel/types").ExpressionStatement): import("@babel/types").Directive;
            parseInterpreterDirective(): import("@babel/types").InterpreterDirective | null;
            isLet(): boolean;
            isUsing(): boolean;
            isForUsing(): boolean;
            nextTokenIsIdentifierOnSameLine(): boolean;
            isAwaitUsing(): boolean;
            chStartsBindingIdentifier(ch: number, pos: number): boolean;
            chStartsBindingPattern(ch: number): ch is 91 | 123;
            hasFollowingBindingAtom(): boolean;
            hasInLineFollowingBindingIdentifierOrBrace(): boolean;
            allowsUsing(): boolean;
            parseModuleItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementListItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementOrSloppyAnnexBFunctionDeclaration(this: import("./parser/index.ts").default, allowLabeledFunction?: boolean): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatement(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementLike(this: import("./parser/index.ts").default, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").Statement | import("@babel/types").Declaration | import("@babel/types").ImportDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration;
            assertModuleNodeAllowed(node: import("./types.ts").Node): void;
            maybeTakeDecorators<T extends import("./parser/node.ts").Undone<import("@babel/types").Class>>(maybeDecorators: import("@babel/types").Decorator[] | null | undefined, classNode: T, exportNode?: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration>): T;
            parseDecorators(this: import("./parser/index.ts").default, allowExport?: boolean): import("@babel/types").Decorator[];
            parseDecorator(this: import("./parser/index.ts").default): import("@babel/types").Decorator;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: true): import("@babel/types").BreakStatement;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: false): import("@babel/types").ContinueStatement;
            verifyBreakContinue(node: import("./parser/node.ts").Undone<import("@babel/types").BreakStatement | import("@babel/types").ContinueStatement>, isBreak: boolean): void;
            parseDebuggerStatement(node: import("./parser/node.ts").Undone<import("@babel/types").DebuggerStatement>): import("@babel/types").DebuggerStatement;
            parseHeaderExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            parseDoWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoWhileStatement>): import("@babel/types").DoWhileStatement;
            parseForStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").For>): import("@babel/types").For;
            parseFunctionStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionDeclaration>, isAsync: boolean, isHangingDeclaration: boolean): import("@babel/types").FunctionDeclaration;
            parseIfStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").IfStatement>): import("@babel/types").IfStatement;
            parseReturnStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ReturnStatement>): import("@babel/types").ReturnStatement;
            parseSwitchStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").SwitchStatement>): import("@babel/types").SwitchStatement;
            parseThrowStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ThrowStatement>): import("@babel/types").ThrowStatement;
            parseTryStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").TryStatement>): import("@babel/types").TryStatement;
            parseWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WhileStatement>): import("@babel/types").WhileStatement;
            parseWithStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WithStatement>): import("@babel/types").WithStatement;
            parseEmptyStatement(node: import("./parser/node.ts").Undone<import("@babel/types").EmptyStatement>): import("@babel/types").EmptyStatement;
            parseLabeledStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").LabeledStatement>, maybeName: string, expr: import("@babel/types").Identifier, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").LabeledStatement;
            parseExpressionStatement(node: import("./parser/node.ts").Undone<import("@babel/types").ExpressionStatement>, expr: import("@babel/types").Expression): import("@babel/types").ExpressionStatement;
            parseBlock(this: import("./parser/index.ts").default, allowDirectives?: boolean, createNewLexicalScope?: boolean, afterBlockParse?: (hasStrictModeDirective: boolean) => void): import("@babel/types").BlockStatement;
            isValidDirective(stmt: import("@babel/types").Statement): stmt is import("@babel/types").ExpressionStatement;
            parseBlockBody(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("./types.ts").BlockStatementLike>, allowDirectives: boolean | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseBlockOrModuleBlockBody(this: import("./parser/index.ts").default, body: import("@babel/types").Statement[], directives: import("@babel/types").Directive[] | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseFor(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForStatement>, init?: import("@babel/types").VariableDeclaration | import("@babel/types").Expression | null): import("@babel/types").ForStatement;
            parseForX(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForXStatement>, init: import("@babel/types").VariableDeclaration | import("@babel/types").AssignmentPattern | import("@babel/types").Identifier | import("@babel/types").MemberExpression, awaitAt?: import("./util/location.ts").Position | null): import("@babel/types").ForXStatement;
            parseVar(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, isFor: boolean, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>;
            parseAsyncFunctionExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionExpression>): import("@babel/types").FunctionExpression;
            parseFunction<T extends import("./types.ts").NormalFunction>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, flags?: import("./parser/statement.ts").ParseFunctionFlag): T;
            parseFunctionId(requireId?: boolean): import("@babel/types").Identifier | undefined | null;
            nameIsConstructor(key: import("@babel/types").Expression | import("@babel/types").PrivateName): boolean;
            isNonstaticConstructor(method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty>): boolean;
            parseClassBody(this: import("./parser/index.ts").default, hadSuperClass: boolean, oldStrict: boolean): import("@babel/types").ClassBody;
            parseClassMemberFromModifier(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): boolean;
            parseClassElementName(this: import("./parser/index.ts").default, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): import("@babel/types").Expression | import("@babel/types").Identifier | import("@babel/types").PrivateName;
            parseClassStaticBlock(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("@babel/types").StaticBlock & {
                decorators?: import("@babel/types").Decorator[];
            }>): void;
            pushClassProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty>): void;
            pushClassPrivateProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateProperty>): void;
            pushClassAccessorProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>, isPrivate: boolean): void;
            parseInitializer(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty | import("@babel/types").ClassPrivateProperty | import("@babel/types").ClassAccessorProperty>): void;
            eatExportStar(_: import("./parser/node.ts").Undone<import("./types.ts").Node>): _ is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>;
            maybeParseExportDefaultSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportNamespaceSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportNamedSpecifiers(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportDeclaration(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>): boolean;
            isAsyncFunction(): boolean;
            parseExportFrom(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>, expect?: boolean): void;
            checkNamedExport(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>, isFrom?: boolean): void;
            checkDeclaration(node: import("@babel/types").Identifier | import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").ObjectProperty): void;
            parseExportSpecifiers(isInTypeExport: boolean): import("@babel/types").ExportSpecifier[];
            parseModuleExportName(): import("@babel/types").StringLiteral | import("@babel/types").Identifier;
            checkImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            parseMaybeImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").TSImportEqualsDeclaration>, isExport: boolean): import("@babel/types").Identifier | null;
            isPrecedingIdImportPhase(phase: string): boolean;
            parseImportSpecifiersAndAfter(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): import("@babel/types").ImportDeclaration;
            parseImportSourceAndAttributes(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("@babel/types").ImportDeclaration;
            parseImportSource(this: import("./parser/index.ts").default): import("@babel/types").StringLiteral;
            parseImportSpecifierLocal<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, specifier: import("./parser/node.ts").Undone<T>, type: T["type"]): void;
            finishImportSpecifier<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(specifier: import("./parser/node.ts").Undone<T>, type: T["type"], bindingType?: import("./util/scopeflags.ts").BindingFlag): T;
            parseImportAttributes(): import("@babel/types").ImportAttribute[];
            maybeParseImportAttributes(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): void;
            maybeParseDefaultImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): boolean;
            maybeParseStarImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): boolean;
            parseNamedImportSpecifiers(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            isThisParam(param: import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty | import("@babel/types").RestElement): boolean;
            checkProto(prop: import("./types.ts").ObjectMember | import("@babel/types").SpreadElement, sawProto: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): boolean;
            shouldExitDescending(expr: import("@babel/types").Expression | import("@babel/types").PrivateName | import("@babel/types").Super | import("@babel/types").Import): expr is import("@babel/types").ArrowFunctionExpression;
            parseExpression(this: import("./parser/index.ts").default, disallowIn?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExpressionBase(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseMaybeAssignDisallowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            setOptionalParametersError(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            parseMaybeConditional(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseMaybeUnaryOrPrivate(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression | import("@babel/types").PrivateName;
            parseExprOps(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExprOpRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseExprOpBaseRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseHackPipeBody(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            checkExponentialAfterUnary(node: import("@babel/types").AwaitExpression | import("./parser/node.ts").Undone<import("@babel/types").UnaryExpression>): void;
            parseUpdate(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").UpdateExpression>, update: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseExprSubscripts(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: false | null): import("@babel/types").Expression;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls: true): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: boolean | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            stopParseSubscript(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseMember(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, computed: boolean, optional: boolean): import("@babel/types").OptionalMemberExpression | import("@babel/types").MemberExpression;
            parseBind(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseCoverCallAndAsyncArrowHead(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, optional: boolean): import("@babel/types").Expression;
            parseTaggedTemplateExpression(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").TaggedTemplateExpression;
            atPossibleAsyncArrow(base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import): boolean;
            finishCallExpression<T extends import("@babel/types").CallExpression | import("@babel/types").OptionalCallExpression>(node: import("./parser/node.ts").Undone<T>, optional: boolean): T;
            parseCallExpressionArguments(this: import("./parser/index.ts").default, allowPlaceholder?: boolean, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): (import("@babel/types").Expression | import("@babel/types").SpreadElement)[];
            parseNoCallExpr(this: import("./parser/index.ts").default, onUnparenthesizedImportExpression: (base: import("@babel/types").ImportExpression) => void): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseExprAtom(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseTopicReferenceThenEqualsSign(topicTokenType: import("./tokenizer/types.ts").TokenType, topicTokenValue: string): import("@babel/types").Expression;
            parseTopicReference(pipeProposal: string): import("@babel/types").Expression;
            finishTopicReference(node: import("./parser/node.ts").Undone<import("@babel/types").TopicReference>, startLoc: import("./util/location.ts").Position, pipeProposal: string, tokenType: import("./tokenizer/types.ts").TokenType): import("@babel/types").TopicReference;
            testTopicReferenceConfiguration(pipeProposal: string, startLoc: import("./util/location.ts").Position, tokenType: import("./tokenizer/types.ts").TokenType): boolean;
            parseAsyncArrowUnaryFunction(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("@babel/types").ArrowFunctionExpression;
            parseDo(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoExpression>, isAsync: boolean): import("@babel/types").DoExpression;
            parseSuper(): import("@babel/types").Super;
            parsePrivateName(): import("@babel/types").PrivateName;
            parseFunctionOrFunctionSent(this: import("./parser/index.ts").default): import("@babel/types").FunctionExpression | import("@babel/types").MetaProperty;
            parseMetaProperty(node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty>, meta: import("@babel/types").Identifier, propertyName: string): import("@babel/types").MetaProperty;
            parseImportMetaPropertyOrPhaseCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty | import("@babel/types").ImportExpression>): import("@babel/types").MetaProperty | import("@babel/types").ImportExpression;
            parseLiteralAtNode<T extends import("./types.ts").Node>(value: any, type: T["type"], node: any): T;
            parseLiteral<T extends import("./types.ts").Node>(value: any, type: T["type"]): T;
            parseStringLiteral(value: any): import("@babel/types").StringLiteral;
            parseNumericLiteral(value: any): import("@babel/types").NumericLiteral;
            parseBigIntLiteral(value: any): import("@babel/types").BigIntLiteral;
            parseRegExpLiteral(value: {
                value: any;
                pattern: string;
                flags: import("@babel/types").RegExpLiteral["flags"];
            }): import("@babel/types").RegExpLiteral;
            parseBooleanLiteral(value: boolean): import("@babel/types").BooleanLiteral;
            parseNullLiteral(): import("@babel/types").NullLiteral;
            wrapParenthesis(startLoc: import("./util/location.ts").Position, expression: import("@babel/types").Expression): import("@babel/types").Expression;
            parseNewOrNewTarget(this: import("./parser/index.ts").default): import("@babel/types").NewExpression | import("@babel/types").MetaProperty;
            parseNew(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").NewExpression>): import("@babel/types").NewExpression;
            parseTemplateElement(isTagged: boolean): import("@babel/types").TemplateElement;
            parseTemplate(this: import("./parser/index.ts").default, isTagged: boolean): import("@babel/types").TemplateLiteral;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: true, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectPattern;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectExpression;
            addTrailingCommaExtraToNode(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): void;
            maybeAsyncOrAccessorProp(prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty | import("@babel/types").ObjectMethod>): prop is typeof prop & {
                key: import("@babel/types").Identifier;
            };
            parsePropertyDefinition(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("./types.ts").ObjectMember | import("@babel/types").SpreadElement;
            getObjectOrClassMethodParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): (import("@babel/types").TSParameterProperty | import("@babel/types").FunctionParameter)[] | import("@babel/types").FunctionParameter[];
            checkGetterSetterParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): void;
            parseObjectMethod(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod>, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean): import("@babel/types").ObjectMethod | undefined | null;
            parseObjectProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>, startLoc: import("./util/location.ts").Position | undefined | null, isPattern: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectProperty | undefined | null;
            finishObjectProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>): import("@babel/types").ObjectProperty;
            parsePropertyName(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember> | import("@babel/types").TSPropertySignature | import("@babel/types").TSMethodSignature, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): void;
            initFunction(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isAsync: boolean): void;
            parseArrowExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | null | undefined, isAsync: boolean, trailingCommaLoc?: import("./util/location.ts").Position | null): import("@babel/types").ArrowFunctionExpression;
            parseFunctionBody(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Function>, allowExpression?: boolean | null, isMethod?: boolean): void;
            isSimpleParamList(params: readonly (import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty)[]): boolean;
            checkParams(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, allowDuplicates: boolean, isArrowFunction?: boolean | null, strictModeChanged?: boolean): void;
            parseExprList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null): (import("@babel/types").Expression | null)[];
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression | null;
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression;
            parseIdentifier(liberal?: boolean): import("@babel/types").Identifier;
            createIdentifier(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string): import("@babel/types").Identifier;
            createIdentifierAt(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string, endLoc: import("./util/location.ts").Position): import("@babel/types").Identifier;
            parseIdentifierName(liberal?: boolean): string;
            recordAwaitIfAllowed(): boolean;
            parseAwait(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position, soloAwait?: boolean): import("@babel/types").AwaitExpression;
            isAmbiguousPrefixOrIdentifier(): boolean;
            parseYield(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position): import("@babel/types").YieldExpression;
            parseImportCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportExpression>): import("@babel/types").ImportExpression;
            withTopicBindingContext<T>(callback: () => T): T;
            allowInAnd<T>(callback: () => T): T;
            disallowInAnd<T>(callback: () => T): T;
            registerTopicReference(): void;
            topicReferenceIsAllowedInCurrentContext(): boolean;
            topicReferenceWasUsedInCurrentContext(): boolean;
            parseFSharpPipelineBody(this: import("./parser/index.ts").default, prec: number): import("@babel/types").Expression;
            parseModuleExpression(this: import("./parser/index.ts").default): import("@babel/types").ModuleExpression;
            parseVoidPattern(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").VoidPattern;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parsePropertyNamePrefixOperator(prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember>): void;
            toAssignableObjectExpressionProp(prop: import("./types.ts").Node, isLast: boolean, isLHS: boolean): void;
            toAssignableList(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[], trailingCommaLoc: import("./util/location.ts").Position | undefined | null, isLHS: boolean): void;
            parseSpread(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").SpreadElement;
            parseRestBinding(this: import("./parser/index.ts").default): import("@babel/types").RestElement;
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.ALLOW_EMPTY): (import("@babel/types").Pattern | import("@babel/types").RestElement | null)[];
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.IS_FUNCTION_PARAMS): (import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").TSParameterProperty)[];
            parseBindingRestProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").RestElement>): import("@babel/types").RestElement;
            parseBindingProperty(this: import("./parser/index.ts").default): import("./types.ts").AssignmentProperty | import("@babel/types").RestElement;
            isOptionalMemberExpression(expression: import("./types.ts").Node): boolean;
            checkLVal(expression: import("@babel/types").Expression | import("./types.ts").ObjectMember | import("@babel/types").RestElement | import("@babel/types").Pattern | import("@babel/types").TSParameterProperty | import("./types.ts").TSTypeCastExpression, ancestor: import("./parse-error.ts").LValAncestor, binding?: import("./util/scopeflags.ts").BindingFlag, checkClashes?: Set<string> | false, strictModeChanged?: boolean, hasParenthesizedAncestor?: boolean, disallowCallExpression?: boolean): void;
            checkIdentifier(at: import("@babel/types").Identifier, bindingType: import("./util/scopeflags.ts").BindingFlag, strictModeChanged?: boolean): void;
            declareNameFromIdentifier(identifier: import("@babel/types").Identifier, binding: import("./util/scopeflags.ts").BindingFlag): void;
            createPosition(loc: import("./util/location.ts").Position): import("./util/location.ts").Position;
            startNode<T extends import("./types.ts").Node = never>(): import("./parser/node.ts").Undone<T>;
            startNodeAt<T extends import("./types.ts").Node = never>(loc: import("./util/location.ts").Position): import("./parser/node.ts").Undone<T>;
            startNodeAtNode<T extends import("./types.ts").Node = never>(type: import("./parser/node.ts").Undone<import("./types.ts").Node>): import("./parser/node.ts").Undone<T>;
            finishNode<T extends import("./types.ts").Node>(node: import("./parser/node.ts").Undone<T>, type: T["type"]): T;
            finishNodeAt<T extends import("./types.ts").Node>(node: Omit<T, "type">, type: T["type"], endLoc: import("./util/location.ts").Position): T;
            finishNodeAtNode<T extends import("./types.ts").Node>(node: Omit<T, "type">, type: T["type"], endNode: import("./types.ts").Node): T;
            resetStartLocation(node: import("./types.ts").BaseNode, startLoc: import("./util/location.ts").Position): void;
            resetEndLocation(node: import("./types.ts").BaseNode, endLoc?: import("./util/location.ts").Position): void;
            resetStartLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            resetEndLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            castNodeTo<T extends import("./types.ts").Node["type"]>(node: import("./types.ts").Node, type: T): Extract<import("@babel/types").AnyTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ArgumentPlaceholder, {
                type: T;
            }> | Extract<import("@babel/types").ArrayExpression, {
                type: T;
            }> | Extract<import("@babel/types").ArrayPattern, {
                type: T;
            }> | Extract<import("@babel/types").ArrayTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ArrowFunctionExpression, {
                type: T;
            }> | Extract<import("@babel/types").AssignmentExpression, {
                type: T;
            }> | Extract<import("@babel/types").AssignmentPattern, {
                type: T;
            }> | Extract<import("@babel/types").AwaitExpression, {
                type: T;
            }> | Extract<import("@babel/types").BigIntLiteral, {
                type: T;
            }> | Extract<import("@babel/types").BigIntLiteralTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").BinaryExpressionIn, {
                type: T;
            }> | Extract<import("@babel/types").BinaryExpressionNotIn, {
                type: T;
            }> | Extract<import("@babel/types").BindExpression, {
                type: T;
            }> | Extract<import("@babel/types").BlockStatement, {
                type: T;
            }> | Extract<import("@babel/types").BooleanLiteral, {
                type: T;
            }> | Extract<import("@babel/types").BooleanLiteralTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").BooleanTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").BreakStatement, {
                type: T;
            }> | Extract<import("@babel/types").CallExpression, {
                type: T;
            }> | Extract<import("@babel/types").CatchClause, {
                type: T;
            }> | Extract<import("@babel/types").ClassAccessorPropertyComputed, {
                type: T;
            }> | Extract<import("@babel/types").ClassAccessorPropertyNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ClassBody, {
                type: T;
            }> | Extract<import("@babel/types").ClassDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").ClassExpression, {
                type: T;
            }> | Extract<import("@babel/types").ClassImplements, {
                type: T;
            }> | Extract<import("@babel/types").ClassMethodComputed, {
                type: T;
            }> | Extract<import("@babel/types").ClassMethodNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ClassPrivateMethod, {
                type: T;
            }> | Extract<import("@babel/types").ClassPrivateProperty, {
                type: T;
            }> | Extract<import("@babel/types").ClassPropertyComputed, {
                type: T;
            }> | Extract<import("@babel/types").ClassPropertyNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ConditionalExpression, {
                type: T;
            }> | Extract<import("@babel/types").ContinueStatement, {
                type: T;
            }> | Extract<import("@babel/types").DebuggerStatement, {
                type: T;
            }> | Extract<import("@babel/types").DeclareClass, {
                type: T;
            }> | Extract<import("@babel/types").DeclareExportAllDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").DeclareExportDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").DeclareFunction, {
                type: T;
            }> | Extract<import("@babel/types").DeclareInterface, {
                type: T;
            }> | Extract<import("@babel/types").DeclareModule, {
                type: T;
            }> | Extract<import("@babel/types").DeclareModuleExports, {
                type: T;
            }> | Extract<import("@babel/types").DeclareOpaqueType, {
                type: T;
            }> | Extract<import("@babel/types").DeclareTypeAlias, {
                type: T;
            }> | Extract<import("@babel/types").DeclareVariable, {
                type: T;
            }> | Extract<import("@babel/types").DeclaredPredicate, {
                type: T;
            }> | Extract<import("@babel/types").Decorator, {
                type: T;
            }> | Extract<import("@babel/types").Directive, {
                type: T;
            }> | Extract<import("@babel/types").DirectiveLiteral, {
                type: T;
            }> | Extract<import("@babel/types").DoExpression, {
                type: T;
            }> | Extract<import("@babel/types").DoWhileStatement, {
                type: T;
            }> | Extract<import("@babel/types").EmptyStatement, {
                type: T;
            }> | Extract<import("@babel/types").EmptyTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").EnumBooleanBody, {
                type: T;
            }> | Extract<import("@babel/types").EnumBooleanMember, {
                type: T;
            }> | Extract<import("@babel/types").EnumDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").EnumDefaultedMember, {
                type: T;
            }> | Extract<import("@babel/types").EnumNumberBody, {
                type: T;
            }> | Extract<import("@babel/types").EnumNumberMember, {
                type: T;
            }> | Extract<import("@babel/types").EnumStringBody, {
                type: T;
            }> | Extract<import("@babel/types").EnumStringMember, {
                type: T;
            }> | Extract<import("@babel/types").EnumSymbolBody, {
                type: T;
            }> | Extract<import("@babel/types").ExistsTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ExportAllDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").ExportDefaultDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").ExportDefaultSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").ExportNamedDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").ExportNamespaceSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").ExportSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").ExpressionStatement, {
                type: T;
            }> | Extract<import("@babel/types").File, {
                type: T;
            }> | Extract<import("@babel/types").ForInStatement, {
                type: T;
            }> | Extract<import("@babel/types").ForOfStatement, {
                type: T;
            }> | Extract<import("@babel/types").ForStatement, {
                type: T;
            }> | Extract<import("@babel/types").FunctionDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").FunctionExpression, {
                type: T;
            }> | Extract<import("@babel/types").FunctionTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").FunctionTypeParam, {
                type: T;
            }> | Extract<import("@babel/types").GenericTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").Identifier, {
                type: T;
            }> | Extract<import("@babel/types").IfStatement, {
                type: T;
            }> | Extract<import("@babel/types").Import, {
                type: T;
            }> | Extract<import("@babel/types").ImportAttribute, {
                type: T;
            }> | Extract<import("@babel/types").ImportDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").ImportDefaultSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").ImportExpression, {
                type: T;
            }> | Extract<import("@babel/types").ImportNamespaceSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").ImportSpecifier, {
                type: T;
            }> | Extract<import("@babel/types").IndexedAccessType, {
                type: T;
            }> | Extract<import("@babel/types").InferredPredicate, {
                type: T;
            }> | Extract<import("@babel/types").InterfaceDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").InterfaceExtends, {
                type: T;
            }> | Extract<import("@babel/types").InterfaceTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").InterpreterDirective, {
                type: T;
            }> | Extract<import("@babel/types").IntersectionTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").JSXAttribute, {
                type: T;
            }> | Extract<import("@babel/types").JSXClosingElement, {
                type: T;
            }> | Extract<import("@babel/types").JSXClosingFragment, {
                type: T;
            }> | Extract<import("@babel/types").JSXElement, {
                type: T;
            }> | Extract<import("@babel/types").JSXEmptyExpression, {
                type: T;
            }> | Extract<import("@babel/types").JSXExpressionContainer, {
                type: T;
            }> | Extract<import("@babel/types").JSXFragment, {
                type: T;
            }> | Extract<import("@babel/types").JSXIdentifier, {
                type: T;
            }> | Extract<import("@babel/types").JSXMemberExpression, {
                type: T;
            }> | Extract<import("@babel/types").JSXNamespacedName, {
                type: T;
            }> | Extract<import("@babel/types").JSXOpeningElement, {
                type: T;
            }> | Extract<import("@babel/types").JSXOpeningFragment, {
                type: T;
            }> | Extract<import("@babel/types").JSXSpreadAttribute, {
                type: T;
            }> | Extract<import("@babel/types").JSXSpreadChild, {
                type: T;
            }> | Extract<import("@babel/types").JSXText, {
                type: T;
            }> | Extract<import("@babel/types").LabeledStatement, {
                type: T;
            }> | Extract<import("@babel/types").LogicalExpression, {
                type: T;
            }> | Extract<import("@babel/types").MemberExpressionComputed, {
                type: T;
            }> | Extract<import("@babel/types").MemberExpressionNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").MetaProperty, {
                type: T;
            }> | Extract<import("@babel/types").MixedTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ModuleExpression, {
                type: T;
            }> | Extract<import("@babel/types").NewExpression, {
                type: T;
            }> | Extract<import("@babel/types").NullLiteral, {
                type: T;
            }> | Extract<import("@babel/types").NullLiteralTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").NullableTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").NumberLiteral, {
                type: T;
            }> | Extract<import("@babel/types").NumberLiteralTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").NumberTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").NumericLiteral, {
                type: T;
            }> | Extract<import("@babel/types").ObjectExpression, {
                type: T;
            }> | Extract<import("@babel/types").ObjectMethodComputed, {
                type: T;
            }> | Extract<import("@babel/types").ObjectMethodNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ObjectPattern, {
                type: T;
            }> | Extract<import("@babel/types").ObjectPropertyComputed, {
                type: T;
            }> | Extract<import("@babel/types").ObjectPropertyNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeCallProperty, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeIndexer, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeInternalSlot, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeProperty, {
                type: T;
            }> | Extract<import("@babel/types").ObjectTypeSpreadProperty, {
                type: T;
            }> | Extract<import("@babel/types").OpaqueType, {
                type: T;
            }> | Extract<import("@babel/types").OptionalCallExpression, {
                type: T;
            }> | Extract<import("@babel/types").OptionalIndexedAccessType, {
                type: T;
            }> | Extract<import("@babel/types").OptionalMemberExpressionComputed, {
                type: T;
            }> | Extract<import("@babel/types").OptionalMemberExpressionNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").ParenthesizedExpression, {
                type: T;
            }> | Extract<import("@babel/types").Placeholder, {
                type: T;
            }> | Extract<import("@babel/types").PrivateName, {
                type: T;
            }> | Extract<import("@babel/types").Program, {
                type: T;
            }> | Extract<import("@babel/types").QualifiedTypeIdentifier, {
                type: T;
            }> | Extract<import("@babel/types").RegExpLiteral, {
                type: T;
            }> | Extract<import("@babel/types").RegexLiteral, {
                type: T;
            }> | Extract<import("@babel/types").RestElement, {
                type: T;
            }> | Extract<import("@babel/types").RestProperty, {
                type: T;
            }> | Extract<import("@babel/types").ReturnStatement, {
                type: T;
            }> | Extract<import("@babel/types").SequenceExpression, {
                type: T;
            }> | Extract<import("@babel/types").SpreadElement, {
                type: T;
            }> | Extract<import("@babel/types").SpreadProperty, {
                type: T;
            }> | Extract<import("@babel/types").StaticBlock, {
                type: T;
            }> | Extract<import("@babel/types").StringLiteral, {
                type: T;
            }> | Extract<import("@babel/types").StringLiteralTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").StringTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").Super, {
                type: T;
            }> | Extract<import("@babel/types").SwitchCase, {
                type: T;
            }> | Extract<import("@babel/types").SwitchStatement, {
                type: T;
            }> | Extract<import("@babel/types").SymbolTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").TSAnyKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSArrayType, {
                type: T;
            }> | Extract<import("@babel/types").TSAsExpression, {
                type: T;
            }> | Extract<import("@babel/types").TSBigIntKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSBooleanKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSCallSignatureDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSClassImplements, {
                type: T;
            }> | Extract<import("@babel/types").TSConditionalType, {
                type: T;
            }> | Extract<import("@babel/types").TSConstructSignatureDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSConstructorType, {
                type: T;
            }> | Extract<import("@babel/types").TSDeclareFunction, {
                type: T;
            }> | Extract<import("@babel/types").TSDeclareMethodComputed, {
                type: T;
            }> | Extract<import("@babel/types").TSDeclareMethodNonComputed, {
                type: T;
            }> | Extract<import("@babel/types").TSEnumBody, {
                type: T;
            }> | Extract<import("@babel/types").TSEnumDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSEnumMember, {
                type: T;
            }> | Extract<import("@babel/types").TSExportAssignment, {
                type: T;
            }> | Extract<import("@babel/types").TSExternalModuleReference, {
                type: T;
            }> | Extract<import("@babel/types").TSFunctionType, {
                type: T;
            }> | Extract<import("@babel/types").TSImportEqualsDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSImportType, {
                type: T;
            }> | Extract<import("@babel/types").TSIndexSignature, {
                type: T;
            }> | Extract<import("@babel/types").TSIndexedAccessType, {
                type: T;
            }> | Extract<import("@babel/types").TSInferType, {
                type: T;
            }> | Extract<import("@babel/types").TSInstantiationExpression, {
                type: T;
            }> | Extract<import("@babel/types").TSInterfaceBody, {
                type: T;
            }> | Extract<import("@babel/types").TSInterfaceDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSInterfaceHeritage, {
                type: T;
            }> | Extract<import("@babel/types").TSIntersectionType, {
                type: T;
            }> | Extract<import("@babel/types").TSIntrinsicKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSLiteralType, {
                type: T;
            }> | Extract<import("@babel/types").TSMappedType, {
                type: T;
            }> | Extract<import("@babel/types").TSMethodSignature, {
                type: T;
            }> | Extract<import("@babel/types").TSModuleBlock, {
                type: T;
            }> | Extract<import("@babel/types").TSModuleDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSNamedTupleMember, {
                type: T;
            }> | Extract<import("@babel/types").TSNamespaceExportDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSNeverKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSNonNullExpression, {
                type: T;
            }> | Extract<import("@babel/types").TSNullKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSNumberKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSObjectKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSOptionalType, {
                type: T;
            }> | Extract<import("@babel/types").TSParameterProperty, {
                type: T;
            }> | Extract<import("@babel/types").TSParenthesizedType, {
                type: T;
            }> | Extract<import("@babel/types").TSPropertySignature, {
                type: T;
            }> | Extract<import("@babel/types").TSQualifiedName, {
                type: T;
            }> | Extract<import("@babel/types").TSRestType, {
                type: T;
            }> | Extract<import("@babel/types").TSSatisfiesExpression, {
                type: T;
            }> | Extract<import("@babel/types").TSStringKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSSymbolKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSTemplateLiteralType, {
                type: T;
            }> | Extract<import("@babel/types").TSThisType, {
                type: T;
            }> | Extract<import("@babel/types").TSTupleType, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeAliasDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeAssertion, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeLiteral, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeOperator, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeParameter, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeParameterDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeParameterInstantiation, {
                type: T;
            }> | Extract<import("@babel/types").TSTypePredicate, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeQuery, {
                type: T;
            }> | Extract<import("@babel/types").TSTypeReference, {
                type: T;
            }> | Extract<import("@babel/types").TSUndefinedKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSUnionType, {
                type: T;
            }> | Extract<import("@babel/types").TSUnknownKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TSVoidKeyword, {
                type: T;
            }> | Extract<import("@babel/types").TaggedTemplateExpression, {
                type: T;
            }> | Extract<import("@babel/types").TemplateElement, {
                type: T;
            }> | Extract<import("@babel/types").TemplateLiteral, {
                type: T;
            }> | Extract<import("@babel/types").ThisExpression, {
                type: T;
            }> | Extract<import("@babel/types").ThisTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").ThrowStatement, {
                type: T;
            }> | Extract<import("@babel/types").TopicReference, {
                type: T;
            }> | Extract<import("@babel/types").TryStatement, {
                type: T;
            }> | Extract<import("@babel/types").TupleTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").TypeAlias, {
                type: T;
            }> | Extract<import("@babel/types").TypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").TypeCastExpression, {
                type: T;
            }> | Extract<import("@babel/types").TypeParameter, {
                type: T;
            }> | Extract<import("@babel/types").TypeParameterDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").TypeParameterInstantiation, {
                type: T;
            }> | Extract<import("@babel/types").TypeofTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").UnaryExpression, {
                type: T;
            }> | Extract<import("@babel/types").UnionTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").UpdateExpression, {
                type: T;
            }> | Extract<import("@babel/types").V8IntrinsicIdentifier, {
                type: T;
            }> | Extract<import("@babel/types").VariableDeclaration, {
                type: T;
            }> | Extract<import("@babel/types").VariableDeclarator, {
                type: T;
            }> | Extract<import("@babel/types").Variance, {
                type: T;
            }> | Extract<import("@babel/types").VoidPattern, {
                type: T;
            }> | Extract<import("@babel/types").VoidTypeAnnotation, {
                type: T;
            }> | Extract<import("@babel/types").WhileStatement, {
                type: T;
            }> | Extract<import("@babel/types").WithStatement, {
                type: T;
            }> | Extract<import("@babel/types").YieldExpression, {
                type: T;
            }> | Extract<import("./types.ts").EstreeAccessorProperty, {
                type: T;
            }> | Extract<import("./types.ts").EstreeMethodDefinition, {
                type: T;
            }> | Extract<import("./types.ts").EstreePropertyDefinition, {
                type: T;
            }> | Extract<import("./types.ts").EstreeTSAbstractMethodDefinition, {
                type: T;
            }> | Extract<import("./types.ts").EstreeTSAbstractPropertyDefinition, {
                type: T;
            }> | Extract<import("./types.ts").EstreeTSAbstractAccessorProperty, {
                type: T;
            }> | Extract<import("./types.ts").EstreeChainExpression, {
                type: T;
            }> | Extract<import("./types.ts").EstreeLiteral, {
                type: T;
            }> | Extract<import("./types.ts").EstreeBigIntLiteral, {
                type: T;
            }> | Extract<import("./types.ts").EstreeTSEmptyBodyFunctionExpression, {
                type: T;
            }> | Extract<import("./types.ts").EstreePrivateIdentifier, {
                type: T;
            }> | Extract<import("./types.ts").EstreeProperty, {
                type: T;
            }> | Extract<import("./types.ts").EstreeRegExpLiteral, {
                type: T;
            }> | Extract<import("./types.ts").TSTypeCastExpression, {
                type: T;
            }>;
            cloneIdentifier<T extends import("@babel/types").Identifier | import("./types.ts").Placeholder>(node: T): T;
            cloneStringLiteral<T extends import("@babel/types").StringLiteral | import("./types.ts").EstreeLiteral | import("./types.ts").Placeholder>(node: T): T;
            addExtra(node: Partial<import("./types.ts").Node>, key: string, value: any, enumerable?: boolean): void;
            isContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            isUnparsedContextual(nameStart: number, name: string): boolean;
            isLookaheadContextual(name: string): boolean;
            eatContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            expectContextual(token: import("./tokenizer/types.ts").TokenType, toParseError?: import("./parse-error.ts").ParseErrorConstructor<any>): void;
            canInsertSemicolon(): boolean;
            hasPrecedingLineBreak(): boolean;
            hasFollowingLineBreak(): boolean;
            isLineTerminator(): boolean;
            semicolon(allowAsi?: boolean): void;
            expect(type: import("./tokenizer/types.ts").TokenType, loc?: import("./util/location.ts").Position | null): void;
            tryParse<T extends import("./types.ts").Node | readonly import("./types.ts").Node[] | null>(fn: (abort: (node?: T) => never) => T, oldState?: import("./tokenizer/state.ts").default): {
                node: T;
                error: null;
                thrown: false;
                aborted: false;
                failState: null;
            } | {
                node: T | null;
                error: import("./parse-error.ts").ParseError;
                thrown: boolean;
                aborted: false;
                failState: import("./tokenizer/state.ts").default;
            } | {
                node: T | null;
                error: null;
                thrown: false;
                aborted: true;
                failState: import("./tokenizer/state.ts").default;
            };
            checkExpressionErrors(refExpressionErrors: import("./parser/util.ts").ExpressionErrors | undefined | null, andThrow: boolean): boolean | undefined;
            isLiteralPropertyName(): boolean;
            isPrivateName(node: import("./types.ts").Node): node is import("@babel/types").PrivateName;
            getPrivateNameSV(node: import("@babel/types").PrivateName): string;
            hasPropertyAsPrivateName(node: import("./types.ts").Node): boolean;
            isObjectProperty(node: import("./types.ts").Node): node is import("@babel/types").ObjectProperty | import("./types.ts").EstreePropertyDefinition;
            isObjectMethod(node: import("./types.ts").Node): node is import("@babel/types").ObjectMethod;
            initializeScopes(this: import("./parser/index.ts").default, inModule?: boolean): () => void;
            enterInitialScopes(): void;
            checkDestructuringPrivate(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            isLookahead: boolean;
            tokens: (import("./index.ts").Token | import("./types.ts").Comment)[];
            setLoc(loc: import("./util/location.ts").Position): void;
            getLoc(locIndex: number): import("./util/location.ts").Position;
            pushToken(token: import("./index.ts").Token | import("./types.ts").Comment): void;
            next(): void;
            eat(type: import("./tokenizer/types.ts").TokenType): boolean;
            match(type: import("./tokenizer/types.ts").TokenType): boolean;
            createLookaheadState(state: import("./tokenizer/state.ts").default): import("./tokenizer/state.ts").LookaheadState;
            lookahead(): import("./tokenizer/state.ts").LookaheadState;
            nextTokenStart(): number;
            nextTokenStartSince(pos: number): number;
            lookaheadCharCode(): number;
            lookaheadCharCodeSince(pos: number): number;
            nextTokenInLineStart(): number;
            nextTokenInLineStartSince(pos: number): number;
            lookaheadInLineCharCode(): number;
            codePointAtPos(pos: number): number;
            setStrict(strict: boolean): void;
            curContext(): import("./tokenizer/context.ts").TokContext;
            nextToken(): void;
            skipBlockComment(commentEnd: "*/" | "*-/"): import("./types.ts").CommentBlock | undefined;
            skipLineComment(startSkip: number): import("./types.ts").CommentLine | undefined;
            skipSpace(): void;
            finishToken(type: import("./tokenizer/types.ts").TokenType, val?: any): void;
            replaceToken(type: import("./tokenizer/types.ts").TokenType): void;
            readToken_numberSign(): void;
            readToken_dot(): void;
            readToken_slash(): void;
            readToken_interpreter(): boolean;
            readToken_mult_modulo(code: number): void;
            readToken_pipe_amp(code: number): void;
            readToken_caret(): void;
            readToken_atSign(): void;
            readToken_plus_min(code: number): void;
            readToken_lt(): void;
            readToken_gt(): void;
            readToken_eq_excl(code: number): void;
            readToken_question(): void;
            finishOp(type: import("./tokenizer/types.ts").TokenType, size: number): void;
            readRegexp(): void;
            readInt(radix: number, len?: number, forceLen?: boolean, allowNumSeparator?: boolean | "bail"): number | null;
            readRadixNumber(radix: number): void;
            readNumber(startsWithDot: boolean): void;
            readCodePoint(throwOnInvalid: boolean): number | null;
            readString(quote: number): void;
            readTemplateContinuation(): void;
            readTemplateToken(): void;
            recordStrictModeErrors(toParseError: import("./tokenizer/state.ts").DeferredStrictError, at: import("./util/location.ts").Position): void;
            readWord1(firstCode?: number): string;
            readWord(firstCode?: number): void;
            checkKeywordEscapes(): void;
            raise<ErrorDetails = object>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node> | number, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            raiseOverwrite<ErrorDetails>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node>, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            updateContext(prevType?: import("./tokenizer/types.ts").TokenType): void;
            unexpected(loc?: import("./util/location.ts").Position | number | null, type?: import("./tokenizer/types.ts").TokenType): any;
            expectPlugin(pluginName: import("./typings.d.ts").Plugin, loc?: import("./util/location.ts").Position | number | null): true;
            expectOnePlugin(pluginNames: import("./typings.d.ts").Plugin[]): any;
            errorBuilder(error: import("./parse-error.ts").ParseErrorConstructor<object>): (pos: number, lineStart: number, curLine: number) => void;
            errorHandlers_readInt: import("@babel/helper-string-parser").IntErrorHandlers;
            errorHandlers_readCodePoint: import("@babel/helper-string-parser").CodePointErrorHandlers;
            errorHandlers_readStringContents_string: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            errorHandlers_readStringContents_template: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            addComment(comment: import("./types.ts").Comment): void;
            processComment(node: import("./types.ts").Node): void;
            finalizeComment(commentWS: import("./parser/comments.ts").CommentWhitespace): void;
            finalizeRemainingComments(): void;
            resetPreviousNodeTrailingComments(node: import("./types.ts").Node): void;
            takeSurroundingComments(node: import("./types.ts").Node, start: number, end: number): void;
            options: import("./options.ts").Options;
            optionFlags: import("./options.ts").OptionFlags;
            inModule: boolean;
            classScope: import("./util/class-scope.ts").default;
            prodParam: import("./util/production-parameter.ts").default;
            expressionScope: import("./util/expression-scope.ts").default;
            plugins: import("./parser/index.ts").PluginsMap;
            filename: string | undefined | null;
            startIndex: number;
            exportedIdentifiers: Set<string>;
            sawUnambiguousESM: boolean;
            ambiguousScriptDifferentAst: boolean;
            state: import("./tokenizer/state.ts").default;
            input: string;
            length: number;
            comments: import("./types.ts").Comment[];
            locData: Uint32Array;
            sourceToOffsetPos(sourcePos: number): number;
            offsetToSourcePos(offsetPos: number): number;
            hasPlugin(pluginConfig: PluginConfig): boolean;
            getPluginOption<PluginName extends import("./typings.d.ts").ParserPluginWithOptions[0], OptionName extends keyof import("./typings.d.ts").PluginOptions<PluginName>>(plugin: PluginName, name: OptionName): NonNullable<import("./typings.d.ts").PluginOptions<PluginName>>[OptionName] | undefined;
        };
    };
    v8intrinsic: (superClass: typeof import("./parser/index.ts").default) => {
        new (options: import("./index.ts").ParserOptions | undefined | null, input: string, pluginsMap: import("./parser/index.ts").PluginsMap): {
            parseV8Intrinsic(): import("@babel/types").Expression | undefined;
            parseExprAtom(refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            getScopeHandler(): new (...args: any) => import("./util/scope.ts").default;
            parse(): import("./index.ts").ParseResult<import("@babel/types").File>;
            parseTopLevel(this: import("./parser/index.ts").default, file: import("./parser/node.ts").Undone<import("@babel/types").File>, program: import("./parser/node.ts").Undone<import("@babel/types").Program>): import("@babel/types").File;
            parseProgram(this: import("./parser/index.ts").default, program: import("./parser/node.ts").Undone<import("@babel/types").Program>, end: import("./tokenizer/types.ts").TokenType, sourceType: import("@babel/types").Program["sourceType"]): import("@babel/types").Program;
            stmtToDirective(stmt: import("@babel/types").ExpressionStatement): import("@babel/types").Directive;
            parseInterpreterDirective(): import("@babel/types").InterpreterDirective | null;
            isLet(): boolean;
            isUsing(): boolean;
            isForUsing(): boolean;
            nextTokenIsIdentifierOnSameLine(): boolean;
            isAwaitUsing(): boolean;
            chStartsBindingIdentifier(ch: number, pos: number): boolean;
            chStartsBindingPattern(ch: number): ch is 91 | 123;
            hasFollowingBindingAtom(): boolean;
            hasInLineFollowingBindingIdentifierOrBrace(): boolean;
            allowsUsing(): boolean;
            parseModuleItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementListItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementOrSloppyAnnexBFunctionDeclaration(this: import("./parser/index.ts").default, allowLabeledFunction?: boolean): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatement(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementLike(this: import("./parser/index.ts").default, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").Statement | import("@babel/types").Declaration | import("@babel/types").ImportDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration;
            parseStatementContent(this: import("./parser/index.ts").default, flags: import("./parser/statement.ts").ParseStatementFlag, decorators?: import("@babel/types").Decorator[] | null): import("@babel/types").Statement;
            assertModuleNodeAllowed(node: import("./types.ts").Node): void;
            maybeTakeDecorators<T extends import("./parser/node.ts").Undone<import("@babel/types").Class>>(maybeDecorators: import("@babel/types").Decorator[] | null | undefined, classNode: T, exportNode?: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration>): T;
            canHaveLeadingDecorator(): boolean;
            parseDecorators(this: import("./parser/index.ts").default, allowExport?: boolean): import("@babel/types").Decorator[];
            parseDecorator(this: import("./parser/index.ts").default): import("@babel/types").Decorator;
            parseMaybeDecoratorArguments(this: import("./parser/index.ts").default, expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position): import("@babel/types").Expression;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: true): import("@babel/types").BreakStatement;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: false): import("@babel/types").ContinueStatement;
            verifyBreakContinue(node: import("./parser/node.ts").Undone<import("@babel/types").BreakStatement | import("@babel/types").ContinueStatement>, isBreak: boolean): void;
            parseDebuggerStatement(node: import("./parser/node.ts").Undone<import("@babel/types").DebuggerStatement>): import("@babel/types").DebuggerStatement;
            parseHeaderExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            parseDoWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoWhileStatement>): import("@babel/types").DoWhileStatement;
            parseForStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").For>): import("@babel/types").For;
            parseFunctionStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionDeclaration>, isAsync: boolean, isHangingDeclaration: boolean): import("@babel/types").FunctionDeclaration;
            parseIfStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").IfStatement>): import("@babel/types").IfStatement;
            parseReturnStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ReturnStatement>): import("@babel/types").ReturnStatement;
            parseSwitchStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").SwitchStatement>): import("@babel/types").SwitchStatement;
            parseThrowStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ThrowStatement>): import("@babel/types").ThrowStatement;
            parseCatchClauseParam(this: import("./parser/index.ts").default): Exclude<ReturnType<typeof this.parseBindingAtom>, import("@babel/types").VoidPattern>;
            parseTryStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").TryStatement>): import("@babel/types").TryStatement;
            parseVarStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("@babel/types").VariableDeclaration;
            parseWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WhileStatement>): import("@babel/types").WhileStatement;
            parseWithStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WithStatement>): import("@babel/types").WithStatement;
            parseEmptyStatement(node: import("./parser/node.ts").Undone<import("@babel/types").EmptyStatement>): import("@babel/types").EmptyStatement;
            parseLabeledStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").LabeledStatement>, maybeName: string, expr: import("@babel/types").Identifier, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").LabeledStatement;
            parseExpressionStatement(node: import("./parser/node.ts").Undone<import("@babel/types").ExpressionStatement>, expr: import("@babel/types").Expression): import("@babel/types").ExpressionStatement;
            parseBlock(this: import("./parser/index.ts").default, allowDirectives?: boolean, createNewLexicalScope?: boolean, afterBlockParse?: (hasStrictModeDirective: boolean) => void): import("@babel/types").BlockStatement;
            isValidDirective(stmt: import("@babel/types").Statement): stmt is import("@babel/types").ExpressionStatement;
            parseBlockBody(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("./types.ts").BlockStatementLike>, allowDirectives: boolean | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseBlockOrModuleBlockBody(this: import("./parser/index.ts").default, body: import("@babel/types").Statement[], directives: import("@babel/types").Directive[] | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseFor(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForStatement>, init?: import("@babel/types").VariableDeclaration | import("@babel/types").Expression | null): import("@babel/types").ForStatement;
            parseForX(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForXStatement>, init: import("@babel/types").VariableDeclaration | import("@babel/types").AssignmentPattern | import("@babel/types").Identifier | import("@babel/types").MemberExpression, awaitAt?: import("./util/location.ts").Position | null): import("@babel/types").ForXStatement;
            parseVar(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, isFor: boolean, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>;
            parseVarId(this: import("./parser/index.ts").default, decl: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclarator>, kind: "var" | "let" | "const" | "using" | "await using"): void;
            parseAsyncFunctionExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionExpression>): import("@babel/types").FunctionExpression;
            parseFunction<T extends import("./types.ts").NormalFunction>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, flags?: import("./parser/statement.ts").ParseFunctionFlag): T;
            parseFunctionId(requireId?: boolean): import("@babel/types").Identifier | undefined | null;
            parseFunctionParams(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isConstructor?: boolean): void;
            registerFunctionStatementId(node: import("./types.ts").NormalFunction): void;
            parseClass<T extends import("@babel/types").Class>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, isStatement: boolean, optionalId?: boolean): T;
            isClassProperty(): boolean;
            isClassMethod(): boolean;
            nameIsConstructor(key: import("@babel/types").Expression | import("@babel/types").PrivateName): boolean;
            isNonstaticConstructor(method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty>): boolean;
            parseClassBody(this: import("./parser/index.ts").default, hadSuperClass: boolean, oldStrict: boolean): import("@babel/types").ClassBody;
            parseClassMemberFromModifier(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): boolean;
            parseClassMember(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>, state: import("./types.ts").ParseClassMemberState): void;
            parseClassMemberWithIsStatic(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>, state: import("./types.ts").ParseClassMemberState, isStatic: boolean): void;
            parseClassElementName(this: import("./parser/index.ts").default, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): import("@babel/types").Expression | import("@babel/types").Identifier | import("@babel/types").PrivateName;
            parseClassStaticBlock(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("@babel/types").StaticBlock & {
                decorators?: import("@babel/types").Decorator[];
            }>): void;
            pushClassProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty>): void;
            pushClassPrivateProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateProperty>): void;
            pushClassAccessorProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>, isPrivate: boolean): void;
            pushClassMethod(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowsDirectSuper: boolean): void;
            pushClassPrivateMethod(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod>, isGenerator: boolean, isAsync: boolean): void;
            declareClassPrivateMethodInScope(node: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod | import("@babel/types").TSDeclareMethod>, kind: number): void;
            parsePostMemberNameModifiers(methodOrProp: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty>): void;
            parseClassPrivateProperty(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateProperty>): import("@babel/types").ClassPrivateProperty;
            parseClassProperty(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty>): import("@babel/types").ClassProperty;
            parseClassAccessorProperty(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>): import("@babel/types").ClassAccessorProperty;
            parseInitializer(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty | import("@babel/types").ClassPrivateProperty | import("@babel/types").ClassAccessorProperty>): void;
            parseClassId(node: import("./parser/node.ts").Undone<import("@babel/types").Class>, isStatement: boolean, optionalId?: boolean | null, bindingType?: import("./util/scopeflags.ts").BindingFlag): void;
            parseClassSuper(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Class>): void;
            parseExport(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, decorators: import("@babel/types").Decorator[] | null | undefined): import("./types.ts").AnyExport;
            eatExportStar(_: import("./parser/node.ts").Undone<import("./types.ts").Node>): _ is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>;
            maybeParseExportDefaultSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportNamespaceSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportNamedSpecifiers(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportDeclaration(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>): boolean;
            isAsyncFunction(): boolean;
            parseExportDefaultExpression(this: import("./parser/index.ts").default): import("@babel/types").ExportDefaultDeclaration["declaration"] | import("@babel/types").EnumDeclaration;
            parseExportDeclaration(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>): import("@babel/types").ExportNamedDeclaration["declaration"] | undefined;
            isExportDefaultSpecifier(): boolean;
            parseExportFrom(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>, expect?: boolean): void;
            shouldParseExportDeclaration(): boolean;
            checkNamedExport(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>, isFrom?: boolean): void;
            checkDeclaration(node: import("@babel/types").Identifier | import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").ObjectProperty): void;
            checkDuplicateExports(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier | import("@babel/types").StringLiteral | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportSpecifier | import("@babel/types").ExportDefaultSpecifier>, exportName: string): void;
            parseExportSpecifiers(isInTypeExport: boolean): import("@babel/types").ExportSpecifier[];
            parseExportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportSpecifier>, isString: boolean, isInTypeExport: boolean, isMaybeTypeOnly: boolean): import("@babel/types").ExportSpecifier;
            parseModuleExportName(): import("@babel/types").StringLiteral | import("@babel/types").Identifier;
            checkImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            isPotentialImportPhase(isExport: boolean): boolean;
            applyImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration>, isExport: boolean, phase: string | null, loc?: number): void;
            parseMaybeImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").TSImportEqualsDeclaration>, isExport: boolean): import("@babel/types").Identifier | null;
            isPrecedingIdImportPhase(phase: string): boolean;
            parseImport(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("./types.ts").AnyImport;
            parseImportSpecifiersAndAfter(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): import("@babel/types").ImportDeclaration;
            parseImportSourceAndAttributes(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("@babel/types").ImportDeclaration;
            parseImportSource(this: import("./parser/index.ts").default): import("@babel/types").StringLiteral;
            parseImportSpecifierLocal<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, specifier: import("./parser/node.ts").Undone<T>, type: T["type"]): void;
            finishImportSpecifier<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(specifier: import("./parser/node.ts").Undone<T>, type: T["type"], bindingType?: import("./util/scopeflags.ts").BindingFlag): T;
            parseImportAttributes(): import("@babel/types").ImportAttribute[];
            maybeParseImportAttributes(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): void;
            maybeParseDefaultImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): boolean;
            maybeParseStarImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): boolean;
            parseNamedImportSpecifiers(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            parseImportSpecifier(specifier: import("./parser/node.ts").Undone<import("@babel/types").ImportSpecifier>, importedIsString: boolean, isInTypeOnlyImport: boolean, isMaybeTypeOnly: boolean, bindingType: import("./util/scopeflags.ts").BindingFlag | undefined): import("@babel/types").ImportSpecifier;
            isThisParam(param: import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty | import("@babel/types").RestElement): boolean;
            checkProto(prop: import("./types.ts").ObjectMember | import("@babel/types").SpreadElement, sawProto: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): boolean;
            shouldExitDescending(expr: import("@babel/types").Expression | import("@babel/types").PrivateName | import("@babel/types").Super | import("@babel/types").Import): expr is import("@babel/types").ArrowFunctionExpression;
            getExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression & import("./types.ts").ParserOutput;
            parseExpression(this: import("./parser/index.ts").default, disallowIn?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExpressionBase(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseMaybeAssignDisallowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            setOptionalParametersError(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            parseMaybeAssign(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssign(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeConditional(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseConditional(this: import("./parser/index.ts").default, expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeUnaryOrPrivate(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression | import("@babel/types").PrivateName;
            parseExprOps(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExprOp(this: import("./parser/index.ts").default, left: import("@babel/types").Expression | import("@babel/types").PrivateName, leftStartLoc: import("./util/location.ts").Position, minPrec: number): import("@babel/types").Expression;
            parseExprOpRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseExprOpBaseRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseHackPipeBody(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            checkExponentialAfterUnary(node: import("@babel/types").AwaitExpression | import("./parser/node.ts").Undone<import("@babel/types").UnaryExpression>): void;
            parseMaybeUnary(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, sawUnary?: boolean): import("@babel/types").Expression;
            parseUpdate(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").UpdateExpression>, update: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseExprSubscripts(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: false | null): import("@babel/types").Expression;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls: true): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: boolean | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscript(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls: boolean | undefined | null, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            stopParseSubscript(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseMember(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, computed: boolean, optional: boolean): import("@babel/types").OptionalMemberExpression | import("@babel/types").MemberExpression;
            parseBind(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseCoverCallAndAsyncArrowHead(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, optional: boolean): import("@babel/types").Expression;
            parseTaggedTemplateExpression(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").TaggedTemplateExpression;
            atPossibleAsyncArrow(base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import): boolean;
            finishCallExpression<T extends import("@babel/types").CallExpression | import("@babel/types").OptionalCallExpression>(node: import("./parser/node.ts").Undone<T>, optional: boolean): T;
            parseCallExpressionArguments(this: import("./parser/index.ts").default, allowPlaceholder?: boolean, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): (import("@babel/types").Expression | import("@babel/types").SpreadElement)[];
            shouldParseAsyncArrow(): boolean;
            parseAsyncArrowFromCallExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, call: import("@babel/types").CallExpression): import("@babel/types").ArrowFunctionExpression;
            parseNoCallExpr(this: import("./parser/index.ts").default, onUnparenthesizedImportExpression: (base: import("@babel/types").ImportExpression) => void): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseTopicReferenceThenEqualsSign(topicTokenType: import("./tokenizer/types.ts").TokenType, topicTokenValue: string): import("@babel/types").Expression;
            parseTopicReference(pipeProposal: string): import("@babel/types").Expression;
            finishTopicReference(node: import("./parser/node.ts").Undone<import("@babel/types").TopicReference>, startLoc: import("./util/location.ts").Position, pipeProposal: string, tokenType: import("./tokenizer/types.ts").TokenType): import("@babel/types").TopicReference;
            testTopicReferenceConfiguration(pipeProposal: string, startLoc: import("./util/location.ts").Position, tokenType: import("./tokenizer/types.ts").TokenType): boolean;
            parseAsyncArrowUnaryFunction(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("@babel/types").ArrowFunctionExpression;
            parseDo(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoExpression>, isAsync: boolean): import("@babel/types").DoExpression;
            parseSuper(): import("@babel/types").Super;
            parsePrivateName(): import("@babel/types").PrivateName;
            parseFunctionOrFunctionSent(this: import("./parser/index.ts").default): import("@babel/types").FunctionExpression | import("@babel/types").MetaProperty;
            parseMetaProperty(node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty>, meta: import("@babel/types").Identifier, propertyName: string): import("@babel/types").MetaProperty;
            parseImportMetaPropertyOrPhaseCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty | import("@babel/types").ImportExpression>): import("@babel/types").MetaProperty | import("@babel/types").ImportExpression;
            parseLiteralAtNode<T extends import("./types.ts").Node>(value: any, type: T["type"], node: any): T;
            parseLiteral<T extends import("./types.ts").Node>(value: any, type: T["type"]): T;
            parseStringLiteral(value: any): import("@babel/types").StringLiteral;
            parseNumericLiteral(value: any): import("@babel/types").NumericLiteral;
            parseBigIntLiteral(value: any): import("@babel/types").BigIntLiteral;
            parseRegExpLiteral(value: {
                value: any;
                pattern: string;
                flags: import("@babel/types").RegExpLiteral["flags"];
            }): import("@babel/types").RegExpLiteral;
            parseBooleanLiteral(value: boolean): import("@babel/types").BooleanLiteral;
            parseNullLiteral(): import("@babel/types").NullLiteral;
            parseParenAndDistinguishExpression(this: import("./parser/index.ts").default, canStartArrow: boolean): import("@babel/types").Expression;
            wrapParenthesis(startLoc: import("./util/location.ts").Position, expression: import("@babel/types").Expression): import("@babel/types").Expression;
            shouldParseArrow(params: import("./types.ts").Node[]): boolean;
            parseArrow(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression> | undefined | null;
            parseParenItem<T extends import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").SpreadElement | import("./types.ts").TSTypeCastExpression>(node: T, startLoc: import("./util/location.ts").Position): T | import("@babel/types").TypeCastExpression | import("./types.ts").TSTypeCastExpression;
            parseNewOrNewTarget(this: import("./parser/index.ts").default): import("@babel/types").NewExpression | import("@babel/types").MetaProperty;
            parseNew(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").NewExpression>): import("@babel/types").NewExpression;
            parseNewCallee(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").NewExpression>): void;
            parseTemplateElement(isTagged: boolean): import("@babel/types").TemplateElement;
            parseTemplate(this: import("./parser/index.ts").default, isTagged: boolean): import("@babel/types").TemplateLiteral;
            parseTemplateSubstitution(this: import("./parser/index.ts").default): import("@babel/types").Expression | import("@babel/types").TSType;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: true, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectPattern;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectExpression;
            addTrailingCommaExtraToNode(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): void;
            maybeAsyncOrAccessorProp(prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty | import("@babel/types").ObjectMethod>): prop is typeof prop & {
                key: import("@babel/types").Identifier;
            };
            parsePropertyDefinition(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("./types.ts").ObjectMember | import("@babel/types").SpreadElement;
            getGetterSetterExpectedParamCount(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): number;
            getObjectOrClassMethodParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): (import("@babel/types").TSParameterProperty | import("@babel/types").FunctionParameter)[] | import("@babel/types").FunctionParameter[];
            checkGetterSetterParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): void;
            parseObjectMethod(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod>, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean): import("@babel/types").ObjectMethod | undefined | null;
            parseObjectProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>, startLoc: import("./util/location.ts").Position | undefined | null, isPattern: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectProperty | undefined | null;
            finishObjectProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>): import("@babel/types").ObjectProperty;
            parseObjPropValue<T extends import("./types.ts").ObjectMember>(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<T>, startLoc: import("./util/location.ts").Position | undefined | null, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): T;
            parsePropertyName(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember> | import("@babel/types").TSPropertySignature | import("@babel/types").TSMethodSignature, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): void;
            initFunction(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isAsync: boolean): void;
            parseMethod<T extends import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod | import("@babel/types").ClassPrivateMethod>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowDirectSuper: boolean, type: T["type"], inClassScope?: boolean): T;
            parseArrayLike(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ArrayExpression;
            parseArrowExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | null | undefined, isAsync: boolean, trailingCommaLoc?: import("./util/location.ts").Position | null): import("@babel/types").ArrowFunctionExpression;
            setArrowFunctionParameters(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[], trailingCommaLoc?: import("./util/location.ts").Position | null): void;
            parseFunctionBodyAndFinish<T extends import("@babel/types").Function | import("@babel/types").TSDeclareMethod | import("@babel/types").TSDeclareFunction | import("@babel/types").ClassPrivateMethod>(node: import("./parser/node.ts").Undone<T>, type: T["type"], isMethod?: boolean): T;
            parseFunctionBody(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Function>, allowExpression?: boolean | null, isMethod?: boolean): void;
            isSimpleParameter(node: import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty): boolean;
            isSimpleParamList(params: readonly (import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty)[]): boolean;
            checkParams(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, allowDuplicates: boolean, isArrowFunction?: boolean | null, strictModeChanged?: boolean): void;
            parseExprList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null): (import("@babel/types").Expression | null)[];
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression | null;
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression;
            parseIdentifier(liberal?: boolean): import("@babel/types").Identifier;
            createIdentifier(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string): import("@babel/types").Identifier;
            createIdentifierAt(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string, endLoc: import("./util/location.ts").Position): import("@babel/types").Identifier;
            parseIdentifierName(liberal?: boolean): string;
            checkReservedWord(word: string, startLoc: number, checkKeywords: boolean, isBinding: boolean): void;
            recordAwaitIfAllowed(): boolean;
            parseAwait(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position, soloAwait?: boolean): import("@babel/types").AwaitExpression;
            isAmbiguousPrefixOrIdentifier(): boolean;
            parseYield(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position): import("@babel/types").YieldExpression;
            parseImportCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportExpression>): import("@babel/types").ImportExpression;
            withTopicBindingContext<T>(callback: () => T): T;
            allowInAnd<T>(callback: () => T): T;
            disallowInAnd<T>(callback: () => T): T;
            registerTopicReference(): void;
            topicReferenceIsAllowedInCurrentContext(): boolean;
            topicReferenceWasUsedInCurrentContext(): boolean;
            parseFSharpPipelineBody(this: import("./parser/index.ts").default, prec: number): import("@babel/types").Expression;
            parseModuleExpression(this: import("./parser/index.ts").default): import("@babel/types").ModuleExpression;
            parseVoidPattern(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").VoidPattern;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parsePropertyNamePrefixOperator(prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember>): void;
            toAssignable(node: import("./types.ts").Node, isLHS?: boolean): asserts node is import("./types.ts").Assignable;
            toAssignableObjectExpressionProp(prop: import("./types.ts").Node, isLast: boolean, isLHS: boolean): void;
            toAssignableList(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[], trailingCommaLoc: import("./util/location.ts").Position | undefined | null, isLHS: boolean): void;
            toAssignableListItem(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression)[], index: number, isLHS: boolean): void;
            isAssignable(node: import("./types.ts").Node, isBinding?: boolean): boolean;
            toReferencedList(exprList: readonly (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[] | readonly (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression | null)[], isParenthesizedExpr?: boolean): readonly (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[] | readonly (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression | null)[];
            parseSpread(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").SpreadElement;
            parseRestBinding(this: import("./parser/index.ts").default): import("@babel/types").RestElement;
            parseBindingAtom(this: import("./parser/index.ts").default): import("@babel/types").ArrayPattern | import("@babel/types").ObjectPattern | import("@babel/types").VoidPattern | import("@babel/types").Identifier;
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.ALLOW_EMPTY): (import("@babel/types").Pattern | import("@babel/types").RestElement | null)[];
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.IS_FUNCTION_PARAMS): (import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").TSParameterProperty)[];
            parseBindingRestProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").RestElement>): import("@babel/types").RestElement;
            parseBindingProperty(this: import("./parser/index.ts").default): import("./types.ts").AssignmentProperty | import("@babel/types").RestElement;
            parseBindingElement(this: import("./parser/index.ts").default, flags: import("./parser/lval.ts").ParseBindingListFlags, decorators: import("@babel/types").Decorator[]): import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty;
            parseFunctionParamType<T extends import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").RestElement>(param: T): T;
            parseMaybeDefault<P extends import("@babel/types").Pattern | import("@babel/types").Identifier>(this: import("./parser/index.ts").default, startLoc?: import("./util/location.ts").Position | null, left?: P | null): P | import("@babel/types").AssignmentPattern;
            isValidLVal(type: string, disallowCallExpression: boolean, isUnparenthesizedInAssign: boolean, binding: import("./util/scopeflags.ts").BindingFlag): string | boolean | [string, boolean];
            isOptionalMemberExpression(expression: import("./types.ts").Node): boolean;
            checkLVal(expression: import("@babel/types").Expression | import("./types.ts").ObjectMember | import("@babel/types").RestElement | import("@babel/types").Pattern | import("@babel/types").TSParameterProperty | import("./types.ts").TSTypeCastExpression, ancestor: import("./parse-error.ts").LValAncestor, binding?: import("./util/scopeflags.ts").BindingFlag, checkClashes?: Set<string> | false, strictModeChanged?: boolean, hasParenthesizedAncestor?: boolean, disallowCallExpression?: boolean): void;
            checkIdentifier(at: import("@babel/types").Identifier, bindingType: import("./util/scopeflags.ts").BindingFlag, strictModeChanged?: boolean): void;
            declareNameFromIdentifier(identifier: import("@babel/types").Identifier, binding: import("./util/scopeflags.ts").BindingFlag): void;
            checkToRestConversion(node: import("./types.ts").Node, allowPattern: boolean): void;
            checkCommaAfterRest(close: typeof import("charcodes")[keyof typeof import("charcodes")]): boolean;
            createPosition(loc: import("./util/location.ts").Position): import("./util/location.ts").Position;
            startNode<T extends import("./types.ts").Node = never>(): import("./parser/node.ts").Undone<T>;
            startNodeAt<T extends import("./types.ts").Node = never>(loc: import("./util/location.ts").Position): import("./parser/node.ts").Undone<T>;
            startNodeAtNode<T extends import("./types.ts").Node = never>(type: import("./parser/node.ts").Undone<import("./types.ts").Node>): import("./parser/node.ts").Undone<T>;
            finishNode<T extends import("./types.ts").Node>(node: import("./parser/node.ts").Undone<T>, type: T["type"]): T;
            finishNodeAt<T extends import("./types.ts").Node>(node: Omit<T, "type">, type: T["type"], endLoc: import("./util/location.ts").Position): T;
            finishNodeAtNode<T extends import("./types.ts").Node>(node: Omit<T, "type">, type: T["type"], endNode: import("./types.ts").Node): T;
            resetStartLocation(node: import("./types.ts").BaseNode, startLoc: import("./util/location.ts").Position): void;
            resetEndLocation(node: import("./types.ts").BaseNode, endLoc?: import("./util/location.ts").Position): void;
            resetStartLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            resetEndLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            castNodeTo<T extends import("./types.ts").Node["type"]>(node: import("./types.ts").Node, type: T): Extract<import("./types.ts").Node, {
                type: T;
            }>;
            cloneIdentifier<T extends import("@babel/types").Identifier | import("./types.ts").Placeholder>(node: T): T;
            cloneStringLiteral<T extends import("@babel/types").StringLiteral | import("./types.ts").EstreeLiteral | import("./types.ts").Placeholder>(node: T): T;
            addExtra(node: Partial<import("./types.ts").Node>, key: string, value: any, enumerable?: boolean): void;
            isContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            isUnparsedContextual(nameStart: number, name: string): boolean;
            isLookaheadContextual(name: string): boolean;
            eatContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            expectContextual(token: import("./tokenizer/types.ts").TokenType, toParseError?: import("./parse-error.ts").ParseErrorConstructor<any>): void;
            canInsertSemicolon(): boolean;
            hasPrecedingLineBreak(): boolean;
            hasFollowingLineBreak(): boolean;
            isLineTerminator(): boolean;
            semicolon(allowAsi?: boolean): void;
            expect(type: import("./tokenizer/types.ts").TokenType, loc?: import("./util/location.ts").Position | null): void;
            tryParse<T extends import("./types.ts").Node | readonly import("./types.ts").Node[] | null>(fn: (abort: (node?: T) => never) => T, oldState?: import("./tokenizer/state.ts").default): {
                node: T;
                error: null;
                thrown: false;
                aborted: false;
                failState: null;
            } | {
                node: T | null;
                error: import("./parse-error.ts").ParseError;
                thrown: boolean;
                aborted: false;
                failState: import("./tokenizer/state.ts").default;
            } | {
                node: T | null;
                error: null;
                thrown: false;
                aborted: true;
                failState: import("./tokenizer/state.ts").default;
            };
            checkExpressionErrors(refExpressionErrors: import("./parser/util.ts").ExpressionErrors | undefined | null, andThrow: boolean): boolean | undefined;
            isLiteralPropertyName(): boolean;
            isPrivateName(node: import("./types.ts").Node): node is import("@babel/types").PrivateName;
            getPrivateNameSV(node: import("@babel/types").PrivateName): string;
            hasPropertyAsPrivateName(node: import("./types.ts").Node): boolean;
            isObjectProperty(node: import("./types.ts").Node): node is import("@babel/types").ObjectProperty | import("./types.ts").EstreePropertyDefinition;
            isObjectMethod(node: import("./types.ts").Node): node is import("@babel/types").ObjectMethod;
            initializeScopes(this: import("./parser/index.ts").default, inModule?: boolean): () => void;
            enterInitialScopes(): void;
            checkDestructuringPrivate(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            isLookahead: boolean;
            tokens: (import("./index.ts").Token | import("./types.ts").Comment)[];
            setLoc(loc: import("./util/location.ts").Position): void;
            getLoc(locIndex: number): import("./util/location.ts").Position;
            pushToken(token: import("./index.ts").Token | import("./types.ts").Comment): void;
            next(): void;
            eat(type: import("./tokenizer/types.ts").TokenType): boolean;
            match(type: import("./tokenizer/types.ts").TokenType): boolean;
            createLookaheadState(state: import("./tokenizer/state.ts").default): import("./tokenizer/state.ts").LookaheadState;
            lookahead(): import("./tokenizer/state.ts").LookaheadState;
            nextTokenStart(): number;
            nextTokenStartSince(pos: number): number;
            lookaheadCharCode(): number;
            lookaheadCharCodeSince(pos: number): number;
            nextTokenInLineStart(): number;
            nextTokenInLineStartSince(pos: number): number;
            lookaheadInLineCharCode(): number;
            codePointAtPos(pos: number): number;
            setStrict(strict: boolean): void;
            curContext(): import("./tokenizer/context.ts").TokContext;
            nextToken(): void;
            skipBlockComment(commentEnd: "*/" | "*-/"): import("./types.ts").CommentBlock | undefined;
            skipLineComment(startSkip: number): import("./types.ts").CommentLine | undefined;
            skipSpace(): void;
            finishToken(type: import("./tokenizer/types.ts").TokenType, val?: any): void;
            replaceToken(type: import("./tokenizer/types.ts").TokenType): void;
            readToken_numberSign(): void;
            readToken_dot(): void;
            readToken_slash(): void;
            readToken_interpreter(): boolean;
            readToken_mult_modulo(code: number): void;
            readToken_pipe_amp(code: number): void;
            readToken_caret(): void;
            readToken_atSign(): void;
            readToken_plus_min(code: number): void;
            readToken_lt(): void;
            readToken_gt(): void;
            readToken_eq_excl(code: number): void;
            readToken_question(): void;
            getTokenFromCode(code: number): void;
            finishOp(type: import("./tokenizer/types.ts").TokenType, size: number): void;
            readRegexp(): void;
            readInt(radix: number, len?: number, forceLen?: boolean, allowNumSeparator?: boolean | "bail"): number | null;
            readRadixNumber(radix: number): void;
            readNumber(startsWithDot: boolean): void;
            readCodePoint(throwOnInvalid: boolean): number | null;
            readString(quote: number): void;
            readTemplateContinuation(): void;
            readTemplateToken(): void;
            recordStrictModeErrors(toParseError: import("./tokenizer/state.ts").DeferredStrictError, at: import("./util/location.ts").Position): void;
            readWord1(firstCode?: number): string;
            readWord(firstCode?: number): void;
            checkKeywordEscapes(): void;
            raise<ErrorDetails = object>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node> | number, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            raiseOverwrite<ErrorDetails>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node>, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            updateContext(prevType?: import("./tokenizer/types.ts").TokenType): void;
            unexpected(loc?: import("./util/location.ts").Position | number | null, type?: import("./tokenizer/types.ts").TokenType): any;
            expectPlugin(pluginName: import("./typings.d.ts").Plugin, loc?: import("./util/location.ts").Position | number | null): true;
            expectOnePlugin(pluginNames: import("./typings.d.ts").Plugin[]): any;
            errorBuilder(error: import("./parse-error.ts").ParseErrorConstructor<object>): (pos: number, lineStart: number, curLine: number) => void;
            errorHandlers_readInt: import("@babel/helper-string-parser").IntErrorHandlers;
            errorHandlers_readCodePoint: import("@babel/helper-string-parser").CodePointErrorHandlers;
            errorHandlers_readStringContents_string: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            errorHandlers_readStringContents_template: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            addComment(comment: import("./types.ts").Comment): void;
            processComment(node: import("./types.ts").Node): void;
            finalizeComment(commentWS: import("./parser/comments.ts").CommentWhitespace): void;
            finalizeRemainingComments(): void;
            resetPreviousNodeTrailingComments(node: import("./types.ts").Node): void;
            takeSurroundingComments(node: import("./types.ts").Node, start: number, end: number): void;
            options: import("./options.ts").Options;
            optionFlags: import("./options.ts").OptionFlags;
            inModule: boolean;
            scope: import("./util/scope.ts").default<any>;
            classScope: import("./util/class-scope.ts").default;
            prodParam: import("./util/production-parameter.ts").default;
            expressionScope: import("./util/expression-scope.ts").default;
            plugins: import("./parser/index.ts").PluginsMap;
            filename: string | undefined | null;
            startIndex: number;
            exportedIdentifiers: Set<string>;
            sawUnambiguousESM: boolean;
            ambiguousScriptDifferentAst: boolean;
            state: import("./tokenizer/state.ts").default;
            input: string;
            length: number;
            comments: import("./types.ts").Comment[];
            locData: Uint32Array;
            sourceToOffsetPos(sourcePos: number): number;
            offsetToSourcePos(offsetPos: number): number;
            hasPlugin(pluginConfig: PluginConfig): boolean;
            getPluginOption<PluginName extends import("./typings.d.ts").ParserPluginWithOptions[0], OptionName extends keyof import("./typings.d.ts").PluginOptions<PluginName>>(plugin: PluginName, name: OptionName): NonNullable<import("./typings.d.ts").PluginOptions<PluginName>>[OptionName] | undefined;
        };
    };
    placeholders: (superClass: typeof import("./parser/index.ts").default) => {
        new (options: import("./index.ts").ParserOptions | undefined | null, input: string, pluginsMap: import("./parser/index.ts").PluginsMap): {
            parsePlaceholder<T extends import("./plugins/placeholders.ts").PlaceholderTypes>(expectedNode: T): {
                Identifier: import("@babel/types").Identifier;
                StringLiteral: import("@babel/types").StringLiteral;
                Expression: import("@babel/types").Expression;
                Statement: import("@babel/types").Statement;
                Declaration: import("@babel/types").Declaration;
                BlockStatement: import("@babel/types").BlockStatement;
                ClassBody: import("@babel/types").ClassBody;
                Pattern: Exclude<import("@babel/types").Pattern, import("@babel/types").AssignmentPattern>;
            }[T] | undefined;
            finishPlaceholder<T extends import("./plugins/placeholders.ts").PlaceholderTypes>(node: import("./parser/node.ts").Undone<import("./types.ts").Placeholder> | import("./parser/node.ts").Undone<import("@babel/types").ArrayExpression | import("@babel/types").ArrayPattern | import("@babel/types").ArrowFunctionExpression | import("@babel/types").AssignmentExpression | import("@babel/types").AwaitExpression | import("@babel/types").BigIntLiteral | import("@babel/types").BinaryExpressionIn | import("@babel/types").BinaryExpressionNotIn | import("@babel/types").BindExpression | import("@babel/types").BlockStatement | import("@babel/types").BooleanLiteral | import("@babel/types").BreakStatement | import("@babel/types").CallExpression | import("@babel/types").ClassBody | import("@babel/types").ClassDeclaration | import("@babel/types").ClassExpression | import("@babel/types").ConditionalExpression | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoExpression | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").FunctionExpression | import("@babel/types").Identifier | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").ImportExpression | import("@babel/types").InterfaceDeclaration | import("@babel/types").JSXElement | import("@babel/types").JSXFragment | import("@babel/types").LabeledStatement | import("@babel/types").LogicalExpression | import("@babel/types").MemberExpressionComputed | import("@babel/types").MemberExpressionNonComputed | import("@babel/types").MetaProperty | import("@babel/types").ModuleExpression | import("@babel/types").NewExpression | import("@babel/types").NullLiteral | import("@babel/types").NumericLiteral | import("@babel/types").ObjectExpression | import("@babel/types").ObjectPattern | import("@babel/types").OpaqueType | import("@babel/types").OptionalCallExpression | import("@babel/types").OptionalMemberExpressionComputed | import("@babel/types").OptionalMemberExpressionNonComputed | import("@babel/types").ParenthesizedExpression | import("@babel/types").RegExpLiteral | import("@babel/types").ReturnStatement | import("@babel/types").SequenceExpression | import("@babel/types").StringLiteral | import("@babel/types").SwitchStatement | import("@babel/types").TSAsExpression | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInstantiationExpression | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSNonNullExpression | import("@babel/types").TSSatisfiesExpression | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").TSTypeAssertion | import("@babel/types").TaggedTemplateExpression | import("@babel/types").TemplateLiteral | import("@babel/types").ThisExpression | import("@babel/types").ThrowStatement | import("@babel/types").TopicReference | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").TypeCastExpression | import("@babel/types").UnaryExpression | import("@babel/types").UpdateExpression | import("@babel/types").VariableDeclaration | import("@babel/types").VoidPattern | import("@babel/types").WhileStatement | import("@babel/types").WithStatement | import("@babel/types").YieldExpression>, expectedNode: T): {
                Identifier: import("@babel/types").Identifier;
                StringLiteral: import("@babel/types").StringLiteral;
                Expression: import("@babel/types").Expression;
                Statement: import("@babel/types").Statement;
                Declaration: import("@babel/types").Declaration;
                BlockStatement: import("@babel/types").BlockStatement;
                ClassBody: import("@babel/types").ClassBody;
                Pattern: Exclude<import("@babel/types").Pattern, import("@babel/types").AssignmentPattern>;
            }[T];
            getTokenFromCode(code: number): void;
            parseExprAtom(refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseIdentifier(liberal?: boolean): import("@babel/types").Identifier;
            checkReservedWord(word: string, startLoc: number, checkKeywords: boolean, isBinding: boolean): void;
            cloneIdentifier<T extends import("@babel/types").Identifier | import("./types.ts").Placeholder>(node: T): T;
            cloneStringLiteral<T extends import("./types.ts").EstreeLiteral | import("@babel/types").StringLiteral | import("./types.ts").Placeholder>(node: T): T;
            parseBindingAtom(): import("@babel/types").ArrayPattern | import("@babel/types").Identifier | import("@babel/types").ObjectPattern | import("@babel/types").VoidPattern;
            isValidLVal(type: string, disallowCallExpression: boolean, isParenthesized: boolean, binding: import("./util/scopeflags.ts").BindingFlag): string | boolean | [string, boolean];
            toAssignable(node: import("./types.ts").Node, isLHS: boolean): void;
            chStartsBindingIdentifier(ch: number, pos: number): boolean;
            verifyBreakContinue(node: import("@babel/types").BreakStatement | import("@babel/types").ContinueStatement, isBreak: boolean): void;
            parseExpressionStatement(node: import("@babel/types").Statement, expr: import("@babel/types").Expression): import("@babel/types").Statement;
            parseBlock(allowDirectives?: boolean, createNewLexicalScope?: boolean, afterBlockParse?: (hasStrictModeDirective: boolean) => void): import("@babel/types").BlockStatement;
            parseFunctionId(requireId?: boolean): import("@babel/types").Identifier | undefined | null;
            parseClass<T extends import("@babel/types").Class>(node: T, isStatement: boolean, optionalId?: boolean): T;
            parseExport(node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, decorators: import("@babel/types").Decorator[] | null): import("./types.ts").AnyExport;
            isExportDefaultSpecifier(): boolean;
            maybeParseExportDefaultSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportNamedDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            checkNamedExport(): void;
            parseImport(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("@babel/types").ImportDeclaration | import("@babel/types").TSImportEqualsDeclaration;
            parseImportSource(): import("@babel/types").StringLiteral;
            assertNoSpace(): void;
            getScopeHandler(): new (...args: any) => import("./util/scope.ts").default;
            parse(): import("./index.ts").ParseResult<import("@babel/types").File>;
            parseTopLevel(this: import("./parser/index.ts").default, file: import("./parser/node.ts").Undone<import("@babel/types").File>, program: import("./parser/node.ts").Undone<import("@babel/types").Program>): import("@babel/types").File;
            parseProgram(this: import("./parser/index.ts").default, program: import("./parser/node.ts").Undone<import("@babel/types").Program>, end: import("./tokenizer/types.ts").TokenType, sourceType: import("@babel/types").Program["sourceType"]): import("@babel/types").Program;
            stmtToDirective(stmt: import("@babel/types").ExpressionStatement): import("@babel/types").Directive;
            parseInterpreterDirective(): import("@babel/types").InterpreterDirective | null;
            isLet(): boolean;
            isUsing(): boolean;
            isForUsing(): boolean;
            nextTokenIsIdentifierOnSameLine(): boolean;
            isAwaitUsing(): boolean;
            chStartsBindingPattern(ch: number): ch is 91 | 123;
            hasFollowingBindingAtom(): boolean;
            hasInLineFollowingBindingIdentifierOrBrace(): boolean;
            allowsUsing(): boolean;
            parseModuleItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementListItem(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementOrSloppyAnnexBFunctionDeclaration(this: import("./parser/index.ts").default, allowLabeledFunction?: boolean): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatement(this: import("./parser/index.ts").default): import("@babel/types").BlockStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").DebuggerStatement | import("@babel/types").DeclareClass | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareVariable | import("@babel/types").DoWhileStatement | import("@babel/types").EmptyStatement | import("@babel/types").EnumDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExpressionStatement | import("@babel/types").ForInStatement | import("@babel/types").ForOfStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").IfStatement | import("@babel/types").ImportDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").LabeledStatement | import("@babel/types").OpaqueType | import("@babel/types").ReturnStatement | import("@babel/types").SwitchStatement | import("@babel/types").TSDeclareFunction | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").TSNamespaceExportDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").ThrowStatement | import("@babel/types").TryStatement | import("@babel/types").TypeAlias | import("@babel/types").VariableDeclaration | import("@babel/types").WhileStatement | import("@babel/types").WithStatement;
            parseStatementLike(this: import("./parser/index.ts").default, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").Statement | import("@babel/types").Declaration | import("@babel/types").ImportDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration;
            parseStatementContent(this: import("./parser/index.ts").default, flags: import("./parser/statement.ts").ParseStatementFlag, decorators?: import("@babel/types").Decorator[] | null): import("@babel/types").Statement;
            assertModuleNodeAllowed(node: import("./types.ts").Node): void;
            maybeTakeDecorators<T extends import("./parser/node.ts").Undone<import("@babel/types").Class>>(maybeDecorators: import("@babel/types").Decorator[] | null | undefined, classNode: T, exportNode?: import("./parser/node.ts").Undone<import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration>): T;
            canHaveLeadingDecorator(): boolean;
            parseDecorators(this: import("./parser/index.ts").default, allowExport?: boolean): import("@babel/types").Decorator[];
            parseDecorator(this: import("./parser/index.ts").default): import("@babel/types").Decorator;
            parseMaybeDecoratorArguments(this: import("./parser/index.ts").default, expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position): import("@babel/types").Expression;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: true): import("@babel/types").BreakStatement;
            parseBreakContinueStatement(node: import("./parser/node.ts").Undone<import("./types.ts").Node>, isBreak: false): import("@babel/types").ContinueStatement;
            parseDebuggerStatement(node: import("./parser/node.ts").Undone<import("@babel/types").DebuggerStatement>): import("@babel/types").DebuggerStatement;
            parseHeaderExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            parseDoWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoWhileStatement>): import("@babel/types").DoWhileStatement;
            parseForStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").For>): import("@babel/types").For;
            parseFunctionStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionDeclaration>, isAsync: boolean, isHangingDeclaration: boolean): import("@babel/types").FunctionDeclaration;
            parseIfStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").IfStatement>): import("@babel/types").IfStatement;
            parseReturnStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ReturnStatement>): import("@babel/types").ReturnStatement;
            parseSwitchStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").SwitchStatement>): import("@babel/types").SwitchStatement;
            parseThrowStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ThrowStatement>): import("@babel/types").ThrowStatement;
            parseCatchClauseParam(this: import("./parser/index.ts").default): Exclude<ReturnType<typeof this.parseBindingAtom>, import("@babel/types").VoidPattern>;
            parseTryStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").TryStatement>): import("@babel/types").TryStatement;
            parseVarStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("@babel/types").VariableDeclaration;
            parseWhileStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WhileStatement>): import("@babel/types").WhileStatement;
            parseWithStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").WithStatement>): import("@babel/types").WithStatement;
            parseEmptyStatement(node: import("./parser/node.ts").Undone<import("@babel/types").EmptyStatement>): import("@babel/types").EmptyStatement;
            parseLabeledStatement(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").LabeledStatement>, maybeName: string, expr: import("@babel/types").Identifier, flags: import("./parser/statement.ts").ParseStatementFlag): import("@babel/types").LabeledStatement;
            isValidDirective(stmt: import("@babel/types").Statement): stmt is import("@babel/types").ExpressionStatement;
            parseBlockBody(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("./types.ts").BlockStatementLike>, allowDirectives: boolean | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseBlockOrModuleBlockBody(this: import("./parser/index.ts").default, body: import("@babel/types").Statement[], directives: import("@babel/types").Directive[] | undefined | null, topLevel: boolean, end: import("./tokenizer/types.ts").TokenType, afterBlockParse?: (hasStrictModeDirective: boolean) => void): void;
            parseFor(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForStatement>, init?: import("@babel/types").VariableDeclaration | import("@babel/types").Expression | null): import("@babel/types").ForStatement;
            parseForX(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ForXStatement>, init: import("@babel/types").VariableDeclaration | import("@babel/types").AssignmentPattern | import("@babel/types").Identifier | import("@babel/types").MemberExpression, awaitAt?: import("./util/location.ts").Position | null): import("@babel/types").ForXStatement;
            parseVar(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>, isFor: boolean, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): import("./parser/node.ts").Undone<import("@babel/types").VariableDeclaration>;
            parseVarId(this: import("./parser/index.ts").default, decl: import("./parser/node.ts").Undone<import("@babel/types").VariableDeclarator>, kind: "var" | "let" | "const" | "using" | "await using"): void;
            parseAsyncFunctionExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").FunctionExpression>): import("@babel/types").FunctionExpression;
            parseFunction<T extends import("./types.ts").NormalFunction>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, flags?: import("./parser/statement.ts").ParseFunctionFlag): T;
            parseFunctionParams(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isConstructor?: boolean): void;
            registerFunctionStatementId(node: import("./types.ts").NormalFunction): void;
            isClassProperty(): boolean;
            isClassMethod(): boolean;
            nameIsConstructor(key: import("@babel/types").Expression | import("@babel/types").PrivateName): boolean;
            isNonstaticConstructor(method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty>): boolean;
            parseClassBody(this: import("./parser/index.ts").default, hadSuperClass: boolean, oldStrict: boolean): import("@babel/types").ClassBody;
            parseClassMemberFromModifier(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): boolean;
            parseClassMember(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>, state: import("./types.ts").ParseClassMemberState): void;
            parseClassMemberWithIsStatic(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>, state: import("./types.ts").ParseClassMemberState, isStatic: boolean): void;
            parseClassElementName(this: import("./parser/index.ts").default, member: import("./parser/node.ts").Undone<import("./types.ts").ClassMember>): import("@babel/types").Expression | import("@babel/types").Identifier | import("@babel/types").PrivateName;
            parseClassStaticBlock(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, member: import("./parser/node.ts").Undone<import("@babel/types").StaticBlock & {
                decorators?: import("@babel/types").Decorator[];
            }>): void;
            pushClassProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty>): void;
            pushClassPrivateProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateProperty>): void;
            pushClassAccessorProperty(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, prop: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>, isPrivate: boolean): void;
            pushClassMethod(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowsDirectSuper: boolean): void;
            pushClassPrivateMethod(this: import("./parser/index.ts").default, classBody: import("./parser/node.ts").Undone<import("@babel/types").ClassBody>, method: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod>, isGenerator: boolean, isAsync: boolean): void;
            declareClassPrivateMethodInScope(node: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateMethod | import("@babel/types").TSDeclareMethod>, kind: number): void;
            parsePostMemberNameModifiers(methodOrProp: import("./parser/node.ts").Undone<import("@babel/types").ClassMethod | import("@babel/types").ClassProperty>): void;
            parseClassPrivateProperty(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassPrivateProperty>): import("@babel/types").ClassPrivateProperty;
            parseClassProperty(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty>): import("@babel/types").ClassProperty;
            parseClassAccessorProperty(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassAccessorProperty>): import("@babel/types").ClassAccessorProperty;
            parseInitializer(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ClassProperty | import("@babel/types").ClassPrivateProperty | import("@babel/types").ClassAccessorProperty>): void;
            parseClassId(node: import("./parser/node.ts").Undone<import("@babel/types").Class>, isStatement: boolean, optionalId?: boolean | null, bindingType?: import("./util/scopeflags.ts").BindingFlag): void;
            parseClassSuper(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Class>): void;
            eatExportStar(_: import("./parser/node.ts").Undone<import("./types.ts").Node>): _ is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>;
            maybeParseExportNamespaceSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportNamedSpecifiers(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): node is import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>;
            maybeParseExportDeclaration(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>): boolean;
            isAsyncFunction(): boolean;
            parseExportDefaultExpression(this: import("./parser/index.ts").default): import("@babel/types").ExportDefaultDeclaration["declaration"] | import("@babel/types").EnumDeclaration;
            parseExportDeclaration(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration>): import("@babel/types").ExportNamedDeclaration["declaration"] | undefined;
            parseExportFrom(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>, expect?: boolean): void;
            shouldParseExportDeclaration(): boolean;
            checkDeclaration(node: import("@babel/types").Identifier | import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").ObjectProperty): void;
            checkDuplicateExports(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier | import("@babel/types").StringLiteral | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportSpecifier | import("@babel/types").ExportDefaultSpecifier>, exportName: string): void;
            parseExportSpecifiers(isInTypeExport: boolean): import("@babel/types").ExportSpecifier[];
            parseExportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ExportSpecifier>, isString: boolean, isInTypeExport: boolean, isMaybeTypeOnly: boolean): import("@babel/types").ExportSpecifier;
            parseModuleExportName(): import("@babel/types").StringLiteral | import("@babel/types").Identifier;
            checkImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            isPotentialImportPhase(isExport: boolean): boolean;
            applyImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration>, isExport: boolean, phase: string | null, loc?: number): void;
            parseMaybeImportPhase(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").TSImportEqualsDeclaration>, isExport: boolean): import("@babel/types").Identifier | null;
            isPrecedingIdImportPhase(phase: string): boolean;
            parseImportSpecifiersAndAfter(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): import("@babel/types").ImportDeclaration;
            parseImportSourceAndAttributes(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): import("@babel/types").ImportDeclaration;
            parseImportSpecifierLocal<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, specifier: import("./parser/node.ts").Undone<T>, type: T["type"]): void;
            finishImportSpecifier<T extends import("@babel/types").ImportSpecifier | import("@babel/types").ImportDefaultSpecifier | import("@babel/types").ImportNamespaceSpecifier>(specifier: import("./parser/node.ts").Undone<T>, type: T["type"], bindingType?: import("./util/scopeflags.ts").BindingFlag): T;
            parseImportAttributes(): import("@babel/types").ImportAttribute[];
            maybeParseImportAttributes(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ExportAllDeclaration>): void;
            maybeParseDefaultImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>, maybeDefaultIdentifier: import("@babel/types").Identifier | null): boolean;
            maybeParseStarImportSpecifier(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): boolean;
            parseNamedImportSpecifiers(node: import("./parser/node.ts").Undone<import("@babel/types").ImportDeclaration>): void;
            parseImportSpecifier(specifier: import("./parser/node.ts").Undone<import("@babel/types").ImportSpecifier>, importedIsString: boolean, isInTypeOnlyImport: boolean, isMaybeTypeOnly: boolean, bindingType: import("./util/scopeflags.ts").BindingFlag | undefined): import("@babel/types").ImportSpecifier;
            isThisParam(param: import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty | import("@babel/types").RestElement): boolean;
            checkProto(prop: import("./types.ts").ObjectMember | import("@babel/types").SpreadElement, sawProto: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): boolean;
            shouldExitDescending(expr: import("@babel/types").Expression | import("@babel/types").PrivateName | import("@babel/types").Super | import("@babel/types").Import): expr is import("@babel/types").ArrowFunctionExpression;
            getExpression(this: import("./parser/index.ts").default): import("@babel/types").Expression & import("./types.ts").ParserOutput;
            parseExpression(this: import("./parser/index.ts").default, disallowIn?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExpressionBase(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseMaybeAssignDisallowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowIn(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            setOptionalParametersError(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            parseMaybeAssign(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssign(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeConditional(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseConditional(this: import("./parser/index.ts").default, expr: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseMaybeUnaryOrPrivate(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression | import("@babel/types").PrivateName;
            parseExprOps(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors): import("@babel/types").Expression;
            parseExprOp(this: import("./parser/index.ts").default, left: import("@babel/types").Expression | import("@babel/types").PrivateName, leftStartLoc: import("./util/location.ts").Position, minPrec: number): import("@babel/types").Expression;
            parseExprOpRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseExprOpBaseRightExpr(this: import("./parser/index.ts").default, op: import("./tokenizer/types.ts").TokenType, prec: number): import("@babel/types").Expression;
            parseHackPipeBody(this: import("./parser/index.ts").default): import("@babel/types").Expression;
            checkExponentialAfterUnary(node: import("@babel/types").AwaitExpression | import("./parser/node.ts").Undone<import("@babel/types").UnaryExpression>): void;
            parseMaybeUnary(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, sawUnary?: boolean): import("@babel/types").Expression;
            parseUpdate(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").UpdateExpression>, update: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseExprSubscripts(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: false | null): import("@babel/types").Expression;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls: true): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscripts(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls?: boolean | null): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseSubscript(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, noCalls: boolean | undefined | null, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            stopParseSubscript(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseMember(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, computed: boolean, optional: boolean): import("@babel/types").OptionalMemberExpression | import("@babel/types").MemberExpression;
            parseBind(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").Expression;
            parseCoverCallAndAsyncArrowHead(this: import("./parser/index.ts").default, base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState, optional: boolean): import("@babel/types").Expression;
            parseTaggedTemplateExpression(this: import("./parser/index.ts").default, base: import("@babel/types").Expression, startLoc: import("./util/location.ts").Position, state: import("./types.ts").ParseSubscriptState): import("@babel/types").TaggedTemplateExpression;
            atPossibleAsyncArrow(base: import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import): boolean;
            finishCallExpression<T extends import("@babel/types").CallExpression | import("@babel/types").OptionalCallExpression>(node: import("./parser/node.ts").Undone<T>, optional: boolean): T;
            parseCallExpressionArguments(this: import("./parser/index.ts").default, allowPlaceholder?: boolean, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): (import("@babel/types").Expression | import("@babel/types").SpreadElement)[];
            shouldParseAsyncArrow(): boolean;
            parseAsyncArrowFromCallExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, call: import("@babel/types").CallExpression): import("@babel/types").ArrowFunctionExpression;
            parseNoCallExpr(this: import("./parser/index.ts").default, onUnparenthesizedImportExpression: (base: import("@babel/types").ImportExpression) => void): import("@babel/types").Expression | import("@babel/types").Super | import("@babel/types").Import;
            parseTopicReferenceThenEqualsSign(topicTokenType: import("./tokenizer/types.ts").TokenType, topicTokenValue: string): import("@babel/types").Expression;
            parseTopicReference(pipeProposal: string): import("@babel/types").Expression;
            finishTopicReference(node: import("./parser/node.ts").Undone<import("@babel/types").TopicReference>, startLoc: import("./util/location.ts").Position, pipeProposal: string, tokenType: import("./tokenizer/types.ts").TokenType): import("@babel/types").TopicReference;
            testTopicReferenceConfiguration(pipeProposal: string, startLoc: import("./util/location.ts").Position, tokenType: import("./tokenizer/types.ts").TokenType): boolean;
            parseAsyncArrowUnaryFunction(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("@babel/types").ArrowFunctionExpression;
            parseDo(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").DoExpression>, isAsync: boolean): import("@babel/types").DoExpression;
            parseSuper(): import("@babel/types").Super;
            parsePrivateName(): import("@babel/types").PrivateName;
            parseFunctionOrFunctionSent(this: import("./parser/index.ts").default): import("@babel/types").FunctionExpression | import("@babel/types").MetaProperty;
            parseMetaProperty(node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty>, meta: import("@babel/types").Identifier, propertyName: string): import("@babel/types").MetaProperty;
            parseImportMetaPropertyOrPhaseCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").MetaProperty | import("@babel/types").ImportExpression>): import("@babel/types").MetaProperty | import("@babel/types").ImportExpression;
            parseLiteralAtNode<T extends import("./types.ts").Node>(value: any, type: T["type"], node: any): T;
            parseLiteral<T extends import("./types.ts").Node>(value: any, type: T["type"]): T;
            parseStringLiteral(value: any): import("@babel/types").StringLiteral;
            parseNumericLiteral(value: any): import("@babel/types").NumericLiteral;
            parseBigIntLiteral(value: any): import("@babel/types").BigIntLiteral;
            parseRegExpLiteral(value: {
                value: any;
                pattern: string;
                flags: import("@babel/types").RegExpLiteral["flags"];
            }): import("@babel/types").RegExpLiteral;
            parseBooleanLiteral(value: boolean): import("@babel/types").BooleanLiteral;
            parseNullLiteral(): import("@babel/types").NullLiteral;
            parseParenAndDistinguishExpression(this: import("./parser/index.ts").default, canStartArrow: boolean): import("@babel/types").Expression;
            wrapParenthesis(startLoc: import("./util/location.ts").Position, expression: import("@babel/types").Expression): import("@babel/types").Expression;
            shouldParseArrow(params: import("./types.ts").Node[]): boolean;
            parseArrow(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>): import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression> | undefined | null;
            parseParenItem<T extends import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").SpreadElement | import("./types.ts").TSTypeCastExpression>(node: T, startLoc: import("./util/location.ts").Position): T | import("@babel/types").TypeCastExpression | import("./types.ts").TSTypeCastExpression;
            parseNewOrNewTarget(this: import("./parser/index.ts").default): import("@babel/types").NewExpression | import("@babel/types").MetaProperty;
            parseNew(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").NewExpression>): import("@babel/types").NewExpression;
            parseNewCallee(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").NewExpression>): void;
            parseTemplateElement(isTagged: boolean): import("@babel/types").TemplateElement;
            parseTemplate(this: import("./parser/index.ts").default, isTagged: boolean): import("@babel/types").TemplateLiteral;
            parseTemplateSubstitution(this: import("./parser/index.ts").default): import("@babel/types").Expression | import("@babel/types").TSType;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: true, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectPattern;
            parseObjectLike(close: import("./tokenizer/types.ts").TokenType, isPattern: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectExpression;
            addTrailingCommaExtraToNode(node: import("./parser/node.ts").Undone<import("./types.ts").Node>): void;
            maybeAsyncOrAccessorProp(prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty | import("@babel/types").ObjectMethod>): prop is typeof prop & {
                key: import("@babel/types").Identifier;
            };
            parsePropertyDefinition(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("./types.ts").ObjectMember | import("@babel/types").SpreadElement;
            getGetterSetterExpectedParamCount(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): number;
            getObjectOrClassMethodParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): (import("@babel/types").TSParameterProperty | import("@babel/types").FunctionParameter)[] | import("@babel/types").FunctionParameter[];
            checkGetterSetterParams(method: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod>): void;
            parseObjectMethod(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectMethod>, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean): import("@babel/types").ObjectMethod | undefined | null;
            parseObjectProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>, startLoc: import("./util/location.ts").Position | undefined | null, isPattern: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ObjectProperty | undefined | null;
            finishObjectProperty(node: import("./parser/node.ts").Undone<import("@babel/types").ObjectProperty>): import("@babel/types").ObjectProperty;
            parseObjPropValue<T extends import("./types.ts").ObjectMember>(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<T>, startLoc: import("./util/location.ts").Position | undefined | null, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): T;
            parsePropertyName(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember> | import("@babel/types").TSPropertySignature | import("@babel/types").TSMethodSignature, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): void;
            initFunction(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, isAsync: boolean): void;
            parseMethod<T extends import("@babel/types").ObjectMethod | import("@babel/types").ClassMethod | import("@babel/types").ClassPrivateMethod>(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<T>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowDirectSuper: boolean, type: T["type"], inClassScope?: boolean): T;
            parseArrayLike(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").ArrayExpression;
            parseArrowExpression(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | null | undefined, isAsync: boolean, trailingCommaLoc?: import("./util/location.ts").Position | null): import("@babel/types").ArrowFunctionExpression;
            setArrowFunctionParameters(node: import("./parser/node.ts").Undone<import("@babel/types").ArrowFunctionExpression>, params: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[] | (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression)[], trailingCommaLoc?: import("./util/location.ts").Position | null): void;
            parseFunctionBodyAndFinish<T extends import("@babel/types").Function | import("@babel/types").TSDeclareMethod | import("@babel/types").TSDeclareFunction | import("@babel/types").ClassPrivateMethod>(node: import("./parser/node.ts").Undone<T>, type: T["type"], isMethod?: boolean): T;
            parseFunctionBody(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").Function>, allowExpression?: boolean | null, isMethod?: boolean): void;
            isSimpleParameter(node: import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty): boolean;
            isSimpleParamList(params: readonly (import("@babel/types").FunctionParameter | import("@babel/types").TSParameterProperty)[]): boolean;
            checkParams(node: import("./parser/node.ts").Undone<import("@babel/types").Function>, allowDuplicates: boolean, isArrowFunction?: boolean | null, strictModeChanged?: boolean): void;
            parseExprList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, nodeForExtra?: import("./parser/node.ts").Undone<import("./types.ts").Node> | null): (import("@babel/types").Expression | null)[];
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: boolean, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression | null;
            parseExprListItem(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, allowEmpty?: false, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null, allowPlaceholder?: boolean | null): import("@babel/types").Expression;
            createIdentifier(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string): import("@babel/types").Identifier;
            createIdentifierAt(node: import("./parser/node.ts").Undone<import("@babel/types").Identifier>, name: string, endLoc: import("./util/location.ts").Position): import("@babel/types").Identifier;
            parseIdentifierName(liberal?: boolean): string;
            recordAwaitIfAllowed(): boolean;
            parseAwait(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position, soloAwait?: boolean): import("@babel/types").AwaitExpression;
            isAmbiguousPrefixOrIdentifier(): boolean;
            parseYield(this: import("./parser/index.ts").default, startLoc: import("./util/location.ts").Position): import("@babel/types").YieldExpression;
            parseImportCall(this: import("./parser/index.ts").default, node: import("./parser/node.ts").Undone<import("@babel/types").ImportExpression>): import("@babel/types").ImportExpression;
            withTopicBindingContext<T>(callback: () => T): T;
            allowInAnd<T>(callback: () => T): T;
            disallowInAnd<T>(callback: () => T): T;
            registerTopicReference(): void;
            topicReferenceIsAllowedInCurrentContext(): boolean;
            topicReferenceWasUsedInCurrentContext(): boolean;
            parseFSharpPipelineBody(this: import("./parser/index.ts").default, prec: number): import("@babel/types").Expression;
            parseModuleExpression(this: import("./parser/index.ts").default): import("@babel/types").ModuleExpression;
            parseVoidPattern(this: import("./parser/index.ts").default, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").VoidPattern;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors: import("./parser/util.ts").ExpressionErrors | null | undefined, isParenItem: boolean | undefined): import("@babel/types").Expression | import("./types.ts").TSTypeCastExpression;
            parseMaybeAssignAllowInOrVoidPattern(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").Expression;
            parsePropertyNamePrefixOperator(prop: import("./parser/node.ts").Undone<import("./types.ts").ObjectOrClassMember | import("./types.ts").ClassMember>): void;
            toAssignableObjectExpressionProp(prop: import("./types.ts").Node, isLast: boolean, isLHS: boolean): void;
            toAssignableList(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[], trailingCommaLoc: import("./util/location.ts").Position | undefined | null, isLHS: boolean): void;
            toAssignableListItem(exprList: (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression)[], index: number, isLHS: boolean): void;
            isAssignable(node: import("./types.ts").Node, isBinding?: boolean): boolean;
            toReferencedList(exprList: readonly (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[] | readonly (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression | null)[], isParenthesizedExpr?: boolean): readonly (import("@babel/types").Expression | import("@babel/types").SpreadElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("@babel/types").ArgumentPlaceholder | import("./types.ts").TSTypeCastExpression | null)[] | readonly (import("@babel/types").Expression | import("@babel/types").RestElement | import("@babel/types").VoidPattern | import("@babel/types").AssignmentPattern | import("./types.ts").TSTypeCastExpression | null)[];
            parseSpread(this: import("./parser/index.ts").default, refExpressionErrors?: import("./parser/util.ts").ExpressionErrors | null): import("@babel/types").SpreadElement;
            parseRestBinding(this: import("./parser/index.ts").default): import("@babel/types").RestElement;
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.ALLOW_EMPTY): (import("@babel/types").Pattern | import("@babel/types").RestElement | null)[];
            parseBindingList(this: import("./parser/index.ts").default, close: import("./tokenizer/types.ts").TokenType, closeCharCode: typeof import("charcodes")[keyof typeof import("charcodes")], flags: import("./parser/lval.ts").ParseBindingListFlags.IS_FUNCTION_PARAMS): (import("@babel/types").Pattern | import("@babel/types").RestElement | import("@babel/types").TSParameterProperty)[];
            parseBindingRestProperty(this: import("./parser/index.ts").default, prop: import("./parser/node.ts").Undone<import("@babel/types").RestElement>): import("@babel/types").RestElement;
            parseBindingProperty(this: import("./parser/index.ts").default): import("./types.ts").AssignmentProperty | import("@babel/types").RestElement;
            parseBindingElement(this: import("./parser/index.ts").default, flags: import("./parser/lval.ts").ParseBindingListFlags, decorators: import("@babel/types").Decorator[]): import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").TSParameterProperty;
            parseFunctionParamType<T extends import("@babel/types").Pattern | import("@babel/types").Identifier | import("@babel/types").RestElement>(param: T): T;
            parseMaybeDefault<P extends import("@babel/types").Pattern | import("@babel/types").Identifier>(this: import("./parser/index.ts").default, startLoc?: import("./util/location.ts").Position | null, left?: P | null): P | import("@babel/types").AssignmentPattern;
            isOptionalMemberExpression(expression: import("./types.ts").Node): boolean;
            checkLVal(expression: import("@babel/types").Expression | import("./types.ts").ObjectMember | import("@babel/types").RestElement | import("@babel/types").Pattern | import("@babel/types").TSParameterProperty | import("./types.ts").TSTypeCastExpression, ancestor: import("./parse-error.ts").LValAncestor, binding?: import("./util/scopeflags.ts").BindingFlag, checkClashes?: Set<string> | false, strictModeChanged?: boolean, hasParenthesizedAncestor?: boolean, disallowCallExpression?: boolean): void;
            checkIdentifier(at: import("@babel/types").Identifier, bindingType: import("./util/scopeflags.ts").BindingFlag, strictModeChanged?: boolean): void;
            declareNameFromIdentifier(identifier: import("@babel/types").Identifier, binding: import("./util/scopeflags.ts").BindingFlag): void;
            checkToRestConversion(node: import("./types.ts").Node, allowPattern: boolean): void;
            checkCommaAfterRest(close: typeof import("charcodes")[keyof typeof import("charcodes")]): boolean;
            createPosition(loc: import("./util/location.ts").Position): import("./util/location.ts").Position;
            startNode<T extends import("./types.ts").Node = never>(): import("./parser/node.ts").Undone<T>;
            startNodeAt<T extends import("./types.ts").Node = never>(loc: import("./util/location.ts").Position): import("./parser/node.ts").Undone<T>;
            startNodeAtNode<T extends import("./types.ts").Node = never>(type: import("./parser/node.ts").Undone<import("./types.ts").Node>): import("./parser/node.ts").Undone<T>;
            finishNode<T extends import("./types.ts").Node>(node: import("./parser/node.ts").Undone<T>, type: T["type"]): T;
            finishNodeAt<T extends import("./types.ts").Node>(node: Omit<T, "type">, type: T["type"], endLoc: import("./util/location.ts").Position): T;
            finishNodeAtNode<T extends import("./types.ts").Node>(node: Omit<T, "type">, type: T["type"], endNode: import("./types.ts").Node): T;
            resetStartLocation(node: import("./types.ts").BaseNode, startLoc: import("./util/location.ts").Position): void;
            resetEndLocation(node: import("./types.ts").BaseNode, endLoc?: import("./util/location.ts").Position): void;
            resetStartLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            resetEndLocationFromNode(node: import("./types.ts").BaseNode, locationNode: import("./types.ts").BaseNode): void;
            castNodeTo<T extends import("./types.ts").Node["type"]>(node: import("./types.ts").Node, type: T): Extract<import("./types.ts").Node, {
                type: T;
            }>;
            addExtra(node: Partial<import("./types.ts").Node>, key: string, value: any, enumerable?: boolean): void;
            isContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            isUnparsedContextual(nameStart: number, name: string): boolean;
            isLookaheadContextual(name: string): boolean;
            eatContextual(token: import("./tokenizer/types.ts").TokenType): boolean;
            expectContextual(token: import("./tokenizer/types.ts").TokenType, toParseError?: import("./parse-error.ts").ParseErrorConstructor<any>): void;
            canInsertSemicolon(): boolean;
            hasPrecedingLineBreak(): boolean;
            hasFollowingLineBreak(): boolean;
            isLineTerminator(): boolean;
            semicolon(allowAsi?: boolean): void;
            expect(type: import("./tokenizer/types.ts").TokenType, loc?: import("./util/location.ts").Position | null): void;
            tryParse<T extends import("./types.ts").Node | readonly import("./types.ts").Node[] | null>(fn: (abort: (node?: T) => never) => T, oldState?: import("./tokenizer/state.ts").default): {
                node: T;
                error: null;
                thrown: false;
                aborted: false;
                failState: null;
            } | {
                node: T | null;
                error: import("./parse-error.ts").ParseError;
                thrown: boolean;
                aborted: false;
                failState: import("./tokenizer/state.ts").default;
            } | {
                node: T | null;
                error: null;
                thrown: false;
                aborted: true;
                failState: import("./tokenizer/state.ts").default;
            };
            checkExpressionErrors(refExpressionErrors: import("./parser/util.ts").ExpressionErrors | undefined | null, andThrow: boolean): boolean | undefined;
            isLiteralPropertyName(): boolean;
            isPrivateName(node: import("./types.ts").Node): node is import("@babel/types").PrivateName;
            getPrivateNameSV(node: import("@babel/types").PrivateName): string;
            hasPropertyAsPrivateName(node: import("./types.ts").Node): boolean;
            isObjectProperty(node: import("./types.ts").Node): node is import("@babel/types").ObjectProperty | import("./types.ts").EstreePropertyDefinition;
            isObjectMethod(node: import("./types.ts").Node): node is import("@babel/types").ObjectMethod;
            initializeScopes(this: import("./parser/index.ts").default, inModule?: boolean): () => void;
            enterInitialScopes(): void;
            checkDestructuringPrivate(refExpressionErrors: import("./parser/util.ts").ExpressionErrors): void;
            isLookahead: boolean;
            tokens: (import("./index.ts").Token | import("./types.ts").Comment)[];
            setLoc(loc: import("./util/location.ts").Position): void;
            getLoc(locIndex: number): import("./util/location.ts").Position;
            pushToken(token: import("./index.ts").Token | import("./types.ts").Comment): void;
            next(): void;
            eat(type: import("./tokenizer/types.ts").TokenType): boolean;
            match(type: import("./tokenizer/types.ts").TokenType): boolean;
            createLookaheadState(state: import("./tokenizer/state.ts").default): import("./tokenizer/state.ts").LookaheadState;
            lookahead(): import("./tokenizer/state.ts").LookaheadState;
            nextTokenStart(): number;
            nextTokenStartSince(pos: number): number;
            lookaheadCharCode(): number;
            lookaheadCharCodeSince(pos: number): number;
            nextTokenInLineStart(): number;
            nextTokenInLineStartSince(pos: number): number;
            lookaheadInLineCharCode(): number;
            codePointAtPos(pos: number): number;
            setStrict(strict: boolean): void;
            curContext(): import("./tokenizer/context.ts").TokContext;
            nextToken(): void;
            skipBlockComment(commentEnd: "*/" | "*-/"): import("./types.ts").CommentBlock | undefined;
            skipLineComment(startSkip: number): import("./types.ts").CommentLine | undefined;
            skipSpace(): void;
            finishToken(type: import("./tokenizer/types.ts").TokenType, val?: any): void;
            replaceToken(type: import("./tokenizer/types.ts").TokenType): void;
            readToken_numberSign(): void;
            readToken_dot(): void;
            readToken_slash(): void;
            readToken_interpreter(): boolean;
            readToken_mult_modulo(code: number): void;
            readToken_pipe_amp(code: number): void;
            readToken_caret(): void;
            readToken_atSign(): void;
            readToken_plus_min(code: number): void;
            readToken_lt(): void;
            readToken_gt(): void;
            readToken_eq_excl(code: number): void;
            readToken_question(): void;
            finishOp(type: import("./tokenizer/types.ts").TokenType, size: number): void;
            readRegexp(): void;
            readInt(radix: number, len?: number, forceLen?: boolean, allowNumSeparator?: boolean | "bail"): number | null;
            readRadixNumber(radix: number): void;
            readNumber(startsWithDot: boolean): void;
            readCodePoint(throwOnInvalid: boolean): number | null;
            readString(quote: number): void;
            readTemplateContinuation(): void;
            readTemplateToken(): void;
            recordStrictModeErrors(toParseError: import("./tokenizer/state.ts").DeferredStrictError, at: import("./util/location.ts").Position): void;
            readWord1(firstCode?: number): string;
            readWord(firstCode?: number): void;
            checkKeywordEscapes(): void;
            raise<ErrorDetails = object>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node> | number, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            raiseOverwrite<ErrorDetails>(toParseError: import("./parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: import("./util/location.ts").Position | import("./parser/node.ts").Undone<import("./types.ts").Node>, details?: ErrorDetails): import("./parse-error.ts").ParseError;
            updateContext(prevType?: import("./tokenizer/types.ts").TokenType): void;
            unexpected(loc?: import("./util/location.ts").Position | number | null, type?: import("./tokenizer/types.ts").TokenType): any;
            expectPlugin(pluginName: import("./typings.d.ts").Plugin, loc?: import("./util/location.ts").Position | number | null): true;
            expectOnePlugin(pluginNames: import("./typings.d.ts").Plugin[]): any;
            errorBuilder(error: import("./parse-error.ts").ParseErrorConstructor<object>): (pos: number, lineStart: number, curLine: number) => void;
            errorHandlers_readInt: import("@babel/helper-string-parser").IntErrorHandlers;
            errorHandlers_readCodePoint: import("@babel/helper-string-parser").CodePointErrorHandlers;
            errorHandlers_readStringContents_string: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            errorHandlers_readStringContents_template: import("@babel/helper-string-parser").StringContentsErrorHandlers;
            addComment(comment: import("./types.ts").Comment): void;
            processComment(node: import("./types.ts").Node): void;
            finalizeComment(commentWS: import("./parser/comments.ts").CommentWhitespace): void;
            finalizeRemainingComments(): void;
            resetPreviousNodeTrailingComments(node: import("./types.ts").Node): void;
            takeSurroundingComments(node: import("./types.ts").Node, start: number, end: number): void;
            options: import("./options.ts").Options;
            optionFlags: import("./options.ts").OptionFlags;
            inModule: boolean;
            scope: import("./util/scope.ts").default<any>;
            classScope: import("./util/class-scope.ts").default;
            prodParam: import("./util/production-parameter.ts").default;
            expressionScope: import("./util/expression-scope.ts").default;
            plugins: import("./parser/index.ts").PluginsMap;
            filename: string | undefined | null;
            startIndex: number;
            exportedIdentifiers: Set<string>;
            sawUnambiguousESM: boolean;
            ambiguousScriptDifferentAst: boolean;
            state: import("./tokenizer/state.ts").default;
            input: string;
            length: number;
            comments: import("./types.ts").Comment[];
            locData: Uint32Array;
            sourceToOffsetPos(sourcePos: number): number;
            offsetToSourcePos(offsetPos: number): number;
            hasPlugin(pluginConfig: PluginConfig): boolean;
            getPluginOption<PluginName extends import("./typings.d.ts").ParserPluginWithOptions[0], OptionName extends keyof import("./typings.d.ts").PluginOptions<PluginName>>(plugin: PluginName, name: OptionName): NonNullable<import("./typings.d.ts").PluginOptions<PluginName>>[OptionName] | undefined;
        };
    };
};
export declare const mixinPluginNames: readonly ("estree" | "jsx" | "flow" | "typescript" | "v8intrinsic" | "placeholders")[];
//# sourceMappingURL=plugin-utils.d.ts.map