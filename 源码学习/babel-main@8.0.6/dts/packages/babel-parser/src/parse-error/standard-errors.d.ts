export type LValAncestor = {
    type: "UpdateExpression";
    prefix: boolean;
} | {
    type: "ArrayPattern" | "AssignmentExpression" | "CatchClause" | "ForOfStatement" | "FormalParameters" | "ForInStatement" | "ForStatement" | "ImportSpecifier" | "ImportNamespaceSpecifier" | "ImportDefaultSpecifier" | "ParenthesizedExpression" | "ObjectPattern" | "RestElement" | "VariableDeclarator";
};
declare const _default: {
    AccessorIsGenerator: ({ kind }: {
        kind: "get" | "set";
    }) => string;
    ArgumentsInClass: string;
    AsyncFunctionInSingleStatementContext: string;
    AwaitBindingIdentifier: string;
    AwaitBindingIdentifierInStaticBlock: string;
    AwaitExpressionFormalParameter: string;
    AwaitUsingNotInAsyncContext: string;
    AwaitNotInAsyncContext: string;
    BadGetterArity: string;
    BadSetterArity: string;
    BadSetterRestParameter: string;
    ConstructorClassField: string;
    ConstructorClassPrivateField: string;
    ConstructorIsAccessor: string;
    ConstructorIsAsync: string;
    ConstructorIsGenerator: string;
    DeclarationMissingInitializer: ({ kind, }: {
        kind: "await using" | "const" | "destructuring" | "using";
    }) => string;
    DecoratorArgumentsOutsideParentheses: string;
    DecoratorsBeforeAfterExport: string;
    DecoratorConstructor: string;
    DecoratorSemicolon: string;
    DecoratorStaticBlock: string;
    DeferImportRequiresNamespace: string;
    DeletePrivateField: string;
    DestructureNamedImport: string;
    DuplicateConstructor: string;
    DuplicateDefaultExport: string;
    DuplicateExport: ({ exportName }: {
        exportName: string;
    }) => string;
    DuplicateProto: string;
    DuplicateRegExpFlags: string;
    ElementAfterRest: string;
    EscapedCharNotAnIdentifier: string;
    ExportBindingIsString: ({ localName, exportName, }: {
        localName: string;
        exportName: string;
    }) => string;
    ExportDefaultFromAsIdentifier: string;
    ForInOfLoopInitializer: ({ type, }: {
        type: "ForInStatement" | "ForOfStatement";
    }) => string;
    ForInUsing: string;
    ForOfAsync: string;
    ForOfLet: string;
    GeneratorInSingleStatementContext: string;
    IllegalBreakContinue: ({ type, }: {
        type: "BreakStatement" | "ContinueStatement";
    }) => string;
    IllegalLanguageModeDirective: string;
    IllegalReturn: string;
    ImportBindingIsString: ({ importName }: {
        importName: string;
    }) => string;
    ImportCallArity: ({ phase }: {
        phase?: string | null;
    }) => string;
    ImportCallNotNewExpression: ({ phase }: {
        phase?: string | null;
    }) => string;
    ImportCallSpreadArgument: ({ phase }: {
        phase?: string | null;
    }) => string;
    IncompatibleRegExpUVFlags: string;
    InvalidBigIntLiteral: string;
    InvalidCodePoint: string;
    InvalidCoverDiscardElement: string;
    InvalidCoverInitializedName: string;
    InvalidDigit: ({ radix }: {
        radix: number;
    }) => string;
    InvalidEscapeSequence: string;
    InvalidEscapeSequenceTemplate: string;
    InvalidEscapedReservedWord: ({ reservedWord }: {
        reservedWord: string;
    }) => string;
    InvalidIdentifier: ({ identifierName }: {
        identifierName: string;
    }) => string;
    InvalidLhs: ({ ancestor }: {
        ancestor: LValAncestor;
    }) => string;
    InvalidLhsBinding: ({ ancestor }: {
        ancestor: LValAncestor;
    }) => string;
    InvalidLhsOptionalChaining: ({ ancestor }: {
        ancestor: LValAncestor;
    }) => string;
    InvalidNumber: string;
    InvalidOrMissingExponent: string;
    InvalidOrUnexpectedToken: ({ unexpected }: {
        unexpected: string;
    }) => string;
    InvalidParenthesizedAssignment: string;
    InvalidPrivateFieldResolution: ({ identifierName, }: {
        identifierName: string;
    }) => string;
    InvalidPropertyBindingPattern: string;
    InvalidRestAssignmentPattern: string;
    LabelRedeclaration: ({ labelName }: {
        labelName: string;
    }) => string;
    LetInLexicalBinding: string;
    LineTerminatorBeforeArrow: string;
    MalformedRegExpFlags: string;
    MissingClassName: string;
    MissingEqInAssignment: string;
    MissingSemicolon: string;
    MissingPlugin: ({ missingPlugin }: {
        missingPlugin: [string];
    }) => string;
    MissingOneOfPlugins: ({ missingPlugin }: {
        missingPlugin: string[];
    }) => string;
    MissingUnicodeEscape: string;
    MixingCoalesceWithLogical: string;
    ModuleAttributeInvalidValue: string;
    ModuleAttributesWithDuplicateKeys: ({ key }: {
        key: string;
    }) => string;
    ModuleExportNameHasLoneSurrogate: ({ surrogateCharCode, }: {
        surrogateCharCode: number;
    }) => string;
    ModuleExportUndefined: ({ localName }: {
        localName: string;
    }) => string;
    MultipleDefaultsInSwitch: string;
    NewlineAfterThrow: string;
    NoCatchOrFinally: string;
    NumberIdentifier: string;
    NumericSeparatorInEscapeSequence: string;
    ObsoleteAwaitStar: string;
    OptionalChainingNoNew: string;
    OptionalChainingNoTemplate: string;
    OverrideOnConstructor: string;
    ParamDupe: string;
    PatternHasAccessor: string;
    PatternHasMethod: string;
    PrivateInExpectedIn: ({ identifierName }: {
        identifierName: string;
    }) => string;
    PrivateNameRedeclaration: ({ identifierName }: {
        identifierName: string;
    }) => string;
    RestTrailingComma: string;
    SloppyFunction: string;
    SloppyFunctionAnnexB: string;
    SourcePhaseImportRequiresDefault: string;
    StaticPrototype: string;
    SuperCallNotNewExpression: string;
    SuperNotAllowed: string;
    SuperPrivateField: string;
    TrailingDecorator: string;
    UnexpectedArgumentPlaceholder: string;
    UnexpectedDigitAfterHash: string;
    UnexpectedImportExport: string;
    UnexpectedKeyword: ({ keyword }: {
        keyword: string;
    }) => string;
    UnexpectedLeadingDecorator: string;
    UnexpectedLexicalDeclaration: string;
    UnexpectedNewTarget: string;
    UnexpectedNumericSeparator: string;
    UnexpectedPrivateField: string;
    UnexpectedReservedWord: ({ reservedWord }: {
        reservedWord: string;
    }) => string;
    UnexpectedSuper: string;
    UnexpectedToken: ({ expected, unexpected, }: {
        expected?: string | null;
        unexpected?: string | null;
    }) => string;
    UnexpectedTokenUnaryExponentiation: string;
    UnexpectedUsingDeclaration: string;
    UnexpectedVoidPattern: string;
    UnsupportedDecoratorExport: string;
    UnsupportedDefaultExport: string;
    UnsupportedImport: string;
    UnsupportedMetaProperty: ({ target, onlyValidPropertyName, }: {
        target: string;
        onlyValidPropertyName: string;
    }) => string;
    UnsupportedParameterDecorator: string;
    UnsupportedPropertyDecorator: string;
    UnsupportedSuper: string;
    UnterminatedComment: string;
    UnterminatedRegExp: string;
    UnterminatedString: string;
    UnterminatedTemplate: string;
    UsingDeclarationExport: string;
    UsingDeclarationHasBindingPattern: string;
    VarRedeclaration: ({ identifierName }: {
        identifierName: string;
    }) => string;
    VoidPatternCatchClauseParam: string;
    VoidPatternInitializer: string;
    YieldBindingIdentifier: string;
    YieldInParameter: string;
    YieldNotInGeneratorFunction: string;
    ZeroDigitNumericSeparator: string;
};
export default _default;
//# sourceMappingURL=standard-errors.d.ts.map