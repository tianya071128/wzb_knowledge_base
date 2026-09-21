import { Position } from "./util/location.ts";
type SyntaxPlugin = "flow" | "typescript" | "jsx" | "functionBind" | "pipelineOperator" | "placeholders";
type ParseErrorCode = "BABEL_PARSER_SYNTAX_ERROR" | "BABEL_PARSER_SOURCETYPE_MODULE_REQUIRED";
export type ParseError = SyntaxError & {
    missingPlugin?: string | string[];
    loc: Position;
    pos: number;
} & ErrorInfo;
export type ParseErrorConstructor<ErrorDetails> = (loc: Position, pos: number, details: ErrorDetails) => ParseError;
type ToMessage<ErrorDetails> = (self: ErrorDetails) => string;
type ParseErrorTemplate = string | ToMessage<any> | {
    message: string | ToMessage<any>;
    code?: ParseErrorCode;
};
export type ParseErrorTemplates = Record<string, ParseErrorTemplate>;
export declare function ParseErrorEnum(a: TemplateStringsArray): <T extends ParseErrorTemplates>(parseErrorTemplates: T) => {
    [K in keyof T]: ParseErrorConstructor<T[K] extends {
        message: string | ToMessage<any>;
    } ? T[K]["message"] extends ToMessage<any> ? Parameters<T[K]["message"]>[0] : object : T[K] extends ToMessage<any> ? Parameters<T[K]>[0] : object>;
};
export declare function ParseErrorEnum<T extends ParseErrorTemplates>(parseErrorTemplates: T, syntaxPlugin?: SyntaxPlugin): {
    [K in keyof T]: ParseErrorConstructor<T[K] extends {
        message: string | ToMessage<any>;
    } ? T[K]["message"] extends ToMessage<any> ? Parameters<T[K]["message"]>[0] : object : T[K] extends ToMessage<any> ? Parameters<T[K]>[0] : object>;
};
import ModuleErrors from "./parse-error/module-errors.ts";
import StandardErrors from "./parse-error/standard-errors.ts";
import StrictModeErrors from "./parse-error/strict-mode-errors.ts";
import ParseExpressionErrors from "./parse-error/parse-expression-errors.ts";
import PipelineOperatorErrors from "./parse-error/pipeline-operator-errors.ts";
import FunctionBindErrors from "./parse-error/bind-operator-errors.ts";
import type { TSErrorTemplates } from "./plugins/typescript/index.ts";
import type { FlowErrorTemplates } from "./plugins/flow/index.ts";
import type { JsxErrorTemplates } from "./plugins/jsx/index.ts";
import type { PlaceholderErrorTemplates } from "./plugins/placeholders.ts";
export declare const Errors: {
    UnsupportedBind: ParseErrorConstructor<object>;
    UnsupportedBindRHS: ParseErrorConstructor<object>;
    PipeTopicRequiresHackPipes: ParseErrorConstructor<object>;
    PipeTopicUnbound: ParseErrorConstructor<object>;
    PipeTopicUnconfiguredToken: ParseErrorConstructor<{
        token: string;
    }>;
    PipeTopicUnused: ParseErrorConstructor<object>;
    PipeUnparenthesizedBody: ParseErrorConstructor<{
        type: import("./parse-error/pipeline-operator-errors.ts").UnparenthesizedPipeBodyTypes;
    }>;
    PipelineUnparenthesized: ParseErrorConstructor<object>;
    ParseExpressionEmptyInput: ParseErrorConstructor<object>;
    ParseExpressionExpectsEOF: ParseErrorConstructor<{
        unexpected: number;
    }>;
    StrictDelete: ParseErrorConstructor<object>;
    StrictEvalArguments: ParseErrorConstructor<{
        referenceName: string;
    }>;
    StrictEvalArgumentsBinding: ParseErrorConstructor<{
        bindingName: string;
    }>;
    StrictFunction: ParseErrorConstructor<object>;
    StrictNumericEscape: ParseErrorConstructor<object>;
    StrictOctalLiteral: ParseErrorConstructor<object>;
    StrictWith: ParseErrorConstructor<object>;
    AccessorIsGenerator: ParseErrorConstructor<{
        kind: "get" | "set";
    }>;
    ArgumentsInClass: ParseErrorConstructor<object>;
    AsyncFunctionInSingleStatementContext: ParseErrorConstructor<object>;
    AwaitBindingIdentifier: ParseErrorConstructor<object>;
    AwaitBindingIdentifierInStaticBlock: ParseErrorConstructor<object>;
    AwaitExpressionFormalParameter: ParseErrorConstructor<object>;
    AwaitUsingNotInAsyncContext: ParseErrorConstructor<object>;
    AwaitNotInAsyncContext: ParseErrorConstructor<object>;
    BadGetterArity: ParseErrorConstructor<object>;
    BadSetterArity: ParseErrorConstructor<object>;
    BadSetterRestParameter: ParseErrorConstructor<object>;
    ConstructorClassField: ParseErrorConstructor<object>;
    ConstructorClassPrivateField: ParseErrorConstructor<object>;
    ConstructorIsAccessor: ParseErrorConstructor<object>;
    ConstructorIsAsync: ParseErrorConstructor<object>;
    ConstructorIsGenerator: ParseErrorConstructor<object>;
    DeclarationMissingInitializer: ParseErrorConstructor<{
        kind: "await using" | "const" | "destructuring" | "using";
    }>;
    DecoratorArgumentsOutsideParentheses: ParseErrorConstructor<object>;
    DecoratorsBeforeAfterExport: ParseErrorConstructor<object>;
    DecoratorConstructor: ParseErrorConstructor<object>;
    DecoratorSemicolon: ParseErrorConstructor<object>;
    DecoratorStaticBlock: ParseErrorConstructor<object>;
    DeferImportRequiresNamespace: ParseErrorConstructor<object>;
    DeletePrivateField: ParseErrorConstructor<object>;
    DestructureNamedImport: ParseErrorConstructor<object>;
    DuplicateConstructor: ParseErrorConstructor<object>;
    DuplicateDefaultExport: ParseErrorConstructor<object>;
    DuplicateExport: ParseErrorConstructor<{
        exportName: string;
    }>;
    DuplicateProto: ParseErrorConstructor<object>;
    DuplicateRegExpFlags: ParseErrorConstructor<object>;
    ElementAfterRest: ParseErrorConstructor<object>;
    EscapedCharNotAnIdentifier: ParseErrorConstructor<object>;
    ExportBindingIsString: ParseErrorConstructor<{
        localName: string;
        exportName: string;
    }>;
    ExportDefaultFromAsIdentifier: ParseErrorConstructor<object>;
    ForInOfLoopInitializer: ParseErrorConstructor<{
        type: "ForInStatement" | "ForOfStatement";
    }>;
    ForInUsing: ParseErrorConstructor<object>;
    ForOfAsync: ParseErrorConstructor<object>;
    ForOfLet: ParseErrorConstructor<object>;
    GeneratorInSingleStatementContext: ParseErrorConstructor<object>;
    IllegalBreakContinue: ParseErrorConstructor<{
        type: "BreakStatement" | "ContinueStatement";
    }>;
    IllegalLanguageModeDirective: ParseErrorConstructor<object>;
    IllegalReturn: ParseErrorConstructor<object>;
    ImportBindingIsString: ParseErrorConstructor<{
        importName: string;
    }>;
    ImportCallArity: ParseErrorConstructor<{
        phase?: string | null;
    }>;
    ImportCallNotNewExpression: ParseErrorConstructor<{
        phase?: string | null;
    }>;
    ImportCallSpreadArgument: ParseErrorConstructor<{
        phase?: string | null;
    }>;
    IncompatibleRegExpUVFlags: ParseErrorConstructor<object>;
    InvalidBigIntLiteral: ParseErrorConstructor<object>;
    InvalidCodePoint: ParseErrorConstructor<object>;
    InvalidCoverDiscardElement: ParseErrorConstructor<object>;
    InvalidCoverInitializedName: ParseErrorConstructor<object>;
    InvalidDigit: ParseErrorConstructor<{
        radix: number;
    }>;
    InvalidEscapeSequence: ParseErrorConstructor<object>;
    InvalidEscapeSequenceTemplate: ParseErrorConstructor<object>;
    InvalidEscapedReservedWord: ParseErrorConstructor<{
        reservedWord: string;
    }>;
    InvalidIdentifier: ParseErrorConstructor<{
        identifierName: string;
    }>;
    InvalidLhs: ParseErrorConstructor<{
        ancestor: import("./parse-error.ts").LValAncestor;
    }>;
    InvalidLhsBinding: ParseErrorConstructor<{
        ancestor: import("./parse-error.ts").LValAncestor;
    }>;
    InvalidLhsOptionalChaining: ParseErrorConstructor<{
        ancestor: import("./parse-error.ts").LValAncestor;
    }>;
    InvalidNumber: ParseErrorConstructor<object>;
    InvalidOrMissingExponent: ParseErrorConstructor<object>;
    InvalidOrUnexpectedToken: ParseErrorConstructor<{
        unexpected: string;
    }>;
    InvalidParenthesizedAssignment: ParseErrorConstructor<object>;
    InvalidPrivateFieldResolution: ParseErrorConstructor<{
        identifierName: string;
    }>;
    InvalidPropertyBindingPattern: ParseErrorConstructor<object>;
    InvalidRestAssignmentPattern: ParseErrorConstructor<object>;
    LabelRedeclaration: ParseErrorConstructor<{
        labelName: string;
    }>;
    LetInLexicalBinding: ParseErrorConstructor<object>;
    LineTerminatorBeforeArrow: ParseErrorConstructor<object>;
    MalformedRegExpFlags: ParseErrorConstructor<object>;
    MissingClassName: ParseErrorConstructor<object>;
    MissingEqInAssignment: ParseErrorConstructor<object>;
    MissingSemicolon: ParseErrorConstructor<object>;
    MissingPlugin: ParseErrorConstructor<{
        missingPlugin: [string];
    }>;
    MissingOneOfPlugins: ParseErrorConstructor<{
        missingPlugin: string[];
    }>;
    MissingUnicodeEscape: ParseErrorConstructor<object>;
    MixingCoalesceWithLogical: ParseErrorConstructor<object>;
    ModuleAttributeInvalidValue: ParseErrorConstructor<object>;
    ModuleAttributesWithDuplicateKeys: ParseErrorConstructor<{
        key: string;
    }>;
    ModuleExportNameHasLoneSurrogate: ParseErrorConstructor<{
        surrogateCharCode: number;
    }>;
    ModuleExportUndefined: ParseErrorConstructor<{
        localName: string;
    }>;
    MultipleDefaultsInSwitch: ParseErrorConstructor<object>;
    NewlineAfterThrow: ParseErrorConstructor<object>;
    NoCatchOrFinally: ParseErrorConstructor<object>;
    NumberIdentifier: ParseErrorConstructor<object>;
    NumericSeparatorInEscapeSequence: ParseErrorConstructor<object>;
    ObsoleteAwaitStar: ParseErrorConstructor<object>;
    OptionalChainingNoNew: ParseErrorConstructor<object>;
    OptionalChainingNoTemplate: ParseErrorConstructor<object>;
    OverrideOnConstructor: ParseErrorConstructor<object>;
    ParamDupe: ParseErrorConstructor<object>;
    PatternHasAccessor: ParseErrorConstructor<object>;
    PatternHasMethod: ParseErrorConstructor<object>;
    PrivateInExpectedIn: ParseErrorConstructor<{
        identifierName: string;
    }>;
    PrivateNameRedeclaration: ParseErrorConstructor<{
        identifierName: string;
    }>;
    RestTrailingComma: ParseErrorConstructor<object>;
    SloppyFunction: ParseErrorConstructor<object>;
    SloppyFunctionAnnexB: ParseErrorConstructor<object>;
    SourcePhaseImportRequiresDefault: ParseErrorConstructor<object>;
    StaticPrototype: ParseErrorConstructor<object>;
    SuperCallNotNewExpression: ParseErrorConstructor<object>;
    SuperNotAllowed: ParseErrorConstructor<object>;
    SuperPrivateField: ParseErrorConstructor<object>;
    TrailingDecorator: ParseErrorConstructor<object>;
    UnexpectedArgumentPlaceholder: ParseErrorConstructor<object>;
    UnexpectedDigitAfterHash: ParseErrorConstructor<object>;
    UnexpectedImportExport: ParseErrorConstructor<object>;
    UnexpectedKeyword: ParseErrorConstructor<{
        keyword: string;
    }>;
    UnexpectedLeadingDecorator: ParseErrorConstructor<object>;
    UnexpectedLexicalDeclaration: ParseErrorConstructor<object>;
    UnexpectedNewTarget: ParseErrorConstructor<object>;
    UnexpectedNumericSeparator: ParseErrorConstructor<object>;
    UnexpectedPrivateField: ParseErrorConstructor<object>;
    UnexpectedReservedWord: ParseErrorConstructor<{
        reservedWord: string;
    }>;
    UnexpectedSuper: ParseErrorConstructor<object>;
    UnexpectedToken: ParseErrorConstructor<{
        expected?: string | null;
        unexpected?: string | null;
    }>;
    UnexpectedTokenUnaryExponentiation: ParseErrorConstructor<object>;
    UnexpectedUsingDeclaration: ParseErrorConstructor<object>;
    UnexpectedVoidPattern: ParseErrorConstructor<object>;
    UnsupportedDecoratorExport: ParseErrorConstructor<object>;
    UnsupportedDefaultExport: ParseErrorConstructor<object>;
    UnsupportedImport: ParseErrorConstructor<object>;
    UnsupportedMetaProperty: ParseErrorConstructor<{
        target: string;
        onlyValidPropertyName: string;
    }>;
    UnsupportedParameterDecorator: ParseErrorConstructor<object>;
    UnsupportedPropertyDecorator: ParseErrorConstructor<object>;
    UnsupportedSuper: ParseErrorConstructor<object>;
    UnterminatedComment: ParseErrorConstructor<object>;
    UnterminatedRegExp: ParseErrorConstructor<object>;
    UnterminatedString: ParseErrorConstructor<object>;
    UnterminatedTemplate: ParseErrorConstructor<object>;
    UsingDeclarationExport: ParseErrorConstructor<object>;
    UsingDeclarationHasBindingPattern: ParseErrorConstructor<object>;
    VarRedeclaration: ParseErrorConstructor<{
        identifierName: string;
    }>;
    VoidPatternCatchClauseParam: ParseErrorConstructor<object>;
    VoidPatternInitializer: ParseErrorConstructor<object>;
    YieldBindingIdentifier: ParseErrorConstructor<object>;
    YieldInParameter: ParseErrorConstructor<object>;
    YieldNotInGeneratorFunction: ParseErrorConstructor<object>;
    ZeroDigitNumericSeparator: ParseErrorConstructor<object>;
    ImportMetaOutsideModule: ParseErrorConstructor<object>;
    ImportOutsideModule: ParseErrorConstructor<object>;
};
type ErrorToObject<T> = {
    [K in keyof T]: {
        code: T[K] extends {
            code: string;
        } ? T[K]["code"] : "BABEL_PARSER_SYNTAX_ERROR";
        reasonCode: K;
        details: T[K] extends {
            message: string | ToMessage<any>;
        } ? T[K]["message"] extends ToMessage<any> ? Parameters<T[K]["message"]>[0] : object : T[K] extends ToMessage<any> ? Parameters<T[K]>[0] : object;
    };
};
type __ExtractMe = typeof ModuleErrors & typeof StandardErrors & typeof StrictModeErrors & typeof ParseExpressionErrors & typeof FunctionBindErrors & typeof PipelineOperatorErrors & typeof TSErrorTemplates & typeof FlowErrorTemplates & typeof JsxErrorTemplates & typeof PlaceholderErrorTemplates;
type __PatchMe = never & Decompress<ErrorInfoCompressed>;
type ErrorsObjects = ErrorToObject<__ExtractMe>;
type ErrorInfo = __PatchMe | ErrorsObjects[keyof ErrorsObjects];
type ErrorInfoCompressed = {};
type Decompress<T extends object> = {
    [K in keyof T]: T[K] extends [infer Param, infer Code] ? {
        code: Code;
        reasonCode: K;
        details: Param;
    } : T[K] extends [infer Param] ? {
        code: "BABEL_PARSER_SYNTAX_ERROR";
        reasonCode: K;
        details: Param;
    } : T[K] extends [] ? {
        code: "BABEL_PARSER_SYNTAX_ERROR";
        reasonCode: K;
        details: object;
    } : never;
};
export type { LValAncestor } from "./parse-error/standard-errors.ts";
//# sourceMappingURL=parse-error.d.ts.map