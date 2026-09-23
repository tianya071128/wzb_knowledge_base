import type State from "../../tokenizer/state.ts";
import { type TokenType } from "../../tokenizer/types.ts";
import type * as N from "../../types.ts";
import type { Position } from "../../util/location.ts";
import type Parser from "../../parser/index.ts";
import { BindingFlag } from "../../util/scopeflags.ts";
import TypeScriptScopeHandler from "./scope.ts";
import * as charCodes from "charcodes";
import type { ExpressionErrors } from "../../parser/util.ts";
import { ParseStatementFlag } from "../../parser/statement.ts";
import type { Undone } from "../../parser/node.ts";
import type { ClassWithMixin, IJSXParserMixin } from "../jsx/index.ts";
import { ParseBindingListFlags } from "../../parser/lval.ts";
import { OptionFlags } from "../../options.ts";
type TsModifier = "readonly" | "abstract" | "declare" | "static" | "override" | "const" | N.Accessibility | N.VarianceAnnotations;
type ParsingContext = "EnumMembers" | "HeritageClauseElement" | "TupleElementTypes" | "TypeMembers" | "TypeParametersOrArguments";
type ModifierBase = {
    accessibility?: N.Accessibility;
} & Partial<Record<TsModifier, boolean | undefined | null>>;
export declare const TSErrorTemplates: {
    AbstractMethodHasImplementation: ({ methodName }: {
        methodName: string;
    }) => string;
    AbstractPropertyHasInitializer: ({ propertyName, }: {
        propertyName: string;
    }) => string;
    AccessorCannotBeOptional: string;
    AccessorCannotDeclareThisParameter: string;
    AccessorCannotHaveTypeParameters: string;
    ClassMethodHasDeclare: string;
    ClassMethodHasReadonly: string;
    ConstInitializerMustBeStringOrNumericLiteralOrLiteralEnumReference: string;
    ConstructorHasTypeParameters: string;
    DeclaratorDefiniteAssertionRequiresTypeAnnotation: string;
    DeclaratorDefiniteAssertionWithInitializer: string;
    DeclareAccessor: ({ kind }: {
        kind: "get" | "set";
    }) => string;
    DeclareClassFieldHasInitializer: string;
    DeclareFunctionHasImplementation: string;
    DecoratorAbstractMethod: ({ kind, }: {
        kind: "abstract method" | "abstract field" | "declare field";
    }) => string;
    DuplicateAccessibilityModifier: ({ modifier, }: {
        modifier: N.Accessibility;
    }) => string;
    DuplicateModifier: ({ modifier }: {
        modifier: TsModifier;
    }) => string;
    EmptyHeritageClauseType: ({ token }: {
        token: "extends" | "implements";
    }) => string;
    EmptyNamespaceName: string;
    EmptyTypeArguments: string;
    EmptyTypeParameters: string;
    ExpectedAmbientAfterExportDeclare: string;
    ExportAssignmentInTSNamespace: string;
    ExportInTSNamespace: string;
    ImportAliasHasImportType: string;
    ImportInTSNamespace: string;
    IncompatibleModifiers: ({ modifiers, }: {
        modifiers: [TsModifier, TsModifier];
    }) => string;
    IndexSignatureHasAbstract: string;
    IndexSignatureHasAccessibility: ({ modifier, }: {
        modifier: N.Accessibility;
    }) => string;
    IndexSignatureHasDeclare: string;
    IndexSignatureHasOverride: string;
    IndexSignatureHasStatic: string;
    InitializerNotAllowedInAmbientContext: string;
    InlineModuleDeclarationMustUseString: string;
    InvalidHeritageClauseType: ({ token }: {
        token: "extends" | "implements";
    }) => string;
    InvalidModifierOnAwaitUsingDeclaration: (modifier: TsModifier) => string;
    InvalidModifierOnTypeMember: ({ modifier }: {
        modifier: TsModifier;
    }) => string;
    InvalidModifierOnTypeParameter: ({ modifier }: {
        modifier: TsModifier;
    }) => string;
    InvalidModifierOnTypeParameterPositions: ({ modifier, }: {
        modifier: TsModifier;
    }) => string;
    InvalidModifierOnUsingDeclaration: (modifier: TsModifier) => string;
    InvalidModifiersOrder: ({ orderedModifiers, }: {
        orderedModifiers: [TsModifier, TsModifier];
    }) => string;
    InvalidNamespaceName: (value: string | number) => string;
    InvalidPropertyAccessAfterInstantiationExpression: string;
    InvalidTupleMemberLabel: string;
    MissingInterfaceName: string;
    NamespaceExportInTSNamespace: string;
    NonAbstractClassHasAbstractMethod: string;
    NonClassMethodPropertyHasAbstractModifier: string;
    OptionalTypeBeforeRequired: string;
    OverrideNotInSubClass: string;
    PatternIsOptional: string;
    PrivateElementHasAbstract: string;
    PrivateElementHasAccessibility: ({ modifier, }: {
        modifier: N.Accessibility;
    }) => string;
    ReadonlyForMethodSignature: string;
    ReservedArrowTypeParam: string;
    ReservedTypeAssertion: string;
    SetAccessorCannotHaveOptionalParameter: string;
    SetAccessorCannotHaveRestParameter: string;
    SetAccessorCannotHaveReturnType: string;
    SingleTypeParameterWithoutTrailingComma: ({ typeParameterName, }: {
        typeParameterName: string;
    }) => string;
    StaticBlockCannotHaveModifier: string;
    TupleOptionalAfterType: string;
    TypeAnnotationAfterAssign: string;
    TypeImportCannotSpecifyDefaultAndNamed: string;
    TypeModifierIsUsedInTypeExports: string;
    TypeModifierIsUsedInTypeImports: string;
    UnexpectedParameterInitializer: string;
    UnexpectedParameterModifier: string;
    UnexpectedReadonly: string;
    UnexpectedTypeAnnotation: string;
    UnexpectedTypeCastInParameter: string;
    UnexpectedTypeDeclaration: (type: "interface" | "type") => string;
    UnsupportedImportTypeArgument: string;
    UnsupportedParameterPropertyKind: string;
    UnsupportedSignatureParameterKind: ({ type }: {
        type: string;
    }) => string;
    UsingDeclarationInAmbientContext: (kind: "using" | "await using") => string;
};
declare const TSErrors: {
    AbstractMethodHasImplementation: import("../../parse-error.ts").ParseErrorConstructor<{
        methodName: string;
    }>;
    AbstractPropertyHasInitializer: import("../../parse-error.ts").ParseErrorConstructor<{
        propertyName: string;
    }>;
    AccessorCannotBeOptional: import("../../parse-error.ts").ParseErrorConstructor<object>;
    AccessorCannotDeclareThisParameter: import("../../parse-error.ts").ParseErrorConstructor<object>;
    AccessorCannotHaveTypeParameters: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ClassMethodHasDeclare: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ClassMethodHasReadonly: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ConstInitializerMustBeStringOrNumericLiteralOrLiteralEnumReference: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ConstructorHasTypeParameters: import("../../parse-error.ts").ParseErrorConstructor<object>;
    DeclaratorDefiniteAssertionRequiresTypeAnnotation: import("../../parse-error.ts").ParseErrorConstructor<object>;
    DeclaratorDefiniteAssertionWithInitializer: import("../../parse-error.ts").ParseErrorConstructor<object>;
    DeclareAccessor: import("../../parse-error.ts").ParseErrorConstructor<{
        kind: "get" | "set";
    }>;
    DeclareClassFieldHasInitializer: import("../../parse-error.ts").ParseErrorConstructor<object>;
    DeclareFunctionHasImplementation: import("../../parse-error.ts").ParseErrorConstructor<object>;
    DecoratorAbstractMethod: import("../../parse-error.ts").ParseErrorConstructor<{
        kind: "abstract method" | "abstract field" | "declare field";
    }>;
    DuplicateAccessibilityModifier: import("../../parse-error.ts").ParseErrorConstructor<{
        modifier: N.Accessibility;
    }>;
    DuplicateModifier: import("../../parse-error.ts").ParseErrorConstructor<{
        modifier: TsModifier;
    }>;
    EmptyHeritageClauseType: import("../../parse-error.ts").ParseErrorConstructor<{
        token: "extends" | "implements";
    }>;
    EmptyNamespaceName: import("../../parse-error.ts").ParseErrorConstructor<object>;
    EmptyTypeArguments: import("../../parse-error.ts").ParseErrorConstructor<object>;
    EmptyTypeParameters: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ExpectedAmbientAfterExportDeclare: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ExportAssignmentInTSNamespace: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ExportInTSNamespace: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ImportAliasHasImportType: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ImportInTSNamespace: import("../../parse-error.ts").ParseErrorConstructor<object>;
    IncompatibleModifiers: import("../../parse-error.ts").ParseErrorConstructor<{
        modifiers: [TsModifier, TsModifier];
    }>;
    IndexSignatureHasAbstract: import("../../parse-error.ts").ParseErrorConstructor<object>;
    IndexSignatureHasAccessibility: import("../../parse-error.ts").ParseErrorConstructor<{
        modifier: N.Accessibility;
    }>;
    IndexSignatureHasDeclare: import("../../parse-error.ts").ParseErrorConstructor<object>;
    IndexSignatureHasOverride: import("../../parse-error.ts").ParseErrorConstructor<object>;
    IndexSignatureHasStatic: import("../../parse-error.ts").ParseErrorConstructor<object>;
    InitializerNotAllowedInAmbientContext: import("../../parse-error.ts").ParseErrorConstructor<object>;
    InlineModuleDeclarationMustUseString: import("../../parse-error.ts").ParseErrorConstructor<object>;
    InvalidHeritageClauseType: import("../../parse-error.ts").ParseErrorConstructor<{
        token: "extends" | "implements";
    }>;
    InvalidModifierOnAwaitUsingDeclaration: import("../../parse-error.ts").ParseErrorConstructor<TsModifier>;
    InvalidModifierOnTypeMember: import("../../parse-error.ts").ParseErrorConstructor<{
        modifier: TsModifier;
    }>;
    InvalidModifierOnTypeParameter: import("../../parse-error.ts").ParseErrorConstructor<{
        modifier: TsModifier;
    }>;
    InvalidModifierOnTypeParameterPositions: import("../../parse-error.ts").ParseErrorConstructor<{
        modifier: TsModifier;
    }>;
    InvalidModifierOnUsingDeclaration: import("../../parse-error.ts").ParseErrorConstructor<TsModifier>;
    InvalidModifiersOrder: import("../../parse-error.ts").ParseErrorConstructor<{
        orderedModifiers: [TsModifier, TsModifier];
    }>;
    InvalidNamespaceName: import("../../parse-error.ts").ParseErrorConstructor<string | number>;
    InvalidPropertyAccessAfterInstantiationExpression: import("../../parse-error.ts").ParseErrorConstructor<object>;
    InvalidTupleMemberLabel: import("../../parse-error.ts").ParseErrorConstructor<object>;
    MissingInterfaceName: import("../../parse-error.ts").ParseErrorConstructor<object>;
    NamespaceExportInTSNamespace: import("../../parse-error.ts").ParseErrorConstructor<object>;
    NonAbstractClassHasAbstractMethod: import("../../parse-error.ts").ParseErrorConstructor<object>;
    NonClassMethodPropertyHasAbstractModifier: import("../../parse-error.ts").ParseErrorConstructor<object>;
    OptionalTypeBeforeRequired: import("../../parse-error.ts").ParseErrorConstructor<object>;
    OverrideNotInSubClass: import("../../parse-error.ts").ParseErrorConstructor<object>;
    PatternIsOptional: import("../../parse-error.ts").ParseErrorConstructor<object>;
    PrivateElementHasAbstract: import("../../parse-error.ts").ParseErrorConstructor<object>;
    PrivateElementHasAccessibility: import("../../parse-error.ts").ParseErrorConstructor<{
        modifier: N.Accessibility;
    }>;
    ReadonlyForMethodSignature: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ReservedArrowTypeParam: import("../../parse-error.ts").ParseErrorConstructor<object>;
    ReservedTypeAssertion: import("../../parse-error.ts").ParseErrorConstructor<object>;
    SetAccessorCannotHaveOptionalParameter: import("../../parse-error.ts").ParseErrorConstructor<object>;
    SetAccessorCannotHaveRestParameter: import("../../parse-error.ts").ParseErrorConstructor<object>;
    SetAccessorCannotHaveReturnType: import("../../parse-error.ts").ParseErrorConstructor<object>;
    SingleTypeParameterWithoutTrailingComma: import("../../parse-error.ts").ParseErrorConstructor<{
        typeParameterName: string;
    }>;
    StaticBlockCannotHaveModifier: import("../../parse-error.ts").ParseErrorConstructor<object>;
    TupleOptionalAfterType: import("../../parse-error.ts").ParseErrorConstructor<object>;
    TypeAnnotationAfterAssign: import("../../parse-error.ts").ParseErrorConstructor<object>;
    TypeImportCannotSpecifyDefaultAndNamed: import("../../parse-error.ts").ParseErrorConstructor<object>;
    TypeModifierIsUsedInTypeExports: import("../../parse-error.ts").ParseErrorConstructor<object>;
    TypeModifierIsUsedInTypeImports: import("../../parse-error.ts").ParseErrorConstructor<object>;
    UnexpectedParameterInitializer: import("../../parse-error.ts").ParseErrorConstructor<object>;
    UnexpectedParameterModifier: import("../../parse-error.ts").ParseErrorConstructor<object>;
    UnexpectedReadonly: import("../../parse-error.ts").ParseErrorConstructor<object>;
    UnexpectedTypeAnnotation: import("../../parse-error.ts").ParseErrorConstructor<object>;
    UnexpectedTypeCastInParameter: import("../../parse-error.ts").ParseErrorConstructor<object>;
    UnexpectedTypeDeclaration: import("../../parse-error.ts").ParseErrorConstructor<"type" | "interface">;
    UnsupportedImportTypeArgument: import("../../parse-error.ts").ParseErrorConstructor<object>;
    UnsupportedParameterPropertyKind: import("../../parse-error.ts").ParseErrorConstructor<object>;
    UnsupportedSignatureParameterKind: import("../../parse-error.ts").ParseErrorConstructor<{
        type: string;
    }>;
    UsingDeclarationInAmbientContext: import("../../parse-error.ts").ParseErrorConstructor<"await using" | "using">;
};
export declare const enum tsParseEntityNameFlags {
    NONE = 0,
    ALLOW_RESERVED_WORDS = 1,
    LEADING_THIS_AS_IDENTIFIER = 2
}
declare const _default: (superClass: ClassWithMixin<typeof Parser, IJSXParserMixin>) => {
    new (options: Partial<import("../../options.ts").Options> | null | undefined, input: string, pluginsMap: import("../../parser/index.ts").PluginsMap): {
        scope: TypeScriptScopeHandler;
        getScopeHandler(): new (...args: any) => TypeScriptScopeHandler;
        tsIsIdentifier(): boolean;
        tsTokenCanFollowModifier(): boolean;
        tsNextTokenOnSameLineAndCanFollowModifier(): boolean;
        tsNextTokenCanFollowModifier(): boolean;
        /** Parses a modifier matching one the given modifier names. */
        tsParseModifier<T extends TsModifier>(modifiers: Map<T, boolean>, stopOnStartOfClassStaticBlock?: boolean, hasSeenStaticModifier?: boolean | null): T | undefined | null;
        /** Parses a list of modifiers, in any order.
         *  If you need a specific order, you must call this function multiple times:
         *    this.tsParseModifiers({ modified: node, allowedModifiers: ["public"] });
         *    this.tsParseModifiers({ modified: node, allowedModifiers: ["abstract", "readonly"] });
         */
        tsParseModifiers<N extends ModifierBase>(modifiers: Map<TsModifier, boolean>, errorTemplate: typeof TSErrors.InvalidModifierOnTypeMember | undefined, modified: N, stopOnStartOfClassStaticBlock?: boolean): void;
        tsIsListTerminator(kind: ParsingContext): boolean;
        tsParseList<T extends N.Node>(kind: ParsingContext, parseElement: () => T): T[];
        tsParseDelimitedList<T extends N.Node>(kind: ParsingContext, parseElement: () => T, refTrailingCommaPos?: {
            value: number;
        }): T[];
        /**
         * If !expectSuccess, returns undefined instead of failing to parse.
         * If expectSuccess, parseElement should always return a defined value.
         */
        tsParseDelimitedListWorker<T extends N.Node>(kind: ParsingContext, parseElement: () => T | undefined, expectSuccess: boolean, refTrailingCommaPos?: {
            value: number;
        }): T[] | undefined;
        tsParseBracketedList<T extends N.Node>(kind: ParsingContext, parseElement: () => T, bracket: boolean, skipFirstToken: boolean, refTrailingCommaPos?: {
            value: number;
        }): T[];
        tsParseImportType(): N.TSImportType;
        tsParseImportTypeOptions(): N.ObjectExpression;
        tsParseImportTypeWithPropertyValue(): N.ObjectExpression;
        tsParseEntityName(flags: tsParseEntityNameFlags): N.TSEntityName;
        tsParseTypeReference(): N.TSTypeReference;
        tsParseThisTypePredicate(lhs: N.TSThisType): N.TSTypePredicate;
        tsParseThisTypeNode(): N.TSThisType;
        tsParseTypeQuery(): N.TSTypeQuery;
        tsParseInOutModifiers: (modified: ModifierBase, stopOnStartOfClassStaticBlock?: boolean | undefined) => void;
        tsParseConstModifier: (modified: ModifierBase, stopOnStartOfClassStaticBlock?: boolean | undefined) => void;
        tsParseInOutConstModifiers: (modified: ModifierBase, stopOnStartOfClassStaticBlock?: boolean | undefined) => void;
        tsParseTypeParameter(parseModifiers: (node: Undone<N.TSTypeParameter>) => void): N.TSTypeParameter;
        tsTryParseTypeParameters(parseModifiers: (node: Undone<N.TSTypeParameter>) => void): N.TSTypeParameterDeclaration | undefined | null;
        tsParseTypeParameters(parseModifiers: (node: Undone<N.TSTypeParameter>) => void): N.TSTypeParameterDeclaration;
        tsFillSignature(returnToken: TokenType, signature: Undone<N.TSSignatureDeclaration>): void;
        tsParseBindingListForSignature(): (N.Identifier | N.RestElement | N.ObjectPattern | N.ArrayPattern | N.VoidPattern)[];
        tsParseTypeMemberSemicolon(): void;
        tsParseSignatureMember(kind: "TSCallSignatureDeclaration" | "TSConstructSignatureDeclaration", node: Undone<N.TSCallSignatureDeclaration | N.TSConstructSignatureDeclaration>): N.TSCallSignatureDeclaration | N.TSConstructSignatureDeclaration;
        tsIsUnambiguouslyIndexSignature(): boolean;
        tsTryParseIndexSignature(node: Undone<N.TSIndexSignature>): N.TSIndexSignature | undefined;
        tsParsePropertyOrMethodSignature(node: Undone<N.TSPropertySignature | N.TSMethodSignature>, readonly: boolean): N.TSPropertySignature | N.TSMethodSignature;
        tsParseTypeMember(): N.TSTypeElement;
        tsParseTypeLiteral(): N.TSTypeLiteral;
        tsParseObjectTypeMembers(): N.TSTypeElement[];
        tsIsStartOfMappedType(): boolean;
        tsParseMappedType(): N.TSMappedType;
        tsParseTupleType(): N.TSTupleType;
        tsParseTupleElementType(): N.TSNamedTupleMember | N.TSType;
        tsParseParenthesizedType(): N.TSParenthesizedType;
        tsParseFunctionOrConstructorType(type: "TSFunctionType" | "TSConstructorType", abstract?: boolean): N.TSFunctionType | N.TSConstructorType;
        tsParseLiteralTypeNode(): N.TSLiteralType;
        tsParseTemplateLiteralType(): N.TSTemplateLiteralType | N.TSLiteralType;
        parseTemplateSubstitution(): N.TSType | N.Expression;
        tsParseThisTypeOrThisTypePredicate(): N.TSThisType | N.TSTypePredicate;
        tsParseNonArrayType(): N.TSType;
        tsParseArrayTypeOrHigher(): N.TSType;
        tsParseTypeOperator(): N.TSTypeOperator;
        tsCheckTypeAnnotationForReadOnly(node: Undone<N.TSTypeOperator>): void;
        tsParseInferType(): N.TSInferType;
        tsParseConstraintForInferType(): N.TSType | undefined;
        tsParseTypeOperatorOrHigher(): N.TSType;
        tsParseUnionOrIntersectionType(kind: "TSUnionType" | "TSIntersectionType", parseConstituentType: () => N.TSType, operator: TokenType): N.TSType;
        tsParseIntersectionTypeOrHigher(): N.TSType;
        tsParseUnionTypeOrHigher(): N.TSType;
        tsIsStartOfFunctionType(): boolean;
        tsSkipParameterStart(): boolean;
        tsIsUnambiguouslyStartOfFunctionType(): boolean;
        tsParseTypeOrTypePredicateAnnotation(returnToken: TokenType): N.TSTypeAnnotation;
        tsTryParseTypeOrTypePredicateAnnotation(): N.TSTypeAnnotation | undefined;
        tsTryParseTypeAnnotation(): N.TSTypeAnnotation | undefined;
        tsTryParseType(): N.TSType | undefined;
        tsParseTypePredicatePrefix(): N.Identifier | undefined;
        tsParseTypePredicateAsserts(): boolean;
        tsParseTypeAnnotation(eatColon?: boolean, t?: Undone<N.TSTypeAnnotation>): N.TSTypeAnnotation;
        /** Be sure to be in a type context before calling this, using `tsInType`. */
        tsParseType(): N.TSType;
        isAbstractConstructorSignature(): boolean;
        tsParseNonConditionalType(): N.TSType;
        tsParseTypeAssertion(): N.TSTypeAssertion;
        tsParseHeritageClause(token: "extends"): N.TSInterfaceHeritage[];
        tsParseHeritageClause(token: "implements"): N.TSClassImplements[];
        tsParseInterfaceDeclaration(node: Undone<N.TSInterfaceDeclaration>, properties?: {
            declare?: true;
        }): N.TSInterfaceDeclaration | null;
        tsParseTypeAliasDeclaration(node: Undone<N.TSTypeAliasDeclaration>): N.TSTypeAliasDeclaration;
        tsInTopLevelContext<T>(cb: () => T): T;
        /**
         * Runs `cb` in a type context.
         * This should be called one token *before* the first type token,
         * so that the call to `next()` is run in type context.
         */
        tsInType<T>(cb: () => T): T;
        tsInDisallowConditionalTypesContext<T>(cb: () => T): T;
        tsInAllowConditionalTypesContext<T>(cb: () => T): T;
        tsEatThenParseType(token: TokenType): N.TSType | undefined;
        tsExpectThenParseType(token: TokenType): N.TSType;
        tsNextThenParseType(): N.TSType;
        tsParseEnumMember(): N.TSEnumMember;
        tsParseEnumDeclaration(node: Undone<N.TSEnumDeclaration>, properties?: {
            const?: true;
            declare?: true;
        }): N.TSEnumDeclaration;
        tsParseEnumBody(): N.TSEnumBody;
        tsParseModuleBlock(isGlobal: boolean): N.TSModuleBlock;
        tsParseNamespaceDeclaration(node: Undone<N.TSModuleDeclaration>): N.TSModuleDeclaration;
        tsParseAmbientExternalModuleDeclaration(node: Undone<N.TSModuleDeclaration>): N.TSModuleDeclaration;
        tsParseImportEqualsDeclaration(node: Undone<N.TSImportEqualsDeclaration>, maybeDefaultIdentifier?: N.Identifier | null): N.TSImportEqualsDeclaration;
        tsIsExternalModuleReference(): boolean;
        tsParseModuleReference(): N.TSExternalModuleReference | N.TSEntityName;
        tsParseExternalModuleReference(): N.TSExternalModuleReference;
        tsLookAhead<T>(f: () => T): T;
        tsTryParseAndCatch<T extends Undone<N.Node> | undefined | null>(f: () => T): T | undefined | null;
        tsTryParse<T>(f: () => T | undefined | false): T | undefined;
        tsTryParseDeclare(node: any): N.ClassDeclaration | N.FunctionDeclaration | N.TSEnumDeclaration | N.TSInterfaceDeclaration | N.TSModuleDeclaration | N.TSTypeAliasDeclaration | N.VariableDeclaration | null | undefined;
        tsTryParseExportDeclaration(): N.ClassDeclaration | N.TSInterfaceDeclaration | N.TSModuleDeclaration | N.TSTypeAliasDeclaration | null | undefined;
        tsParseDeclaration(node: any, type: number, next: boolean, decorators: N.Decorator[] | null): N.ClassDeclaration | N.TSInterfaceDeclaration | N.TSTypeAliasDeclaration | N.TSModuleDeclaration | null | undefined;
        tsCheckLineTerminator(next: boolean): boolean;
        tsTryParseGenericAsyncArrowFunction(startLoc: Position): N.ArrowFunctionExpression | undefined;
        tsParseTypeArgumentsInExpression(): N.TSTypeParameterInstantiation | undefined;
        tsParseTypeArguments(): N.TSTypeParameterInstantiation;
        tsIsDeclarationStart(): boolean;
        isExportDefaultSpecifier(): boolean;
        parseBindingElement(flags: ParseBindingListFlags, decorators: N.Decorator[]): N.Identifier | N.Pattern | N.TSParameterProperty;
        isSimpleParameter(node: N.FunctionParameter | N.TSParameterProperty): boolean;
        tsDisallowOptionalPattern(node: Undone<N.Function | N.TSDeclareMethod | N.TSDeclareFunction>): void;
        setArrowFunctionParameters(node: Undone<N.ArrowFunctionExpression>, params: N.Expression[], trailingCommaLoc?: Position | null): void;
        parseFunctionBodyAndFinish<T extends N.Function | N.TSDeclareMethod | N.TSDeclareFunction>(node: Undone<T>, type: T["type"], isMethod?: boolean): T;
        registerFunctionStatementId(node: N.NormalFunction): void;
        tsCheckForInvalidTypeCasts(items: (N.Expression | N.TSTypeCastExpression | N.SpreadElement | N.ArgumentPlaceholder | null)[]): void;
        toReferencedList(exprList: (N.Expression | null)[], isInParens?: boolean): (N.Expression | null)[];
        parseArrayLike(close: TokenType, refExpressionErrors?: ExpressionErrors | null): N.ArrayExpression;
        parseSubscript(base: N.Expression, startLoc: Position, noCalls: boolean | undefined | null, state: N.ParseSubscriptState): N.Expression;
        parseNewCallee(node: N.NewExpression): void;
        parseExprOp(left: N.Expression, leftStartLoc: Position, minPrec: number): N.Expression;
        checkReservedWord(word: string, startLoc: number, checkKeywords: boolean, isBinding: boolean): void;
        checkDuplicateExports(): void;
        isPotentialImportPhase(isExport: boolean): boolean;
        applyImportPhase(node: Undone<N.ImportDeclaration | N.ExportNamedDeclaration>, isExport: boolean, phase: string | null, loc?: number): void;
        parseImport(node: Undone<N.ImportDeclaration | N.TSImportEqualsDeclaration>): N.AnyImport;
        parseExport(node: Undone<N.ExportDefaultDeclaration | N.ExportAllDeclaration | N.ExportNamedDeclaration>, decorators: N.Decorator[] | null): N.AnyExport;
        isAbstractClass(): boolean;
        parseExportDefaultExpression(): N.ExportDefaultDeclaration["declaration"];
        parseVarStatement(node: N.VariableDeclaration, kind: "var" | "let" | "const" | "using" | "await using", allowMissingInitializer?: boolean): N.VariableDeclaration;
        parseStatementContent(flags: ParseStatementFlag, decorators: N.Decorator[] | null): N.Statement;
        parseAccessModifier(): N.Accessibility | undefined | null;
        tsHasSomeModifiers(member: any, modifiers: readonly TsModifier[]): boolean;
        tsIsStartOfStaticBlocks(): boolean;
        parseClassMember(classBody: N.ClassBody, member: any, state: N.ParseClassMemberState): void;
        parseClassMemberWithIsStatic(classBody: N.ClassBody, member: Undone<N.ClassMember | N.TSIndexSignature>, state: N.ParseClassMemberState, isStatic: boolean): void;
        parsePostMemberNameModifiers(methodOrProp: Undone<N.ClassMethod | N.ClassProperty | N.ClassPrivateProperty>): void;
        shouldParseExportDeclaration(): boolean;
        parseConditional(expr: N.Expression, startLoc: Position, refExpressionErrors?: ExpressionErrors | null): N.Expression;
        parseParenItem<T extends N.Expression | N.RestElement | N.SpreadElement | N.TSTypeCastExpression>(node: T, startLoc: Position): T | N.TSTypeCastExpression;
        parseExportDeclaration(node: N.ExportNamedDeclaration): N.ExportNamedDeclaration["declaration"] | undefined;
        parseClassId(node: Undone<N.Class>, isStatement: boolean, optionalId?: boolean | null, bindingType?: BindingFlag): void;
        parseClassPropertyAnnotation(node: Undone<N.ClassProperty | N.ClassPrivateProperty | N.ClassAccessorProperty>): void;
        parseClassProperty(node: Undone<N.ClassProperty>): N.ClassProperty;
        parseClassPrivateProperty(node: Undone<N.ClassPrivateProperty>): N.ClassPrivateProperty;
        parseClassAccessorProperty(node: Undone<N.ClassAccessorProperty>): N.ClassAccessorProperty;
        pushClassMethod(classBody: Undone<N.ClassBody>, method: Undone<N.ClassMethod>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowsDirectSuper: boolean): void;
        pushClassPrivateMethod(classBody: Undone<N.ClassBody>, method: Undone<N.ClassPrivateMethod>, isGenerator: boolean, isAsync: boolean): void;
        declareClassPrivateMethodInScope(node: N.ClassPrivateMethod | N.TSDeclareMethod, kind: number): void;
        parseClassSuper(node: Undone<N.Class>): void;
        parseObjPropValue<T extends N.ObjectMember>(prop: Undone<T>, startLoc: Position | undefined | null, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean, refExpressionErrors?: ExpressionErrors | null): T;
        parseFunctionParams(node: Undone<N.Function>, isConstructor: boolean): void;
        parseVarId(decl: Undone<N.VariableDeclarator>, kind: "var" | "let" | "const" | "using" | "await using"): void;
        parseAsyncArrowFromCallExpression(node: Undone<N.ArrowFunctionExpression>, call: N.CallExpression): N.ArrowFunctionExpression;
        parseMaybeAssign(refExpressionErrors: ExpressionErrors | null | undefined, isParenItem: boolean | undefined): N.Expression | N.TSTypeCastExpression;
        parseMaybeAssign(refExpressionErrors?: ExpressionErrors | null): N.Expression;
        reportReservedArrowTypeParam(node: N.TSTypeParameterDeclaration): void;
        parseMaybeUnary(refExpressionErrors?: ExpressionErrors | null, sawUnary?: boolean): N.Expression;
        parseArrow(node: Undone<N.ArrowFunctionExpression>): Undone<N.ArrowFunctionExpression> | null | undefined;
        parseFunctionParamType<T extends N.Pattern | N.Identifier | N.RestElement>(param: T): T;
        isAssignable(node: N.Node, isBinding?: boolean): boolean;
        toAssignable(node: N.Node, isLHS?: boolean): void;
        toAssignableParenthesizedExpression(node: N.ParenthesizedExpression, isLHS: boolean): void;
        checkToRestConversion(node: N.Node, allowPattern: boolean): void;
        isValidLVal(type: "TSTypeCastExpression" | "TSParameterProperty" | "TSNonNullExpression" | "TSInstantiationExpression" | "TSAsExpression" | "TSSatisfiesExpression" | "TSTypeAssertion", disallowCallExpression: boolean, isUnparenthesizedInAssign: boolean, binding: BindingFlag): string | boolean | [string, boolean];
        parseBindingAtom(): N.ArrayPattern | N.Identifier | N.ObjectPattern | N.VoidPattern;
        parseMaybeDecoratorArguments(expr: N.Expression, startLoc: Position): N.Expression;
        checkCommaAfterRest(close: (typeof charCodes)[keyof typeof charCodes]): boolean;
        isClassMethod(): boolean;
        isClassProperty(): boolean;
        parseMaybeDefault<P extends N.Pattern | N.Identifier>(startLoc?: Position | null, left?: P | null): P | N.AssignmentPattern;
        getTokenFromCode(code: number): void;
        reScan_lt_gt(): void;
        reScan_lt(): number;
        toAssignableListItem(exprList: (N.Expression | N.SpreadElement | N.RestElement | N.TSTypeCastExpression)[], index: number, isLHS: boolean): void;
        typeCastToParameter(node: N.TSTypeCastExpression): N.Expression;
        shouldParseArrow(params: N.Node[]): boolean;
        shouldParseAsyncArrow(): boolean;
        parseParenAndDistinguishExpression(canStartArrow: boolean): N.Expression;
        canHaveLeadingDecorator(): boolean;
        jsxParseOpeningElementAfterName(node: N.JSXOpeningElement): N.JSXOpeningElement;
        getGetterSetterExpectedParamCount(method: Undone<N.ObjectMethod | N.ClassMethod>): number;
        parseCatchClauseParam(): N.ArrayPattern | N.Identifier | N.ObjectPattern;
        tsInAmbientContext<T>(cb: () => T): T;
        parseClass<T extends N.Class>(node: Undone<T>, isStatement: boolean, optionalId?: boolean): T;
        tsParseAbstractDeclaration(node: any, decorators: N.Decorator[] | null): N.ClassDeclaration | N.TSInterfaceDeclaration | null;
        parseMethod<T extends N.ObjectMethod | N.ClassMethod | N.ClassPrivateMethod>(node: Undone<T>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowDirectSuper: boolean, type: T["type"], inClassScope?: boolean): T;
        tsParseTypeParameterName(): N.Identifier;
        shouldParseAsAmbientContext(): boolean;
        parse(): import("../../index.ts").ParseResult<N.File>;
        getExpression(): N.Expression & N.ParserOutput;
        parseExportSpecifier(node: Undone<N.ExportSpecifier>, isString: boolean, isInTypeExport: boolean, isMaybeTypeOnly: boolean): N.ExportSpecifier;
        parseImportSpecifier(specifier: Undone<N.ImportSpecifier>, importedIsString: boolean, isInTypeOnlyImport: boolean, isMaybeTypeOnly: boolean, bindingType: BindingFlag | undefined): N.ImportSpecifier;
        parseTypeOnlyImportSpecifier(node: Undone<N.ImportSpecifier>, isInTypeOnly: boolean): void;
        parseTypeOnlyExportSpecifier(node: Undone<N.ExportSpecifier>, isInTypeOnly: boolean): void;
        /**
         * This hook is defined in the ESTree plugin.
         * The TS-ESLint always define optional AST properties, here we provide the
         * default value for such properties immediately after `finishNode` was invoked.
         *
         * @param node The AST node finished by finishNode
         * @returns
         */
        fillOptionalPropertiesForTSESLint(node: N.Node): void;
        chStartsBindingIdentifierAndNotRelationalOperator(ch: number, pos: number): boolean;
        nextTokenIsIdentifierAndNotTSRelationalOperatorOnSameLine(): boolean;
        nextTokenIsStringLiteralOnSameLine(): boolean;
        parseTopLevel(this: Parser, file: Undone<N.File>, program: Undone<N.Program>): N.File;
        parseProgram(this: Parser, program: Undone<N.Program>, end: TokenType, sourceType: N.Program["sourceType"]): N.Program;
        stmtToDirective(stmt: N.ExpressionStatement): N.Directive;
        parseInterpreterDirective(): N.InterpreterDirective | null;
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
        parseModuleItem(this: Parser): N.BlockStatement | N.BreakStatement | N.ClassDeclaration | N.ContinueStatement | N.DebuggerStatement | N.DeclareClass | N.DeclareExportAllDeclaration | N.DeclareExportDeclaration | N.DeclareFunction | N.DeclareInterface | N.DeclareModule | N.DeclareModuleExports | N.DeclareOpaqueType | N.DeclareTypeAlias | N.DeclareVariable | N.DoWhileStatement | N.EmptyStatement | N.EnumDeclaration | N.ExportAllDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExpressionStatement | N.ForInStatement | N.ForOfStatement | N.ForStatement | N.FunctionDeclaration | N.IfStatement | N.ImportDeclaration | N.InterfaceDeclaration | N.LabeledStatement | N.OpaqueType | N.ReturnStatement | N.SwitchStatement | N.TSDeclareFunction | N.TSEnumDeclaration | N.TSExportAssignment | N.TSImportEqualsDeclaration | N.TSInterfaceDeclaration | N.TSModuleDeclaration | N.TSNamespaceExportDeclaration | N.TSTypeAliasDeclaration | N.ThrowStatement | N.TryStatement | N.TypeAlias | N.VariableDeclaration | N.WhileStatement | N.WithStatement;
        parseStatementListItem(this: Parser): N.BlockStatement | N.BreakStatement | N.ClassDeclaration | N.ContinueStatement | N.DebuggerStatement | N.DeclareClass | N.DeclareExportAllDeclaration | N.DeclareExportDeclaration | N.DeclareFunction | N.DeclareInterface | N.DeclareModule | N.DeclareModuleExports | N.DeclareOpaqueType | N.DeclareTypeAlias | N.DeclareVariable | N.DoWhileStatement | N.EmptyStatement | N.EnumDeclaration | N.ExportAllDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExpressionStatement | N.ForInStatement | N.ForOfStatement | N.ForStatement | N.FunctionDeclaration | N.IfStatement | N.ImportDeclaration | N.InterfaceDeclaration | N.LabeledStatement | N.OpaqueType | N.ReturnStatement | N.SwitchStatement | N.TSDeclareFunction | N.TSEnumDeclaration | N.TSExportAssignment | N.TSImportEqualsDeclaration | N.TSInterfaceDeclaration | N.TSModuleDeclaration | N.TSNamespaceExportDeclaration | N.TSTypeAliasDeclaration | N.ThrowStatement | N.TryStatement | N.TypeAlias | N.VariableDeclaration | N.WhileStatement | N.WithStatement;
        parseStatementOrSloppyAnnexBFunctionDeclaration(this: Parser, allowLabeledFunction?: boolean): N.BlockStatement | N.BreakStatement | N.ClassDeclaration | N.ContinueStatement | N.DebuggerStatement | N.DeclareClass | N.DeclareExportAllDeclaration | N.DeclareExportDeclaration | N.DeclareFunction | N.DeclareInterface | N.DeclareModule | N.DeclareModuleExports | N.DeclareOpaqueType | N.DeclareTypeAlias | N.DeclareVariable | N.DoWhileStatement | N.EmptyStatement | N.EnumDeclaration | N.ExportAllDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExpressionStatement | N.ForInStatement | N.ForOfStatement | N.ForStatement | N.FunctionDeclaration | N.IfStatement | N.ImportDeclaration | N.InterfaceDeclaration | N.LabeledStatement | N.OpaqueType | N.ReturnStatement | N.SwitchStatement | N.TSDeclareFunction | N.TSEnumDeclaration | N.TSExportAssignment | N.TSImportEqualsDeclaration | N.TSInterfaceDeclaration | N.TSModuleDeclaration | N.TSNamespaceExportDeclaration | N.TSTypeAliasDeclaration | N.ThrowStatement | N.TryStatement | N.TypeAlias | N.VariableDeclaration | N.WhileStatement | N.WithStatement;
        parseStatement(this: Parser): N.BlockStatement | N.BreakStatement | N.ClassDeclaration | N.ContinueStatement | N.DebuggerStatement | N.DeclareClass | N.DeclareExportAllDeclaration | N.DeclareExportDeclaration | N.DeclareFunction | N.DeclareInterface | N.DeclareModule | N.DeclareModuleExports | N.DeclareOpaqueType | N.DeclareTypeAlias | N.DeclareVariable | N.DoWhileStatement | N.EmptyStatement | N.EnumDeclaration | N.ExportAllDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExpressionStatement | N.ForInStatement | N.ForOfStatement | N.ForStatement | N.FunctionDeclaration | N.IfStatement | N.ImportDeclaration | N.InterfaceDeclaration | N.LabeledStatement | N.OpaqueType | N.ReturnStatement | N.SwitchStatement | N.TSDeclareFunction | N.TSEnumDeclaration | N.TSExportAssignment | N.TSImportEqualsDeclaration | N.TSInterfaceDeclaration | N.TSModuleDeclaration | N.TSNamespaceExportDeclaration | N.TSTypeAliasDeclaration | N.ThrowStatement | N.TryStatement | N.TypeAlias | N.VariableDeclaration | N.WhileStatement | N.WithStatement;
        parseStatementLike(this: Parser, flags: ParseStatementFlag): N.Statement | N.Declaration | N.ImportDeclaration | N.ExportDefaultDeclaration | N.ExportNamedDeclaration | N.ExportAllDeclaration;
        assertModuleNodeAllowed(node: N.Node): void;
        maybeTakeDecorators<T extends Undone<N.Class>>(maybeDecorators: N.Decorator[] | null | undefined, classNode: T, exportNode?: Undone<N.ExportDefaultDeclaration | N.ExportNamedDeclaration>): T;
        parseDecorators(this: Parser, allowExport?: boolean): N.Decorator[];
        parseDecorator(this: Parser): N.Decorator;
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
        parseTryStatement(this: Parser, node: Undone<N.TryStatement>): N.TryStatement;
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
        parseAsyncFunctionExpression(this: Parser, node: Undone<N.FunctionExpression>): N.FunctionExpression;
        parseFunction<T extends N.NormalFunction>(this: Parser, node: Undone<T>, flags?: import("../../parser/statement.ts").ParseFunctionFlag): T;
        parseFunctionId(requireId?: boolean): N.Identifier | undefined | null;
        nameIsConstructor(key: N.Expression | N.PrivateName): boolean;
        isNonstaticConstructor(method: Undone<N.ClassMethod | N.ClassProperty>): boolean;
        parseClassBody(this: Parser, hadSuperClass: boolean, oldStrict: boolean): N.ClassBody;
        parseClassMemberFromModifier(this: Parser, classBody: Undone<N.ClassBody>, member: Undone<N.ClassMember>): boolean;
        parseClassElementName(this: Parser, member: Undone<N.ClassMember>): N.Expression | N.Identifier | N.PrivateName;
        parseClassStaticBlock(this: Parser, classBody: Undone<N.ClassBody>, member: Undone<N.StaticBlock & {
            decorators?: N.Decorator[];
        }>): void;
        pushClassProperty(this: Parser, classBody: Undone<N.ClassBody>, prop: Undone<N.ClassProperty>): void;
        pushClassPrivateProperty(this: Parser, classBody: Undone<N.ClassBody>, prop: Undone<N.ClassPrivateProperty>): void;
        pushClassAccessorProperty(this: Parser, classBody: Undone<N.ClassBody>, prop: Undone<N.ClassAccessorProperty>, isPrivate: boolean): void;
        parseInitializer(this: Parser, node: Undone<N.ClassProperty | N.ClassPrivateProperty | N.ClassAccessorProperty>): void;
        eatExportStar(_: Undone<N.Node>): _ is Undone<N.ExportNamedDeclaration | N.ExportAllDeclaration>;
        maybeParseExportDefaultSpecifier(node: Undone<N.ExportDefaultDeclaration | N.ExportAllDeclaration | N.ExportNamedDeclaration>, maybeDefaultIdentifier: N.Identifier | null): node is Undone<N.ExportNamedDeclaration>;
        maybeParseExportNamespaceSpecifier(node: Undone<N.ExportNamedDeclaration | N.ExportAllDeclaration>): node is Undone<N.ExportNamedDeclaration>;
        maybeParseExportNamedSpecifiers(node: Undone<N.Node>): node is Undone<N.ExportNamedDeclaration>;
        maybeParseExportDeclaration(this: Parser, node: Undone<N.ExportNamedDeclaration>): boolean;
        isAsyncFunction(): boolean;
        parseExportFrom(this: Parser, node: Undone<N.ExportNamedDeclaration | N.ExportAllDeclaration>, expect?: boolean): void;
        checkNamedExport(node: Undone<N.ExportNamedDeclaration>, isFrom?: boolean): void;
        checkDeclaration(node: N.Identifier | N.Pattern | N.RestElement | N.ObjectProperty): void;
        parseExportSpecifiers(isInTypeExport: boolean): N.ExportSpecifier[];
        parseModuleExportName(): N.StringLiteral | N.Identifier;
        checkImportPhase(node: Undone<N.ImportDeclaration>): void;
        parseMaybeImportPhase(node: Undone<N.ImportDeclaration | N.TSImportEqualsDeclaration>, isExport: boolean): N.Identifier | null;
        isPrecedingIdImportPhase(phase: string): boolean;
        parseImportSpecifiersAndAfter(this: Parser, node: Undone<N.ImportDeclaration>, maybeDefaultIdentifier: N.Identifier | null): N.ImportDeclaration;
        parseImportSourceAndAttributes(this: Parser, node: Undone<N.ImportDeclaration>): N.ImportDeclaration;
        parseImportSource(this: Parser): N.StringLiteral;
        parseImportSpecifierLocal<T extends N.ImportSpecifier | N.ImportDefaultSpecifier | N.ImportNamespaceSpecifier>(node: Undone<N.ImportDeclaration>, specifier: Undone<T>, type: T["type"]): void;
        finishImportSpecifier<T extends N.ImportSpecifier | N.ImportDefaultSpecifier | N.ImportNamespaceSpecifier>(specifier: Undone<T>, type: T["type"], bindingType?: BindingFlag): T;
        parseImportAttributes(): N.ImportAttribute[];
        maybeParseImportAttributes(node: Undone<N.ImportDeclaration | N.ExportNamedDeclaration | N.ExportAllDeclaration>): void;
        maybeParseDefaultImportSpecifier(node: Undone<N.ImportDeclaration>, maybeDefaultIdentifier: N.Identifier | null): boolean;
        maybeParseStarImportSpecifier(node: Undone<N.ImportDeclaration>): boolean;
        parseNamedImportSpecifiers(node: Undone<N.ImportDeclaration>): void;
        isThisParam(param: N.Pattern | N.Identifier | N.TSParameterProperty | N.RestElement): boolean;
        checkProto(prop: N.ObjectMember | N.SpreadElement, sawProto: boolean, refExpressionErrors?: ExpressionErrors | null): boolean;
        shouldExitDescending(expr: N.Expression | N.PrivateName | N.Super | N.Import): expr is N.ArrowFunctionExpression;
        parseExpression(this: Parser, disallowIn?: boolean, refExpressionErrors?: ExpressionErrors): N.Expression;
        parseExpressionBase(this: Parser, refExpressionErrors?: ExpressionErrors): N.Expression;
        parseMaybeAssignDisallowIn(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.Expression;
        parseMaybeAssignAllowIn(this: Parser, refExpressionErrors: ExpressionErrors | null | undefined, isParenItem: boolean | undefined): N.Expression | N.TSTypeCastExpression;
        parseMaybeAssignAllowIn(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.Expression;
        setOptionalParametersError(refExpressionErrors: ExpressionErrors): void;
        parseMaybeConditional(this: Parser, refExpressionErrors: ExpressionErrors): N.Expression;
        parseMaybeUnaryOrPrivate(this: Parser, refExpressionErrors?: ExpressionErrors): N.Expression | N.PrivateName;
        parseExprOps(this: Parser, refExpressionErrors: ExpressionErrors): N.Expression;
        parseExprOpRightExpr(this: Parser, op: TokenType, prec: number): N.Expression;
        parseExprOpBaseRightExpr(this: Parser, op: TokenType, prec: number): N.Expression;
        parseHackPipeBody(this: Parser): N.Expression;
        checkExponentialAfterUnary(node: N.AwaitExpression | Undone<N.UnaryExpression>): void;
        parseUpdate(this: Parser, node: Undone<N.UpdateExpression>, update: boolean, refExpressionErrors?: ExpressionErrors | null): N.Expression;
        parseExprSubscripts(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.Expression;
        parseSubscripts(this: Parser, base: N.Expression | N.Super | N.Import, startLoc: Position, noCalls?: false | null): N.Expression;
        parseSubscripts(this: Parser, base: N.Expression | N.Super | N.Import, startLoc: Position, noCalls: true): N.Expression | N.Super | N.Import;
        parseSubscripts(this: Parser, base: N.Expression | N.Super | N.Import, startLoc: Position, noCalls?: boolean | null): N.Expression | N.Super | N.Import;
        stopParseSubscript(this: Parser, base: N.Expression, state: N.ParseSubscriptState): N.Expression;
        parseMember(this: Parser, base: N.Expression | N.Super, startLoc: Position, state: N.ParseSubscriptState, computed: boolean, optional: boolean): N.OptionalMemberExpression | N.MemberExpression;
        parseBind(this: Parser, base: N.Expression, startLoc: Position, state: N.ParseSubscriptState): N.Expression;
        parseCoverCallAndAsyncArrowHead(this: Parser, base: N.Expression | N.Super | N.Import, startLoc: Position, state: N.ParseSubscriptState, optional: boolean): N.Expression;
        parseTaggedTemplateExpression(this: Parser, base: N.Expression, startLoc: Position, state: N.ParseSubscriptState): N.TaggedTemplateExpression;
        atPossibleAsyncArrow(base: N.Expression | N.Super | N.Import): boolean;
        finishCallExpression<T extends N.CallExpression | N.OptionalCallExpression>(node: Undone<T>, optional: boolean): T;
        parseCallExpressionArguments(this: Parser, allowPlaceholder?: boolean, nodeForExtra?: Undone<N.Node> | null, refExpressionErrors?: ExpressionErrors | null): (N.Expression | N.SpreadElement)[];
        parseNoCallExpr(this: Parser, onUnparenthesizedImportExpression: (base: N.ImportExpression) => void): N.Expression | N.Super | N.Import;
        parseExprAtom(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.Expression | N.Super | N.Import;
        parseTopicReferenceThenEqualsSign(topicTokenType: TokenType, topicTokenValue: string): N.Expression;
        parseTopicReference(pipeProposal: string): N.Expression;
        finishTopicReference(node: Undone<N.TopicReference>, startLoc: Position, pipeProposal: string, tokenType: TokenType): N.TopicReference;
        testTopicReferenceConfiguration(pipeProposal: string, startLoc: Position, tokenType: TokenType): boolean;
        parseAsyncArrowUnaryFunction(this: Parser, node: Undone<N.ArrowFunctionExpression>): N.ArrowFunctionExpression;
        parseDo(this: Parser, node: Undone<N.DoExpression>, isAsync: boolean): N.DoExpression;
        parseSuper(): N.Super;
        parsePrivateName(): N.PrivateName;
        parseFunctionOrFunctionSent(this: Parser): N.FunctionExpression | N.MetaProperty;
        parseMetaProperty(node: Undone<N.MetaProperty>, meta: N.Identifier, propertyName: string): N.MetaProperty;
        parseImportMetaPropertyOrPhaseCall(this: Parser, node: Undone<N.MetaProperty | N.ImportExpression>): N.MetaProperty | N.ImportExpression;
        parseLiteralAtNode<T extends N.Node>(value: any, type: T["type"], node: any): T;
        parseLiteral<T extends N.Node>(value: any, type: T["type"]): T;
        parseStringLiteral(value: any): N.StringLiteral;
        parseNumericLiteral(value: any): N.NumericLiteral;
        parseBigIntLiteral(value: any): N.BigIntLiteral;
        parseRegExpLiteral(value: {
            value: any;
            pattern: string;
            flags: N.RegExpLiteral["flags"];
        }): N.RegExpLiteral;
        parseBooleanLiteral(value: boolean): N.BooleanLiteral;
        parseNullLiteral(): N.NullLiteral;
        wrapParenthesis(startLoc: Position, expression: N.Expression): N.Expression;
        parseNewOrNewTarget(this: Parser): N.NewExpression | N.MetaProperty;
        parseNew(this: Parser, node: Undone<N.NewExpression>): N.NewExpression;
        parseTemplateElement(isTagged: boolean): N.TemplateElement;
        parseTemplate(this: Parser, isTagged: boolean): N.TemplateLiteral;
        parseObjectLike(close: TokenType, isPattern: true, refExpressionErrors?: ExpressionErrors | null): N.ObjectPattern;
        parseObjectLike(close: TokenType, isPattern: false, refExpressionErrors?: ExpressionErrors | null): N.ObjectExpression;
        addTrailingCommaExtraToNode(node: Undone<N.Node>): void;
        maybeAsyncOrAccessorProp(prop: Undone<N.ObjectProperty | N.ObjectMethod>): prop is typeof prop & {
            key: N.Identifier;
        };
        parsePropertyDefinition(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.ObjectMember | N.SpreadElement;
        getObjectOrClassMethodParams(method: Undone<N.ObjectMethod | N.ClassMethod>): (N.TSParameterProperty | N.FunctionParameter)[] | N.FunctionParameter[];
        checkGetterSetterParams(method: Undone<N.ObjectMethod | N.ClassMethod>): void;
        parseObjectMethod(this: Parser, prop: Undone<N.ObjectMethod>, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean): N.ObjectMethod | undefined | null;
        parseObjectProperty(this: Parser, prop: Undone<N.ObjectProperty>, startLoc: Position | undefined | null, isPattern: boolean, refExpressionErrors?: ExpressionErrors | null): N.ObjectProperty | undefined | null;
        finishObjectProperty(node: Undone<N.ObjectProperty>): N.ObjectProperty;
        parsePropertyName(this: Parser, prop: Undone<N.ObjectOrClassMember | N.ClassMember> | N.TSPropertySignature | N.TSMethodSignature, refExpressionErrors?: ExpressionErrors | null): void;
        initFunction(node: Undone<N.Function>, isAsync: boolean): void;
        parseArrowExpression(this: Parser, node: Undone<N.ArrowFunctionExpression>, params: (N.Expression | N.SpreadElement | N.VoidPattern | N.AssignmentPattern | N.ArgumentPlaceholder | N.TSTypeCastExpression)[] | (N.Expression | N.RestElement | N.VoidPattern | N.AssignmentPattern | N.ArgumentPlaceholder | N.TSTypeCastExpression)[] | null | undefined, isAsync: boolean, trailingCommaLoc?: Position | null): N.ArrowFunctionExpression;
        parseFunctionBody(this: Parser, node: Undone<N.Function>, allowExpression?: boolean | null, isMethod?: boolean): void;
        isSimpleParamList(params: readonly (N.FunctionParameter | N.TSParameterProperty)[]): boolean;
        checkParams(node: Undone<N.Function>, allowDuplicates: boolean, isArrowFunction?: boolean | null, strictModeChanged?: boolean): void;
        parseExprList(this: Parser, close: TokenType, allowEmpty?: boolean, refExpressionErrors?: ExpressionErrors | null, nodeForExtra?: Undone<N.Node> | null): (N.Expression | null)[];
        parseExprListItem(this: Parser, close: TokenType, allowEmpty?: boolean, refExpressionErrors?: ExpressionErrors | null, allowPlaceholder?: boolean | null): N.Expression | null;
        parseExprListItem(this: Parser, close: TokenType, allowEmpty?: false, refExpressionErrors?: ExpressionErrors | null, allowPlaceholder?: boolean | null): N.Expression;
        parseIdentifier(liberal?: boolean): N.Identifier;
        createIdentifier(node: Undone<N.Identifier>, name: string): N.Identifier;
        createIdentifierAt(node: Undone<N.Identifier>, name: string, endLoc: Position): N.Identifier;
        parseIdentifierName(liberal?: boolean): string;
        recordAwaitIfAllowed(): boolean;
        parseAwait(this: Parser, startLoc: Position, soloAwait?: boolean): N.AwaitExpression;
        isAmbiguousPrefixOrIdentifier(): boolean;
        parseYield(this: Parser, startLoc: Position): N.YieldExpression;
        parseImportCall(this: Parser, node: Undone<N.ImportExpression>): N.ImportExpression;
        withTopicBindingContext<T>(callback: () => T): T;
        allowInAnd<T>(callback: () => T): T;
        disallowInAnd<T>(callback: () => T): T;
        registerTopicReference(): void;
        topicReferenceIsAllowedInCurrentContext(): boolean;
        topicReferenceWasUsedInCurrentContext(): boolean;
        parseFSharpPipelineBody(this: Parser, prec: number): N.Expression;
        parseModuleExpression(this: Parser): N.ModuleExpression;
        parseVoidPattern(this: Parser, refExpressionErrors: ExpressionErrors | null): N.VoidPattern;
        parseMaybeAssignAllowInOrVoidPattern(this: Parser, close: TokenType, refExpressionErrors: ExpressionErrors | null | undefined, isParenItem: boolean | undefined): N.Expression | N.TSTypeCastExpression;
        parseMaybeAssignAllowInOrVoidPattern(this: Parser, close: TokenType, refExpressionErrors?: ExpressionErrors | null): N.Expression;
        parsePropertyNamePrefixOperator(prop: Undone<N.ObjectOrClassMember | N.ClassMember>): void;
        toAssignableObjectExpressionProp(prop: N.Node, isLast: boolean, isLHS: boolean): void;
        toAssignableList(exprList: (N.Expression | N.SpreadElement | N.RestElement | N.VoidPattern | N.AssignmentPattern | N.ArgumentPlaceholder | N.TSTypeCastExpression | null)[], trailingCommaLoc: Position | undefined | null, isLHS: boolean): void;
        parseSpread(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.SpreadElement;
        parseRestBinding(this: Parser): N.RestElement;
        parseBindingList(this: Parser, close: TokenType, closeCharCode: (typeof charCodes)[keyof typeof charCodes], flags: ParseBindingListFlags.ALLOW_EMPTY): (N.Pattern | N.RestElement | null)[];
        parseBindingList(this: Parser, close: TokenType, closeCharCode: (typeof charCodes)[keyof typeof charCodes], flags: ParseBindingListFlags.IS_FUNCTION_PARAMS): (N.Pattern | N.RestElement | N.TSParameterProperty)[];
        parseBindingRestProperty(this: Parser, prop: Undone<N.RestElement>): N.RestElement;
        parseBindingProperty(this: Parser): N.AssignmentProperty | N.RestElement;
        isOptionalMemberExpression(expression: N.Node): boolean;
        checkLVal(expression: N.Expression | N.ObjectMember | N.RestElement | N.Pattern | N.TSParameterProperty | N.TSTypeCastExpression, ancestor: import("../../parse-error.ts").LValAncestor, binding?: BindingFlag, checkClashes?: Set<string> | false, strictModeChanged?: boolean, hasParenthesizedAncestor?: boolean, disallowCallExpression?: boolean): void;
        checkIdentifier(at: N.Identifier, bindingType: BindingFlag, strictModeChanged?: boolean): void;
        declareNameFromIdentifier(identifier: N.Identifier, binding: BindingFlag): void;
        createPosition(loc: Position): Position;
        startNode<T extends N.Node = never>(): Undone<T>;
        startNodeAt<T extends N.Node = never>(loc: Position): Undone<T>;
        startNodeAtNode<T extends N.Node = never>(type: Undone<N.Node>): Undone<T>;
        finishNode<T extends N.Node>(node: Undone<T>, type: T["type"]): T;
        finishNodeAt<T extends N.Node>(node: Omit<T, "type">, type: T["type"], endLoc: Position): T;
        finishNodeAtNode<T extends N.Node>(node: Omit<T, "type">, type: T["type"], endNode: N.Node): T;
        resetStartLocation(node: N.BaseNode, startLoc: Position): void;
        resetEndLocation(node: N.BaseNode, endLoc?: Position): void;
        resetStartLocationFromNode(node: N.BaseNode, locationNode: N.BaseNode): void;
        resetEndLocationFromNode(node: N.BaseNode, locationNode: N.BaseNode): void;
        castNodeTo<T extends N.Node["type"]>(node: N.Node, type: T): Extract<N.AnyTypeAnnotation, {
            type: T;
        }> | Extract<N.ArgumentPlaceholder, {
            type: T;
        }> | Extract<N.ArrayExpression, {
            type: T;
        }> | Extract<N.ArrayPattern, {
            type: T;
        }> | Extract<N.ArrayTypeAnnotation, {
            type: T;
        }> | Extract<N.ArrowFunctionExpression, {
            type: T;
        }> | Extract<N.AssignmentExpression, {
            type: T;
        }> | Extract<N.AssignmentPattern, {
            type: T;
        }> | Extract<N.AwaitExpression, {
            type: T;
        }> | Extract<N.BigIntLiteral, {
            type: T;
        }> | Extract<N.BigIntLiteralTypeAnnotation, {
            type: T;
        }> | Extract<N.BinaryExpressionIn, {
            type: T;
        }> | Extract<N.BinaryExpressionNotIn, {
            type: T;
        }> | Extract<N.BindExpression, {
            type: T;
        }> | Extract<N.BlockStatement, {
            type: T;
        }> | Extract<N.BooleanLiteral, {
            type: T;
        }> | Extract<N.BooleanLiteralTypeAnnotation, {
            type: T;
        }> | Extract<N.BooleanTypeAnnotation, {
            type: T;
        }> | Extract<N.BreakStatement, {
            type: T;
        }> | Extract<N.CallExpression, {
            type: T;
        }> | Extract<N.CatchClause, {
            type: T;
        }> | Extract<N.ClassAccessorPropertyComputed, {
            type: T;
        }> | Extract<N.ClassAccessorPropertyNonComputed, {
            type: T;
        }> | Extract<N.ClassBody, {
            type: T;
        }> | Extract<N.ClassDeclaration, {
            type: T;
        }> | Extract<N.ClassExpression, {
            type: T;
        }> | Extract<N.ClassImplements, {
            type: T;
        }> | Extract<N.ClassMethodComputed, {
            type: T;
        }> | Extract<N.ClassMethodNonComputed, {
            type: T;
        }> | Extract<N.ClassPrivateMethod, {
            type: T;
        }> | Extract<N.ClassPrivateProperty, {
            type: T;
        }> | Extract<N.ClassPropertyComputed, {
            type: T;
        }> | Extract<N.ClassPropertyNonComputed, {
            type: T;
        }> | Extract<N.ConditionalExpression, {
            type: T;
        }> | Extract<N.ContinueStatement, {
            type: T;
        }> | Extract<N.DebuggerStatement, {
            type: T;
        }> | Extract<N.DeclareClass, {
            type: T;
        }> | Extract<N.DeclareExportAllDeclaration, {
            type: T;
        }> | Extract<N.DeclareExportDeclaration, {
            type: T;
        }> | Extract<N.DeclareFunction, {
            type: T;
        }> | Extract<N.DeclareInterface, {
            type: T;
        }> | Extract<N.DeclareModule, {
            type: T;
        }> | Extract<N.DeclareModuleExports, {
            type: T;
        }> | Extract<N.DeclareOpaqueType, {
            type: T;
        }> | Extract<N.DeclareTypeAlias, {
            type: T;
        }> | Extract<N.DeclareVariable, {
            type: T;
        }> | Extract<N.DeclaredPredicate, {
            type: T;
        }> | Extract<N.Decorator, {
            type: T;
        }> | Extract<N.Directive, {
            type: T;
        }> | Extract<N.DirectiveLiteral, {
            type: T;
        }> | Extract<N.DoExpression, {
            type: T;
        }> | Extract<N.DoWhileStatement, {
            type: T;
        }> | Extract<N.EmptyStatement, {
            type: T;
        }> | Extract<N.EmptyTypeAnnotation, {
            type: T;
        }> | Extract<N.EnumBooleanBody, {
            type: T;
        }> | Extract<N.EnumBooleanMember, {
            type: T;
        }> | Extract<N.EnumDeclaration, {
            type: T;
        }> | Extract<N.EnumDefaultedMember, {
            type: T;
        }> | Extract<N.EnumNumberBody, {
            type: T;
        }> | Extract<N.EnumNumberMember, {
            type: T;
        }> | Extract<N.EnumStringBody, {
            type: T;
        }> | Extract<N.EnumStringMember, {
            type: T;
        }> | Extract<N.EnumSymbolBody, {
            type: T;
        }> | Extract<N.ExistsTypeAnnotation, {
            type: T;
        }> | Extract<N.ExportAllDeclaration, {
            type: T;
        }> | Extract<N.ExportDefaultDeclaration, {
            type: T;
        }> | Extract<N.ExportDefaultSpecifier, {
            type: T;
        }> | Extract<N.ExportNamedDeclaration, {
            type: T;
        }> | Extract<N.ExportNamespaceSpecifier, {
            type: T;
        }> | Extract<N.ExportSpecifier, {
            type: T;
        }> | Extract<N.ExpressionStatement, {
            type: T;
        }> | Extract<N.File, {
            type: T;
        }> | Extract<N.ForInStatement, {
            type: T;
        }> | Extract<N.ForOfStatement, {
            type: T;
        }> | Extract<N.ForStatement, {
            type: T;
        }> | Extract<N.FunctionDeclaration, {
            type: T;
        }> | Extract<N.FunctionExpression, {
            type: T;
        }> | Extract<N.FunctionTypeAnnotation, {
            type: T;
        }> | Extract<N.FunctionTypeParam, {
            type: T;
        }> | Extract<N.GenericTypeAnnotation, {
            type: T;
        }> | Extract<N.Identifier, {
            type: T;
        }> | Extract<N.IfStatement, {
            type: T;
        }> | Extract<N.Import, {
            type: T;
        }> | Extract<N.ImportAttribute, {
            type: T;
        }> | Extract<N.ImportDeclaration, {
            type: T;
        }> | Extract<N.ImportDefaultSpecifier, {
            type: T;
        }> | Extract<N.ImportExpression, {
            type: T;
        }> | Extract<N.ImportNamespaceSpecifier, {
            type: T;
        }> | Extract<N.ImportSpecifier, {
            type: T;
        }> | Extract<N.IndexedAccessType, {
            type: T;
        }> | Extract<N.InferredPredicate, {
            type: T;
        }> | Extract<N.InterfaceDeclaration, {
            type: T;
        }> | Extract<N.InterfaceExtends, {
            type: T;
        }> | Extract<N.InterfaceTypeAnnotation, {
            type: T;
        }> | Extract<N.InterpreterDirective, {
            type: T;
        }> | Extract<N.IntersectionTypeAnnotation, {
            type: T;
        }> | Extract<N.JSXAttribute, {
            type: T;
        }> | Extract<N.JSXClosingElement, {
            type: T;
        }> | Extract<N.JSXClosingFragment, {
            type: T;
        }> | Extract<N.JSXElement, {
            type: T;
        }> | Extract<N.JSXEmptyExpression, {
            type: T;
        }> | Extract<N.JSXExpressionContainer, {
            type: T;
        }> | Extract<N.JSXFragment, {
            type: T;
        }> | Extract<N.JSXIdentifier, {
            type: T;
        }> | Extract<N.JSXMemberExpression, {
            type: T;
        }> | Extract<N.JSXNamespacedName, {
            type: T;
        }> | Extract<N.JSXOpeningElement, {
            type: T;
        }> | Extract<N.JSXOpeningFragment, {
            type: T;
        }> | Extract<N.JSXSpreadAttribute, {
            type: T;
        }> | Extract<N.JSXSpreadChild, {
            type: T;
        }> | Extract<N.JSXText, {
            type: T;
        }> | Extract<N.LabeledStatement, {
            type: T;
        }> | Extract<N.LogicalExpression, {
            type: T;
        }> | Extract<N.MemberExpressionComputed, {
            type: T;
        }> | Extract<N.MemberExpressionNonComputed, {
            type: T;
        }> | Extract<N.MetaProperty, {
            type: T;
        }> | Extract<N.MixedTypeAnnotation, {
            type: T;
        }> | Extract<N.ModuleExpression, {
            type: T;
        }> | Extract<N.NewExpression, {
            type: T;
        }> | Extract<N.NullLiteral, {
            type: T;
        }> | Extract<N.NullLiteralTypeAnnotation, {
            type: T;
        }> | Extract<N.NullableTypeAnnotation, {
            type: T;
        }> | Extract<N.NumberLiteral, {
            type: T;
        }> | Extract<N.NumberLiteralTypeAnnotation, {
            type: T;
        }> | Extract<N.NumberTypeAnnotation, {
            type: T;
        }> | Extract<N.NumericLiteral, {
            type: T;
        }> | Extract<N.ObjectExpression, {
            type: T;
        }> | Extract<N.ObjectMethodComputed, {
            type: T;
        }> | Extract<N.ObjectMethodNonComputed, {
            type: T;
        }> | Extract<N.ObjectPattern, {
            type: T;
        }> | Extract<N.ObjectPropertyComputed, {
            type: T;
        }> | Extract<N.ObjectPropertyNonComputed, {
            type: T;
        }> | Extract<N.ObjectTypeAnnotation, {
            type: T;
        }> | Extract<N.ObjectTypeCallProperty, {
            type: T;
        }> | Extract<N.ObjectTypeIndexer, {
            type: T;
        }> | Extract<N.ObjectTypeInternalSlot, {
            type: T;
        }> | Extract<N.ObjectTypeProperty, {
            type: T;
        }> | Extract<N.ObjectTypeSpreadProperty, {
            type: T;
        }> | Extract<N.OpaqueType, {
            type: T;
        }> | Extract<N.OptionalCallExpression, {
            type: T;
        }> | Extract<N.OptionalIndexedAccessType, {
            type: T;
        }> | Extract<N.OptionalMemberExpressionComputed, {
            type: T;
        }> | Extract<N.OptionalMemberExpressionNonComputed, {
            type: T;
        }> | Extract<N.ParenthesizedExpression, {
            type: T;
        }> | Extract<import("@babel/types").Placeholder, {
            type: T;
        }> | Extract<N.PrivateName, {
            type: T;
        }> | Extract<N.Program, {
            type: T;
        }> | Extract<N.QualifiedTypeIdentifier, {
            type: T;
        }> | Extract<N.RegExpLiteral, {
            type: T;
        }> | Extract<N.RegexLiteral, {
            type: T;
        }> | Extract<N.RestElement, {
            type: T;
        }> | Extract<N.RestProperty, {
            type: T;
        }> | Extract<N.ReturnStatement, {
            type: T;
        }> | Extract<N.SequenceExpression, {
            type: T;
        }> | Extract<N.SpreadElement, {
            type: T;
        }> | Extract<N.SpreadProperty, {
            type: T;
        }> | Extract<N.StaticBlock, {
            type: T;
        }> | Extract<N.StringLiteral, {
            type: T;
        }> | Extract<N.StringLiteralTypeAnnotation, {
            type: T;
        }> | Extract<N.StringTypeAnnotation, {
            type: T;
        }> | Extract<N.Super, {
            type: T;
        }> | Extract<N.SwitchCase, {
            type: T;
        }> | Extract<N.SwitchStatement, {
            type: T;
        }> | Extract<N.SymbolTypeAnnotation, {
            type: T;
        }> | Extract<N.TSAnyKeyword, {
            type: T;
        }> | Extract<N.TSArrayType, {
            type: T;
        }> | Extract<N.TSAsExpression, {
            type: T;
        }> | Extract<N.TSBigIntKeyword, {
            type: T;
        }> | Extract<N.TSBooleanKeyword, {
            type: T;
        }> | Extract<N.TSCallSignatureDeclaration, {
            type: T;
        }> | Extract<N.TSClassImplements, {
            type: T;
        }> | Extract<N.TSConditionalType, {
            type: T;
        }> | Extract<N.TSConstructSignatureDeclaration, {
            type: T;
        }> | Extract<N.TSConstructorType, {
            type: T;
        }> | Extract<N.TSDeclareFunction, {
            type: T;
        }> | Extract<N.TSDeclareMethodComputed, {
            type: T;
        }> | Extract<N.TSDeclareMethodNonComputed, {
            type: T;
        }> | Extract<N.TSEnumBody, {
            type: T;
        }> | Extract<N.TSEnumDeclaration, {
            type: T;
        }> | Extract<N.TSEnumMember, {
            type: T;
        }> | Extract<N.TSExportAssignment, {
            type: T;
        }> | Extract<N.TSExternalModuleReference, {
            type: T;
        }> | Extract<N.TSFunctionType, {
            type: T;
        }> | Extract<N.TSImportEqualsDeclaration, {
            type: T;
        }> | Extract<N.TSImportType, {
            type: T;
        }> | Extract<N.TSIndexSignature, {
            type: T;
        }> | Extract<N.TSIndexedAccessType, {
            type: T;
        }> | Extract<N.TSInferType, {
            type: T;
        }> | Extract<N.TSInstantiationExpression, {
            type: T;
        }> | Extract<N.TSInterfaceBody, {
            type: T;
        }> | Extract<N.TSInterfaceDeclaration, {
            type: T;
        }> | Extract<N.TSInterfaceHeritage, {
            type: T;
        }> | Extract<N.TSIntersectionType, {
            type: T;
        }> | Extract<N.TSIntrinsicKeyword, {
            type: T;
        }> | Extract<N.TSLiteralType, {
            type: T;
        }> | Extract<N.TSMappedType, {
            type: T;
        }> | Extract<N.TSMethodSignature, {
            type: T;
        }> | Extract<N.TSModuleBlock, {
            type: T;
        }> | Extract<N.TSModuleDeclaration, {
            type: T;
        }> | Extract<N.TSNamedTupleMember, {
            type: T;
        }> | Extract<N.TSNamespaceExportDeclaration, {
            type: T;
        }> | Extract<N.TSNeverKeyword, {
            type: T;
        }> | Extract<N.TSNonNullExpression, {
            type: T;
        }> | Extract<N.TSNullKeyword, {
            type: T;
        }> | Extract<N.TSNumberKeyword, {
            type: T;
        }> | Extract<N.TSObjectKeyword, {
            type: T;
        }> | Extract<N.TSOptionalType, {
            type: T;
        }> | Extract<N.TSParameterProperty, {
            type: T;
        }> | Extract<N.TSParenthesizedType, {
            type: T;
        }> | Extract<N.TSPropertySignature, {
            type: T;
        }> | Extract<N.TSQualifiedName, {
            type: T;
        }> | Extract<N.TSRestType, {
            type: T;
        }> | Extract<N.TSSatisfiesExpression, {
            type: T;
        }> | Extract<N.TSStringKeyword, {
            type: T;
        }> | Extract<N.TSSymbolKeyword, {
            type: T;
        }> | Extract<N.TSTemplateLiteralType, {
            type: T;
        }> | Extract<N.TSThisType, {
            type: T;
        }> | Extract<N.TSTupleType, {
            type: T;
        }> | Extract<N.TSTypeAliasDeclaration, {
            type: T;
        }> | Extract<N.TSTypeAnnotation, {
            type: T;
        }> | Extract<N.TSTypeAssertion, {
            type: T;
        }> | Extract<N.TSTypeLiteral, {
            type: T;
        }> | Extract<N.TSTypeOperator, {
            type: T;
        }> | Extract<N.TSTypeParameter, {
            type: T;
        }> | Extract<N.TSTypeParameterDeclaration, {
            type: T;
        }> | Extract<N.TSTypeParameterInstantiation, {
            type: T;
        }> | Extract<N.TSTypePredicate, {
            type: T;
        }> | Extract<N.TSTypeQuery, {
            type: T;
        }> | Extract<N.TSTypeReference, {
            type: T;
        }> | Extract<N.TSUndefinedKeyword, {
            type: T;
        }> | Extract<N.TSUnionType, {
            type: T;
        }> | Extract<N.TSUnknownKeyword, {
            type: T;
        }> | Extract<N.TSVoidKeyword, {
            type: T;
        }> | Extract<N.TaggedTemplateExpression, {
            type: T;
        }> | Extract<N.TemplateElement, {
            type: T;
        }> | Extract<N.TemplateLiteral, {
            type: T;
        }> | Extract<N.ThisExpression, {
            type: T;
        }> | Extract<N.ThisTypeAnnotation, {
            type: T;
        }> | Extract<N.ThrowStatement, {
            type: T;
        }> | Extract<N.TopicReference, {
            type: T;
        }> | Extract<N.TryStatement, {
            type: T;
        }> | Extract<N.TupleTypeAnnotation, {
            type: T;
        }> | Extract<N.TypeAlias, {
            type: T;
        }> | Extract<N.TypeAnnotation, {
            type: T;
        }> | Extract<N.TypeCastExpression, {
            type: T;
        }> | Extract<N.TypeParameter, {
            type: T;
        }> | Extract<N.TypeParameterDeclaration, {
            type: T;
        }> | Extract<N.TypeParameterInstantiation, {
            type: T;
        }> | Extract<N.TypeofTypeAnnotation, {
            type: T;
        }> | Extract<N.UnaryExpression, {
            type: T;
        }> | Extract<N.UnionTypeAnnotation, {
            type: T;
        }> | Extract<N.UpdateExpression, {
            type: T;
        }> | Extract<N.V8IntrinsicIdentifier, {
            type: T;
        }> | Extract<N.VariableDeclaration, {
            type: T;
        }> | Extract<N.VariableDeclarator, {
            type: T;
        }> | Extract<N.Variance, {
            type: T;
        }> | Extract<N.VoidPattern, {
            type: T;
        }> | Extract<N.VoidTypeAnnotation, {
            type: T;
        }> | Extract<N.WhileStatement, {
            type: T;
        }> | Extract<N.WithStatement, {
            type: T;
        }> | Extract<N.YieldExpression, {
            type: T;
        }> | Extract<N.EstreeAccessorProperty, {
            type: T;
        }> | Extract<N.EstreeMethodDefinition, {
            type: T;
        }> | Extract<N.EstreePropertyDefinition, {
            type: T;
        }> | Extract<N.EstreeTSAbstractMethodDefinition, {
            type: T;
        }> | Extract<N.EstreeTSAbstractPropertyDefinition, {
            type: T;
        }> | Extract<N.EstreeTSAbstractAccessorProperty, {
            type: T;
        }> | Extract<N.EstreeChainExpression, {
            type: T;
        }> | Extract<N.EstreeLiteral, {
            type: T;
        }> | Extract<N.EstreeBigIntLiteral, {
            type: T;
        }> | Extract<N.EstreeTSEmptyBodyFunctionExpression, {
            type: T;
        }> | Extract<N.EstreePrivateIdentifier, {
            type: T;
        }> | Extract<N.EstreeProperty, {
            type: T;
        }> | Extract<N.EstreeRegExpLiteral, {
            type: T;
        }> | Extract<N.TSTypeCastExpression, {
            type: T;
        }>;
        cloneIdentifier<T extends N.Identifier | N.Placeholder>(node: T): T;
        cloneStringLiteral<T extends N.StringLiteral | N.EstreeLiteral | N.Placeholder>(node: T): T;
        addExtra(node: Partial<N.Node>, key: string, value: any, enumerable?: boolean): void;
        isContextual(token: TokenType): boolean;
        isUnparsedContextual(nameStart: number, name: string): boolean;
        isLookaheadContextual(name: string): boolean;
        eatContextual(token: TokenType): boolean;
        expectContextual(token: TokenType, toParseError?: import("../../parse-error.ts").ParseErrorConstructor<any>): void;
        canInsertSemicolon(): boolean;
        hasPrecedingLineBreak(): boolean;
        hasFollowingLineBreak(): boolean;
        isLineTerminator(): boolean;
        semicolon(allowAsi?: boolean): void;
        expect(type: TokenType, loc?: Position | null): void;
        tryParse<T extends N.Node | readonly N.Node[] | null>(fn: (abort: (node?: T) => never) => T, oldState?: State): {
            node: T;
            error: null;
            thrown: false;
            aborted: false;
            failState: null;
        } | {
            node: T | null;
            error: import("../../parse-error.ts").ParseError;
            thrown: boolean;
            aborted: false;
            failState: State;
        } | {
            node: T | null;
            error: null;
            thrown: false;
            aborted: true;
            failState: State;
        };
        checkExpressionErrors(refExpressionErrors: ExpressionErrors | undefined | null, andThrow: boolean): boolean | undefined;
        isLiteralPropertyName(): boolean;
        isPrivateName(node: N.Node): node is N.PrivateName;
        getPrivateNameSV(node: N.PrivateName): string;
        hasPropertyAsPrivateName(node: N.Node): boolean;
        isObjectProperty(node: N.Node): node is N.ObjectProperty | N.EstreePropertyDefinition;
        isObjectMethod(node: N.Node): node is N.ObjectMethod;
        initializeScopes(this: Parser, inModule?: boolean): () => void;
        enterInitialScopes(): void;
        checkDestructuringPrivate(refExpressionErrors: ExpressionErrors): void;
        isLookahead: boolean;
        tokens: (import("../../index.ts").Token | N.Comment)[];
        setLoc(loc: Position): void;
        getLoc(locIndex: number): Position;
        pushToken(token: import("../../index.ts").Token | N.Comment): void;
        next(): void;
        eat(type: TokenType): boolean;
        match(type: TokenType): boolean;
        createLookaheadState(state: State): import("../../tokenizer/state.ts").LookaheadState;
        lookahead(): import("../../tokenizer/state.ts").LookaheadState;
        nextTokenStart(): number;
        nextTokenStartSince(pos: number): number;
        lookaheadCharCode(): number;
        lookaheadCharCodeSince(pos: number): number;
        nextTokenInLineStart(): number;
        nextTokenInLineStartSince(pos: number): number;
        lookaheadInLineCharCode(): number;
        codePointAtPos(pos: number): number;
        setStrict(strict: boolean): void;
        curContext(): import("../../tokenizer/context.ts").TokContext;
        nextToken(): void;
        skipBlockComment(commentEnd: "*/" | "*-/"): N.CommentBlock | undefined;
        skipLineComment(startSkip: number): N.CommentLine | undefined;
        skipSpace(): void;
        finishToken(type: TokenType, val?: any): void;
        replaceToken(type: TokenType): void;
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
        finishOp(type: TokenType, size: number): void;
        readRegexp(): void;
        readInt(radix: number, len?: number, forceLen?: boolean, allowNumSeparator?: boolean | "bail"): number | null;
        readRadixNumber(radix: number): void;
        readNumber(startsWithDot: boolean): void;
        readCodePoint(throwOnInvalid: boolean): number | null;
        readString(quote: number): void;
        readTemplateContinuation(): void;
        readTemplateToken(): void;
        recordStrictModeErrors(toParseError: import("../../tokenizer/state.ts").DeferredStrictError, at: Position): void;
        readWord1(firstCode?: number): string;
        readWord(firstCode?: number): void;
        checkKeywordEscapes(): void;
        raise<ErrorDetails = object>(toParseError: import("../../parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: Position | Undone<N.Node> | number, details?: ErrorDetails): import("../../parse-error.ts").ParseError;
        raiseOverwrite<ErrorDetails>(toParseError: import("../../parse-error.ts").ParseErrorConstructor<ErrorDetails>, at: Position | Undone<N.Node>, details?: ErrorDetails): import("../../parse-error.ts").ParseError;
        updateContext(prevType?: TokenType): void;
        unexpected(loc?: Position | number | null, type?: TokenType): any;
        expectPlugin(pluginName: import("../../typings").Plugin, loc?: Position | number | null): true;
        expectOnePlugin(pluginNames: import("../../typings").Plugin[]): any;
        errorBuilder(error: import("../../parse-error.ts").ParseErrorConstructor<object>): (pos: number, lineStart: number, curLine: number) => void;
        errorHandlers_readInt: import("@babel/helper-string-parser").IntErrorHandlers;
        errorHandlers_readCodePoint: import("@babel/helper-string-parser").CodePointErrorHandlers;
        errorHandlers_readStringContents_string: import("@babel/helper-string-parser").StringContentsErrorHandlers;
        errorHandlers_readStringContents_template: import("@babel/helper-string-parser").StringContentsErrorHandlers;
        addComment(comment: N.Comment): void;
        processComment(node: N.Node): void;
        finalizeComment(commentWS: import("../../parser/comments.ts").CommentWhitespace): void;
        finalizeRemainingComments(): void;
        resetPreviousNodeTrailingComments(node: N.Node): void;
        takeSurroundingComments(node: N.Node, start: number, end: number): void;
        options: import("../../options.ts").Options;
        optionFlags: OptionFlags;
        inModule: boolean;
        classScope: import("../../util/class-scope.ts").default;
        prodParam: import("../../util/production-parameter.ts").default;
        expressionScope: import("../../util/expression-scope.ts").default;
        plugins: import("../../parser/index.ts").PluginsMap;
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
        hasPlugin(pluginConfig: import("../../typings").PluginConfig): boolean;
        getPluginOption<PluginName extends import("../../typings").ParserPluginWithOptions[0], OptionName extends keyof import("../../typings").PluginOptions<PluginName>>(plugin: PluginName, name: OptionName): NonNullable<import("../../typings").PluginOptions<PluginName>>[OptionName] | undefined;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map