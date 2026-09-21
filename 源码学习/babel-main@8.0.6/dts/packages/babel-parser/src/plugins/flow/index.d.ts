import type Parser from "../../parser/index.ts";
import { type TokenType } from "../../tokenizer/types.ts";
import type * as N from "../../types.ts";
import type { Position } from "../../util/location.ts";
import * as charCodes from "charcodes";
import FlowScopeHandler from "./scope.ts";
import { BindingFlag } from "../../util/scopeflags.ts";
import type { ExpressionErrors } from "../../parser/util.ts";
import type { ParseStatementFlag } from "../../parser/statement.ts";
import type { Undone } from "../../parser/node.ts";
import type { ClassWithMixin, IJSXParserMixin } from "../jsx/index.ts";
export declare const FlowErrorTemplates: {
    AmbiguousConditionalArrow: string;
    AmbiguousDeclareModuleKind: string;
    AssignReservedType: ({ reservedType }: {
        reservedType: string;
    }) => string;
    DeclareClassElement: string;
    DeclareClassFieldInitializer: string;
    DuplicateDeclareModuleExports: string;
    EnumBooleanMemberNotInitialized: ({ memberName, enumName, }: {
        memberName: string;
        enumName: string;
    }) => string;
    EnumDuplicateMemberName: ({ memberName, enumName, }: {
        memberName: string;
        enumName: string;
    }) => string;
    EnumInconsistentMemberValues: ({ enumName }: {
        enumName: string;
    }) => string;
    EnumInvalidExplicitType: ({ invalidEnumType, enumName, }: {
        invalidEnumType: string;
        enumName: string;
    }) => string;
    EnumInvalidExplicitTypeUnknownSupplied: ({ enumName, }: {
        enumName: string;
    }) => string;
    EnumInvalidMemberInitializerPrimaryType: ({ enumName, memberName, explicitType, }: {
        enumName: string;
        memberName: string;
        explicitType: EnumExplicitType;
    }) => string;
    EnumInvalidMemberInitializerSymbolType: ({ enumName, memberName, }: {
        enumName: string;
        memberName: string;
        explicitType: EnumExplicitType;
    }) => string;
    EnumInvalidMemberInitializerUnknownType: ({ enumName, memberName, }: {
        enumName: string;
        memberName: string;
        explicitType: EnumExplicitType;
    }) => string;
    EnumInvalidMemberName: ({ enumName, memberName, suggestion, }: {
        enumName: string;
        memberName: string;
        suggestion: string;
    }) => string;
    EnumNumberMemberNotInitialized: ({ enumName, memberName, }: {
        enumName: string;
        memberName: string;
    }) => string;
    EnumStringMemberInconsistentlyInitialized: ({ enumName, }: {
        enumName: string;
    }) => string;
    GetterMayNotHaveThisParam: string;
    ImportTypeShorthandOnlyInPureImport: string;
    InexactInsideExact: string;
    InexactInsideNonObject: string;
    InexactVariance: string;
    InvalidNonTypeImportInDeclareModule: string;
    MissingTypeParamDefault: string;
    NestedDeclareModule: string;
    NestedFlowComment: string;
    PatternIsOptional: {
        message: string;
    };
    SetterMayNotHaveThisParam: string;
    SpreadVariance: string;
    ThisParamAnnotationRequired: string;
    ThisParamBannedInConstructor: string;
    ThisParamMayNotBeOptional: string;
    ThisParamMustBeFirst: string;
    ThisParamNoDefault: string;
    TypeBeforeInitializer: string;
    TypeCastInPattern: string;
    UnexpectedExplicitInexactInObject: string;
    UnexpectedReservedType: ({ reservedType }: {
        reservedType: string;
    }) => string;
    UnexpectedReservedUnderscore: string;
    UnexpectedSpaceBetweenModuloChecks: string;
    UnexpectedSpreadType: string;
    UnexpectedSubtractionOperand: string;
    UnexpectedTokenAfterTypeParameter: string;
    UnexpectedTypeParameterBeforeAsyncArrowFunction: string;
    UnsupportedDeclareExportKind: ({ unsupportedExportKind, suggestion, }: {
        unsupportedExportKind: string;
        suggestion: string;
    }) => string;
    UnsupportedStatementInDeclareModule: string;
    UnterminatedFlowComment: string;
};
type EnumExplicitType = null | "boolean" | "number" | "string" | "symbol";
type EnumContext = {
    enumName: string;
    explicitType: EnumExplicitType;
    memberName: string;
};
type EnumMemberInit = {
    type: "number";
    loc: number;
    value: N.NumericLiteral;
} | {
    type: "string";
    loc: number;
    value: N.StringLiteral;
} | {
    type: "boolean";
    loc: number;
    value: N.BooleanLiteral;
} | {
    type: "invalid";
    loc: Position;
} | {
    type: "none";
    loc: Position;
};
declare const _default_1: (superClass: ClassWithMixin<typeof Parser, IJSXParserMixin>) => {
    new (options: Partial<import("../../options.ts").Options> | null | undefined, input: string, pluginsMap: import("../../parser/index.ts").PluginsMap): {
        flowPragma: void | null | "flow" | "noflow";
        getScopeHandler(): new (...args: any) => FlowScopeHandler;
        shouldParseTypes(): boolean;
        finishToken(type: TokenType, val: any): void;
        addComment(comment: N.Comment): void;
        flowParseTypeInitialiser(tok?: TokenType): N.FlowType;
        flowParsePredicate(): N.FlowPredicate;
        flowParseTypeAndPredicateInitialiser(allowLonePredicate: true): [N.FlowType | null, N.FlowPredicate | null];
        flowParseTypeAndPredicateInitialiser(allowLonePredicate: false): [N.FlowType, N.FlowPredicate | null];
        flowParseDeclareClass(node: Undone<N.DeclareClass>): N.DeclareClass;
        flowParseDeclareFunction(node: Undone<N.DeclareFunction>): N.DeclareFunction;
        flowParseDeclare(node: Undone<N.FlowDeclare>, insideModule?: boolean): N.FlowDeclare;
        flowParseDeclareVariable(node: Undone<N.DeclareVariable>): N.DeclareVariable;
        flowParseDeclareModule(node: Undone<N.DeclareModule>): N.DeclareModule;
        flowParseDeclareExportDeclaration(node: Undone<N.DeclareExportDeclaration>, insideModule?: boolean | null): N.DeclareExportDeclaration | N.DeclareExportAllDeclaration;
        flowParseDeclareModuleExports(node: Undone<N.DeclareModuleExports>): N.DeclareModuleExports;
        flowParseDeclareTypeAlias(node: Undone<N.DeclareTypeAlias>): N.DeclareTypeAlias;
        flowParseDeclareOpaqueType(node: Undone<N.DeclareOpaqueType>): N.DeclareOpaqueType;
        flowParseDeclareInterface(node: Undone<N.DeclareInterface>): N.DeclareInterface;
        flowParseInterfaceish(node: Undone<N.DeclareClass | N.DeclareInterface | N.InterfaceDeclaration>, isClass: boolean): void;
        flowParseInterfaceExtends(): N.InterfaceExtends;
        flowParseInterface(node: Undone<N.InterfaceDeclaration>): N.InterfaceDeclaration;
        checkNotUnderscore(word: string): void;
        checkReservedType(word: string, startLoc: Position | number, declaration?: boolean): void;
        flowParseRestrictedIdentifierName(liberal?: boolean, declaration?: boolean): string;
        flowParseRestrictedIdentifier(liberal?: boolean, declaration?: boolean): N.Identifier;
        flowParseTypeAlias(node: Undone<N.TypeAlias>): N.TypeAlias;
        flowParseOpaqueType<T extends N.OpaqueType | N.DeclareOpaqueType>(node: Undone<T>, declare: boolean): T;
        flowParseTypeParameterBound(): N.TypeAnnotation | undefined;
        flowParseTypeParameter(requireDefault?: boolean): N.TypeParameter;
        flowParseTypeParameterDeclaration(): N.TypeParameterDeclaration;
        flowInTopLevelContext<T>(cb: () => T): T;
        flowParseTypeParameterInstantiationInExpression(): N.TypeParameterInstantiation | undefined;
        flowParseTypeParameterInstantiation(): N.TypeParameterInstantiation;
        flowParseTypeParameterInstantiationCallOrNew(): N.TypeParameterInstantiation | null;
        flowParseInterfaceType(): N.InterfaceTypeAnnotation;
        flowParseObjectPropertyKey(): N.Identifier | N.NumericLiteral | N.StringLiteral;
        flowParseObjectTypeIndexer(node: Undone<N.ObjectTypeIndexer>, isStatic: boolean, variance?: N.Variance | null): N.ObjectTypeIndexer;
        flowParseObjectTypeInternalSlot(node: Undone<N.ObjectTypeInternalSlot>, isStatic: boolean): N.ObjectTypeInternalSlot;
        flowParseObjectTypeMethodish(node: Undone<N.FunctionTypeAnnotation>): N.FunctionTypeAnnotation;
        flowParseObjectTypeCallProperty(node: Undone<N.ObjectTypeCallProperty>, isStatic: boolean): N.ObjectTypeCallProperty;
        flowParseObjectType({ allowStatic, allowExact, allowSpread, allowProto, allowInexact, }: {
            allowStatic: boolean;
            allowExact: boolean;
            allowSpread: boolean;
            allowProto: boolean;
            allowInexact: boolean;
        }): N.ObjectTypeAnnotation;
        flowParseObjectTypeProperty(node: Undone<N.ObjectTypeProperty | N.ObjectTypeSpreadProperty>, isStatic: boolean, protoStartLoc: Position | undefined | null, variance: N.Variance | undefined | null, kind: N.ObjectTypeProperty["kind"], allowSpread: boolean, allowInexact: boolean): N.ObjectTypeProperty | N.ObjectTypeSpreadProperty | null;
        flowCheckGetterSetterParams(property: Undone<N.ObjectTypeProperty>): void;
        flowObjectTypeSemicolon(): void;
        flowParseQualifiedTypeIdentifier(startLoc?: Position, id?: N.Identifier): N.QualifiedTypeIdentifier | N.Identifier;
        flowParseGenericType(startLoc: Position, id: N.Identifier): N.GenericTypeAnnotation;
        flowParseTypeofType(): N.TypeofTypeAnnotation;
        flowParseTupleType(): N.TupleTypeAnnotation;
        flowParseFunctionTypeParam(first: boolean): N.FunctionTypeParam;
        reinterpretTypeAsFunctionTypeParam(type: N.FlowType): N.FunctionTypeParam;
        flowParseFunctionTypeParams(params?: N.FunctionTypeParam[]): {
            params: N.FunctionTypeParam[];
            rest: N.FunctionTypeParam | undefined | null;
            _this: N.FunctionTypeParam | undefined | null;
        };
        flowIdentToTypeAnnotation(startLoc: Position, node: Undone<N.FlowType>, id: N.Identifier): N.FlowType;
        flowParsePrimaryType(): N.FlowType;
        flowParsePostfixType(): N.FlowType;
        flowParsePrefixType(): N.FlowType;
        flowParseAnonFunctionWithoutParens(): N.FlowType;
        flowParseIntersectionType(): N.FlowType;
        flowParseUnionType(): N.FlowType;
        flowParseType(): N.FlowType;
        flowParseTypeOrImplicitInstantiation(): N.FlowType;
        flowParseTypeAnnotation(): N.TypeAnnotation;
        flowParseTypeAnnotatableIdentifier(): N.Identifier;
        typeCastToParameter(node: N.TypeCastExpression): N.Expression;
        flowParseVariance(): N.Variance | undefined | null;
        parseFunctionBody(node: N.Function, allowExpressionBody?: boolean | null, isMethod?: boolean): void;
        parseFunctionBodyAndFinish<T extends N.Function | N.TSDeclareMethod | N.TSDeclareFunction | N.ClassPrivateMethod>(node: Undone<T>, type: T["type"], isMethod?: boolean): T;
        parseStatementLike(flags: ParseStatementFlag): N.Statement;
        parseExpressionStatement(node: Undone<N.ExpressionStatement>, expr: N.Expression): N.ExpressionStatement;
        shouldParseExportDeclaration(): boolean;
        isExportDefaultSpecifier(): boolean;
        parseExportDefaultExpression(): N.ClassDeclaration | N.EnumDeclaration | N.FunctionDeclaration | N.TSDeclareFunction | N.TSInterfaceDeclaration | N.Expression;
        parseConditional(expr: N.Expression, startLoc: Position, refExpressionErrors?: ExpressionErrors | null): N.Expression;
        tryParseConditionalConsequent(): {
            consequent: N.Expression;
            failed: boolean;
        };
        getArrowLikeExpressions(node: N.Expression, disallowInvalid?: boolean): [N.ArrowFunctionExpression[], N.ArrowFunctionExpression[]];
        finishArrowValidation(node: N.ArrowFunctionExpression): void;
        forwardNoArrowParamsConversionAt<T>(node: Undone<N.Node>, parse: () => T): T;
        parseParenItem<T extends N.Expression | N.RestElement | N.SpreadElement | N.TSTypeCastExpression>(node: T, startLoc: Position): T | N.TypeCastExpression | N.TSTypeCastExpression;
        assertModuleNodeAllowed(node: N.Node): void;
        parseExportDeclaration(node: N.ExportNamedDeclaration): N.ExportNamedDeclaration["declaration"] | undefined;
        eatExportStar(node: Undone<N.Node>): node is Undone<N.ExportNamedDeclaration | N.ExportAllDeclaration>;
        maybeParseExportNamespaceSpecifier(node: Undone<N.ExportNamedDeclaration | N.ExportAllDeclaration>): node is Undone<N.ExportNamedDeclaration>;
        parseClassId(node: N.Class, isStatement: boolean, optionalId?: boolean | null): void;
        parseClassMember(classBody: N.ClassBody, member: any, state: N.ParseClassMemberState): void;
        isIterator(word: string): boolean;
        readIterator(): void;
        getTokenFromCode(code: number): void;
        isAssignable(node: N.Node, isBinding?: boolean): boolean;
        toAssignable(node: N.Node, isLHS?: boolean): void;
        /**
         * turn type casts that we found in function parameter head into type annotated params
         */
        toAssignableListItem(exprList: (N.Expression | N.SpreadElement | N.RestElement)[], index: number, isLHS: boolean): void;
        toReferencedList(exprList: readonly (N.Expression | N.SpreadElement | N.VoidPattern | N.AssignmentPattern | N.ArgumentPlaceholder | N.TSTypeCastExpression | null)[] | readonly (N.Expression | N.RestElement | N.VoidPattern | N.AssignmentPattern | N.TSTypeCastExpression | null)[], isParenthesizedExpr?: boolean): readonly (N.Expression | N.SpreadElement | N.VoidPattern | N.AssignmentPattern | N.ArgumentPlaceholder | N.TSTypeCastExpression | null)[] | readonly (N.Expression | N.RestElement | N.VoidPattern | N.AssignmentPattern | N.TSTypeCastExpression | null)[];
        parseArrayLike(close: TokenType, refExpressionErrors?: ExpressionErrors | null): N.ArrayExpression;
        isValidLVal(type: string, disallowCallExpression: boolean, isParenthesized: boolean, binding: BindingFlag): string | boolean | [string, boolean];
        parseClassProperty(node: N.ClassProperty): N.ClassProperty;
        parseClassPrivateProperty(node: N.ClassPrivateProperty): N.ClassPrivateProperty;
        isClassMethod(): boolean;
        isClassProperty(): boolean;
        isNonstaticConstructor(method: N.ClassMethod | N.ClassProperty): boolean;
        pushClassMethod(classBody: Undone<N.ClassBody>, method: Undone<N.ClassMethod>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowsDirectSuper: boolean): void;
        pushClassPrivateMethod(classBody: Undone<N.ClassBody>, method: Undone<N.ClassPrivateMethod>, isGenerator: boolean, isAsync: boolean): void;
        flowParseClassImplements(): N.ClassImplements;
        parseClassSuper(node: Undone<N.Class>): void;
        checkGetterSetterParams(method: Undone<N.ObjectMethod | N.ClassMethod>): void;
        parsePropertyNamePrefixOperator(node: Undone<N.ObjectOrClassMember | N.ClassMember>): void;
        parseObjPropValue<T extends N.ObjectMember>(prop: Undone<T>, startLoc: Position | undefined | null, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean, refExpressionErrors?: ExpressionErrors | null): T;
        parseFunctionParamType<T extends N.Pattern | N.Identifier | N.RestElement>(param: T): T;
        parseMaybeDefault<P extends N.Pattern | N.Identifier>(startLoc?: Position | null, left?: P | null): P | N.AssignmentPattern;
        parseImportSpecifierLocal<T extends N.ImportSpecifier | N.ImportDefaultSpecifier | N.ImportNamespaceSpecifier>(node: N.ImportDeclaration, specifier: Undone<T>, type: T["type"]): void;
        isPotentialImportPhase(isExport: boolean): boolean;
        applyImportPhase(node: Undone<N.ImportDeclaration | N.ExportNamedDeclaration>, isExport: boolean, phase: string | null, loc?: number): void;
        parseImportSpecifier(specifier: any, importedIsString: boolean, isInTypeOnlyImport: boolean, isMaybeTypeOnly: boolean, bindingType: BindingFlag | undefined): N.ImportSpecifier;
        parseBindingAtom(): N.ArrayPattern | N.Identifier | N.ObjectPattern | N.VoidPattern;
        parseFunctionParams(node: Undone<N.Function>, isConstructor: boolean): void;
        parseVarId(decl: N.VariableDeclarator, kind: "var" | "let" | "const" | "using" | "await using"): void;
        parseAsyncArrowFromCallExpression(node: N.ArrowFunctionExpression, call: N.CallExpression): N.ArrowFunctionExpression;
        shouldParseAsyncArrow(): boolean;
        parseMaybeAssign(refExpressionErrors: ExpressionErrors | null | undefined, isParenItem: boolean | undefined): N.Expression | N.TSTypeCastExpression;
        parseMaybeAssign(refExpressionErrors?: ExpressionErrors | null): N.Expression;
        parseArrow(node: Undone<N.ArrowFunctionExpression>): Undone<N.ArrowFunctionExpression> | undefined | null;
        shouldParseArrow(params: N.Node[]): boolean;
        setArrowFunctionParameters(node: Undone<N.ArrowFunctionExpression>, params: (N.Expression | N.SpreadElement)[] | (N.Expression | N.RestElement)[]): void;
        checkParams(node: N.Function, allowDuplicates: boolean, isArrowFunction?: boolean | null, strictModeChanged?: boolean): void;
        parseParenAndDistinguishExpression(canStartArrow: boolean): N.Expression;
        parseSubscripts(base: N.Expression | N.Super | N.Import, startLoc: Position, noCalls?: false | null): N.Expression;
        parseSubscripts(base: N.Expression | N.Super | N.Import, startLoc: Position, noCalls: true): N.Expression | N.Super | N.Import;
        parseSubscripts(base: N.Expression | N.Super | N.Import, startLoc: Position, noCalls?: boolean | null): N.Expression | N.Super | N.Import;
        parseSubscript(base: N.Expression, startLoc: Position, noCalls: boolean | undefined | null, subscriptState: N.ParseSubscriptState): N.Expression;
        parseNewCallee(node: N.NewExpression): void;
        parseAsyncArrowWithTypeParameters(startLoc: Position): N.ArrowFunctionExpression | undefined | null;
        readToken_mult_modulo(code: number): void;
        readToken_pipe_amp(code: number): void;
        parseTopLevel(file: N.File, program: N.Program): N.File;
        skipBlockComment(): N.CommentBlock | undefined;
        skipFlowComment(): number | false;
        hasFlowCommentCompletion(): void;
        flowEnumErrorBooleanMemberNotInitialized(loc: Position | number, names: {
            enumName: string;
            memberName: string;
        }): void;
        flowEnumErrorInvalidMemberInitializer(loc: Position | number, enumContext: EnumContext): import("../../parse-error.ts").ParseError;
        flowEnumErrorNumberMemberNotInitialized(loc: Position | number, details: {
            enumName: string;
            memberName: string;
        }): void;
        flowEnumErrorStringMemberInconsistentlyInitialized(node: N.Node, details: {
            enumName: string;
        }): void;
        flowEnumMemberInit(): EnumMemberInit;
        flowEnumMemberRaw(): {
            id: N.Identifier;
            init: EnumMemberInit;
        };
        flowEnumCheckExplicitTypeMismatch(loc: number, context: EnumContext, expectedType: EnumExplicitType): void;
        flowEnumMembers({ enumName, explicitType, }: {
            enumName: string;
            explicitType: EnumExplicitType;
        }): {
            members: {
                booleanMembers: N.EnumBooleanMember[];
                numberMembers: N.EnumNumberMember[];
                stringMembers: N.EnumStringMember[];
                defaultedMembers: N.EnumDefaultedMember[];
            };
            hasUnknownMembers: boolean;
        };
        flowEnumStringMembers(initializedMembers: N.EnumStringMember[], defaultedMembers: N.EnumDefaultedMember[], { enumName, }: {
            enumName: string;
        }): N.EnumDefaultedMember[] | N.EnumStringMember[];
        flowEnumParseExplicitType({ enumName, }: {
            enumName: string;
        }): EnumExplicitType;
        flowEnumBody(node: Undone<N.EnumBody>, id: N.Identifier): N.EnumBody;
        flowParseEnumDeclaration(node: Undone<N.EnumDeclaration>): N.EnumDeclaration;
        jsxParseOpeningElementAfterName(node: N.JSXOpeningElement): N.JSXOpeningElement;
        isLookaheadToken_lt(): boolean;
        reScan_lt_gt(): void;
        reScan_lt(): number;
        maybeUnwrapTypeCastExpression(node: N.Node): N.AnyTypeAnnotation | N.ArgumentPlaceholder | N.ArrayPattern | N.ArrayTypeAnnotation | N.AssignmentPattern | N.BigIntLiteralTypeAnnotation | N.BlockStatement | N.BooleanLiteralTypeAnnotation | N.BooleanTypeAnnotation | N.BreakStatement | N.CatchClause | N.ClassAccessorPropertyComputed | N.ClassAccessorPropertyNonComputed | N.ClassBody | N.ClassDeclaration | N.ClassImplements | N.ClassMethodComputed | N.ClassMethodNonComputed | N.ClassPrivateMethod | N.ClassPrivateProperty | N.ClassPropertyComputed | N.ClassPropertyNonComputed | N.ContinueStatement | N.DebuggerStatement | N.DeclareClass | N.DeclareExportAllDeclaration | N.DeclareExportDeclaration | N.DeclareFunction | N.DeclareInterface | N.DeclareModule | N.DeclareModuleExports | N.DeclareOpaqueType | N.DeclareTypeAlias | N.DeclareVariable | N.DeclaredPredicate | N.Decorator | N.Directive | N.DirectiveLiteral | N.DoWhileStatement | N.EmptyStatement | N.EmptyTypeAnnotation | N.EnumBooleanBody | N.EnumBooleanMember | N.EnumDeclaration | N.EnumDefaultedMember | N.EnumNumberBody | N.EnumNumberMember | N.EnumStringBody | N.EnumStringMember | N.EnumSymbolBody | N.ExistsTypeAnnotation | N.ExportAllDeclaration | N.ExportDefaultDeclaration | N.ExportDefaultSpecifier | N.ExportNamedDeclaration | N.ExportNamespaceSpecifier | N.ExportSpecifier | N.ExpressionStatement | N.File | N.ForInStatement | N.ForOfStatement | N.ForStatement | N.FunctionDeclaration | N.FunctionTypeAnnotation | N.FunctionTypeParam | N.GenericTypeAnnotation | N.IfStatement | N.Import | N.ImportAttribute | N.ImportDeclaration | N.ImportDefaultSpecifier | N.ImportNamespaceSpecifier | N.ImportSpecifier | N.IndexedAccessType | N.InferredPredicate | N.InterfaceDeclaration | N.InterfaceExtends | N.InterfaceTypeAnnotation | N.InterpreterDirective | N.IntersectionTypeAnnotation | N.JSXAttribute | N.JSXClosingElement | N.JSXClosingFragment | N.JSXEmptyExpression | N.JSXExpressionContainer | N.JSXIdentifier | N.JSXMemberExpression | N.JSXNamespacedName | N.JSXOpeningElement | N.JSXOpeningFragment | N.JSXSpreadAttribute | N.JSXSpreadChild | N.JSXText | N.LabeledStatement | N.MixedTypeAnnotation | N.NullLiteralTypeAnnotation | N.NullableTypeAnnotation | N.NumberLiteral | N.NumberLiteralTypeAnnotation | N.NumberTypeAnnotation | N.ObjectMethodComputed | N.ObjectMethodNonComputed | N.ObjectPattern | N.ObjectPropertyComputed | N.ObjectPropertyNonComputed | N.ObjectTypeAnnotation | N.ObjectTypeCallProperty | N.ObjectTypeIndexer | N.ObjectTypeInternalSlot | N.ObjectTypeProperty | N.ObjectTypeSpreadProperty | N.OpaqueType | N.OptionalIndexedAccessType | import("@babel/types").Placeholder | N.PrivateName | N.Program | N.QualifiedTypeIdentifier | N.RegexLiteral | N.RestElement | N.RestProperty | N.ReturnStatement | N.SpreadElement | N.SpreadProperty | N.StaticBlock | N.StringLiteralTypeAnnotation | N.StringTypeAnnotation | N.Super | N.SwitchCase | N.SwitchStatement | N.SymbolTypeAnnotation | N.TSAnyKeyword | N.TSArrayType | N.TSBigIntKeyword | N.TSBooleanKeyword | N.TSCallSignatureDeclaration | N.TSClassImplements | N.TSConditionalType | N.TSConstructSignatureDeclaration | N.TSConstructorType | N.TSDeclareFunction | N.TSDeclareMethodComputed | N.TSDeclareMethodNonComputed | N.TSEnumBody | N.TSEnumDeclaration | N.TSEnumMember | N.TSExportAssignment | N.TSExternalModuleReference | N.TSFunctionType | N.TSImportEqualsDeclaration | N.TSImportType | N.TSIndexSignature | N.TSIndexedAccessType | N.TSInferType | N.TSInterfaceBody | N.TSInterfaceDeclaration | N.TSInterfaceHeritage | N.TSIntersectionType | N.TSIntrinsicKeyword | N.TSLiteralType | N.TSMappedType | N.TSMethodSignature | N.TSModuleBlock | N.TSModuleDeclaration | N.TSNamedTupleMember | N.TSNamespaceExportDeclaration | N.TSNeverKeyword | N.TSNullKeyword | N.TSNumberKeyword | N.TSObjectKeyword | N.TSOptionalType | N.TSParameterProperty | N.TSParenthesizedType | N.TSPropertySignature | N.TSQualifiedName | N.TSRestType | N.TSStringKeyword | N.TSSymbolKeyword | N.TSTemplateLiteralType | N.TSThisType | N.TSTupleType | N.TSTypeAliasDeclaration | N.TSTypeAnnotation | N.TSTypeLiteral | N.TSTypeOperator | N.TSTypeParameter | N.TSTypeParameterDeclaration | N.TSTypeParameterInstantiation | N.TSTypePredicate | N.TSTypeQuery | N.TSTypeReference | N.TSUndefinedKeyword | N.TSUnionType | N.TSUnknownKeyword | N.TSVoidKeyword | N.TemplateElement | N.ThisTypeAnnotation | N.ThrowStatement | N.TryStatement | N.TupleTypeAnnotation | N.TypeAlias | N.TypeAnnotation | N.TypeParameter | N.TypeParameterDeclaration | N.TypeParameterInstantiation | N.TypeofTypeAnnotation | N.UnionTypeAnnotation | N.V8IntrinsicIdentifier | N.VariableDeclaration | N.VariableDeclarator | N.Variance | N.VoidPattern | N.VoidTypeAnnotation | N.WhileStatement | N.WithStatement | N.EstreeAccessorProperty | N.EstreeMethodDefinition | N.EstreePropertyDefinition | N.EstreeTSAbstractMethodDefinition | N.EstreeTSAbstractPropertyDefinition | N.EstreeTSAbstractAccessorProperty | N.EstreeChainExpression | N.EstreeLiteral | N.EstreeTSEmptyBodyFunctionExpression | N.EstreePrivateIdentifier | N.EstreeProperty | N.TSTypeCastExpression | N.Expression;
        parse(): import("../../index.ts").ParseResult<N.File>;
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
        parseStatementContent(this: Parser, flags: ParseStatementFlag, decorators?: N.Decorator[] | null): N.Statement;
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
        registerFunctionStatementId(node: N.NormalFunction): void;
        parseClass<T extends N.Class>(this: Parser, node: Undone<T>, isStatement: boolean, optionalId?: boolean): T;
        nameIsConstructor(key: N.Expression | N.PrivateName): boolean;
        parseClassBody(this: Parser, hadSuperClass: boolean, oldStrict: boolean): N.ClassBody;
        parseClassMemberFromModifier(this: Parser, classBody: Undone<N.ClassBody>, member: Undone<N.ClassMember>): boolean;
        parseClassMemberWithIsStatic(this: Parser, classBody: Undone<N.ClassBody>, member: Undone<N.ClassMember>, state: N.ParseClassMemberState, isStatic: boolean): void;
        parseClassElementName(this: Parser, member: Undone<N.ClassMember>): N.Expression | N.Identifier | N.PrivateName;
        parseClassStaticBlock(this: Parser, classBody: Undone<N.ClassBody>, member: Undone<N.StaticBlock & {
            decorators?: N.Decorator[];
        }>): void;
        pushClassProperty(this: Parser, classBody: Undone<N.ClassBody>, prop: Undone<N.ClassProperty>): void;
        pushClassPrivateProperty(this: Parser, classBody: Undone<N.ClassBody>, prop: Undone<N.ClassPrivateProperty>): void;
        pushClassAccessorProperty(this: Parser, classBody: Undone<N.ClassBody>, prop: Undone<N.ClassAccessorProperty>, isPrivate: boolean): void;
        declareClassPrivateMethodInScope(node: Undone<N.ClassPrivateMethod | N.TSDeclareMethod>, kind: number): void;
        parsePostMemberNameModifiers(methodOrProp: Undone<N.ClassMethod | N.ClassProperty>): void;
        parseClassAccessorProperty(this: Parser, node: Undone<N.ClassAccessorProperty>): N.ClassAccessorProperty;
        parseInitializer(this: Parser, node: Undone<N.ClassProperty | N.ClassPrivateProperty | N.ClassAccessorProperty>): void;
        parseExport(this: Parser, node: Undone<N.ExportDefaultDeclaration | N.ExportAllDeclaration | N.ExportNamedDeclaration>, decorators: N.Decorator[] | null | undefined): N.AnyExport;
        maybeParseExportDefaultSpecifier(node: Undone<N.ExportDefaultDeclaration | N.ExportAllDeclaration | N.ExportNamedDeclaration>, maybeDefaultIdentifier: N.Identifier | null): node is Undone<N.ExportNamedDeclaration>;
        maybeParseExportNamedSpecifiers(node: Undone<N.Node>): node is Undone<N.ExportNamedDeclaration>;
        maybeParseExportDeclaration(this: Parser, node: Undone<N.ExportNamedDeclaration>): boolean;
        isAsyncFunction(): boolean;
        parseExportFrom(this: Parser, node: Undone<N.ExportNamedDeclaration | N.ExportAllDeclaration>, expect?: boolean): void;
        checkNamedExport(node: Undone<N.ExportNamedDeclaration>, isFrom?: boolean): void;
        checkDeclaration(node: N.Identifier | N.Pattern | N.RestElement | N.ObjectProperty): void;
        checkDuplicateExports(node: Undone<N.Identifier | N.StringLiteral | N.ExportNamedDeclaration | N.ExportSpecifier | N.ExportDefaultSpecifier>, exportName: string): void;
        parseExportSpecifiers(isInTypeExport: boolean): N.ExportSpecifier[];
        parseExportSpecifier(node: Undone<N.ExportSpecifier>, isString: boolean, isInTypeExport: boolean, isMaybeTypeOnly: boolean): N.ExportSpecifier;
        parseModuleExportName(): N.StringLiteral | N.Identifier;
        checkImportPhase(node: Undone<N.ImportDeclaration>): void;
        parseMaybeImportPhase(node: Undone<N.ImportDeclaration | N.TSImportEqualsDeclaration>, isExport: boolean): N.Identifier | null;
        isPrecedingIdImportPhase(phase: string): boolean;
        parseImport(this: Parser, node: Undone<N.ImportDeclaration>): N.AnyImport;
        parseImportSpecifiersAndAfter(this: Parser, node: Undone<N.ImportDeclaration>, maybeDefaultIdentifier: N.Identifier | null): N.ImportDeclaration;
        parseImportSourceAndAttributes(this: Parser, node: Undone<N.ImportDeclaration>): N.ImportDeclaration;
        parseImportSource(this: Parser): N.StringLiteral;
        finishImportSpecifier<T extends N.ImportSpecifier | N.ImportDefaultSpecifier | N.ImportNamespaceSpecifier>(specifier: Undone<T>, type: T["type"], bindingType?: BindingFlag): T;
        parseImportAttributes(): N.ImportAttribute[];
        maybeParseImportAttributes(node: Undone<N.ImportDeclaration | N.ExportNamedDeclaration | N.ExportAllDeclaration>): void;
        maybeParseDefaultImportSpecifier(node: Undone<N.ImportDeclaration>, maybeDefaultIdentifier: N.Identifier | null): boolean;
        maybeParseStarImportSpecifier(node: Undone<N.ImportDeclaration>): boolean;
        parseNamedImportSpecifiers(node: Undone<N.ImportDeclaration>): void;
        isThisParam(param: N.Pattern | N.Identifier | N.TSParameterProperty | N.RestElement): boolean;
        checkProto(prop: N.ObjectMember | N.SpreadElement, sawProto: boolean, refExpressionErrors?: ExpressionErrors | null): boolean;
        shouldExitDescending(expr: N.Expression | N.PrivateName | N.Super | N.Import): expr is N.ArrowFunctionExpression;
        getExpression(this: Parser): N.Expression & N.ParserOutput;
        parseExpression(this: Parser, disallowIn?: boolean, refExpressionErrors?: ExpressionErrors): N.Expression;
        parseExpressionBase(this: Parser, refExpressionErrors?: ExpressionErrors): N.Expression;
        parseMaybeAssignDisallowIn(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.Expression;
        parseMaybeAssignAllowIn(this: Parser, refExpressionErrors: ExpressionErrors | null | undefined, isParenItem: boolean | undefined): N.Expression | N.TSTypeCastExpression;
        parseMaybeAssignAllowIn(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.Expression;
        setOptionalParametersError(refExpressionErrors: ExpressionErrors): void;
        parseMaybeConditional(this: Parser, refExpressionErrors: ExpressionErrors): N.Expression;
        parseMaybeUnaryOrPrivate(this: Parser, refExpressionErrors?: ExpressionErrors): N.Expression | N.PrivateName;
        parseExprOps(this: Parser, refExpressionErrors: ExpressionErrors): N.Expression;
        parseExprOp(this: Parser, left: N.Expression | N.PrivateName, leftStartLoc: Position, minPrec: number): N.Expression;
        parseExprOpRightExpr(this: Parser, op: TokenType, prec: number): N.Expression;
        parseExprOpBaseRightExpr(this: Parser, op: TokenType, prec: number): N.Expression;
        parseHackPipeBody(this: Parser): N.Expression;
        checkExponentialAfterUnary(node: N.AwaitExpression | Undone<N.UnaryExpression>): void;
        parseMaybeUnary(this: Parser, refExpressionErrors?: ExpressionErrors | null, sawUnary?: boolean): N.Expression;
        parseUpdate(this: Parser, node: Undone<N.UpdateExpression>, update: boolean, refExpressionErrors?: ExpressionErrors | null): N.Expression;
        parseExprSubscripts(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.Expression;
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
        parseTemplateSubstitution(this: Parser): N.Expression | N.TSType;
        parseObjectLike(close: TokenType, isPattern: true, refExpressionErrors?: ExpressionErrors | null): N.ObjectPattern;
        parseObjectLike(close: TokenType, isPattern: false, refExpressionErrors?: ExpressionErrors | null): N.ObjectExpression;
        addTrailingCommaExtraToNode(node: Undone<N.Node>): void;
        maybeAsyncOrAccessorProp(prop: Undone<N.ObjectProperty | N.ObjectMethod>): prop is typeof prop & {
            key: N.Identifier;
        };
        parsePropertyDefinition(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.ObjectMember | N.SpreadElement;
        getGetterSetterExpectedParamCount(method: Undone<N.ObjectMethod | N.ClassMethod>): number;
        getObjectOrClassMethodParams(method: Undone<N.ObjectMethod | N.ClassMethod>): (N.TSParameterProperty | N.FunctionParameter)[] | N.FunctionParameter[];
        parseObjectMethod(this: Parser, prop: Undone<N.ObjectMethod>, isGenerator: boolean, isAsync: boolean, isPattern: boolean, isAccessor: boolean): N.ObjectMethod | undefined | null;
        parseObjectProperty(this: Parser, prop: Undone<N.ObjectProperty>, startLoc: Position | undefined | null, isPattern: boolean, refExpressionErrors?: ExpressionErrors | null): N.ObjectProperty | undefined | null;
        finishObjectProperty(node: Undone<N.ObjectProperty>): N.ObjectProperty;
        parsePropertyName(this: Parser, prop: Undone<N.ObjectOrClassMember | N.ClassMember> | N.TSPropertySignature | N.TSMethodSignature, refExpressionErrors?: ExpressionErrors | null): void;
        initFunction(node: Undone<N.Function>, isAsync: boolean): void;
        parseMethod<T extends N.ObjectMethod | N.ClassMethod | N.ClassPrivateMethod>(this: Parser, node: Undone<T>, isGenerator: boolean, isAsync: boolean, isConstructor: boolean, allowDirectSuper: boolean, type: T["type"], inClassScope?: boolean): T;
        parseArrowExpression(this: Parser, node: Undone<N.ArrowFunctionExpression>, params: (N.Expression | N.SpreadElement | N.VoidPattern | N.AssignmentPattern | N.ArgumentPlaceholder | N.TSTypeCastExpression)[] | (N.Expression | N.RestElement | N.VoidPattern | N.AssignmentPattern | N.ArgumentPlaceholder | N.TSTypeCastExpression)[] | null | undefined, isAsync: boolean, trailingCommaLoc?: Position | null): N.ArrowFunctionExpression;
        isSimpleParameter(node: N.FunctionParameter | N.TSParameterProperty): boolean;
        isSimpleParamList(params: readonly (N.FunctionParameter | N.TSParameterProperty)[]): boolean;
        parseExprList(this: Parser, close: TokenType, allowEmpty?: boolean, refExpressionErrors?: ExpressionErrors | null, nodeForExtra?: Undone<N.Node> | null): (N.Expression | null)[];
        parseExprListItem(this: Parser, close: TokenType, allowEmpty?: boolean, refExpressionErrors?: ExpressionErrors | null, allowPlaceholder?: boolean | null): N.Expression | null;
        parseExprListItem(this: Parser, close: TokenType, allowEmpty?: false, refExpressionErrors?: ExpressionErrors | null, allowPlaceholder?: boolean | null): N.Expression;
        parseIdentifier(liberal?: boolean): N.Identifier;
        createIdentifier(node: Undone<N.Identifier>, name: string): N.Identifier;
        createIdentifierAt(node: Undone<N.Identifier>, name: string, endLoc: Position): N.Identifier;
        parseIdentifierName(liberal?: boolean): string;
        checkReservedWord(word: string, startLoc: number, checkKeywords: boolean, isBinding: boolean): void;
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
        toAssignableObjectExpressionProp(prop: N.Node, isLast: boolean, isLHS: boolean): void;
        toAssignableList(exprList: (N.Expression | N.SpreadElement | N.RestElement | N.VoidPattern | N.AssignmentPattern | N.ArgumentPlaceholder | N.TSTypeCastExpression | null)[], trailingCommaLoc: Position | undefined | null, isLHS: boolean): void;
        parseSpread(this: Parser, refExpressionErrors?: ExpressionErrors | null): N.SpreadElement;
        parseRestBinding(this: Parser): N.RestElement;
        parseBindingList(this: Parser, close: TokenType, closeCharCode: (typeof charCodes)[keyof typeof charCodes], flags: import("../../parser/lval.ts").ParseBindingListFlags.ALLOW_EMPTY): (N.Pattern | N.RestElement | null)[];
        parseBindingList(this: Parser, close: TokenType, closeCharCode: (typeof charCodes)[keyof typeof charCodes], flags: import("../../parser/lval.ts").ParseBindingListFlags.IS_FUNCTION_PARAMS): (N.Pattern | N.RestElement | N.TSParameterProperty)[];
        parseBindingRestProperty(this: Parser, prop: Undone<N.RestElement>): N.RestElement;
        parseBindingProperty(this: Parser): N.AssignmentProperty | N.RestElement;
        parseBindingElement(this: Parser, flags: import("../../parser/lval.ts").ParseBindingListFlags, decorators: N.Decorator[]): N.Pattern | N.Identifier | N.TSParameterProperty;
        isOptionalMemberExpression(expression: N.Node): boolean;
        checkLVal(expression: N.Expression | N.ObjectMember | N.RestElement | N.Pattern | N.TSParameterProperty | N.TSTypeCastExpression, ancestor: import("../../parse-error.ts").LValAncestor, binding?: BindingFlag, checkClashes?: Set<string> | false, strictModeChanged?: boolean, hasParenthesizedAncestor?: boolean, disallowCallExpression?: boolean): void;
        checkIdentifier(at: N.Identifier, bindingType: BindingFlag, strictModeChanged?: boolean): void;
        declareNameFromIdentifier(identifier: N.Identifier, binding: BindingFlag): void;
        checkToRestConversion(node: N.Node, allowPattern: boolean): void;
        checkCommaAfterRest(close: (typeof charCodes)[keyof typeof charCodes]): boolean;
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
        tryParse<T extends N.Node | readonly N.Node[] | null>(fn: (abort: (node?: T) => never) => T, oldState?: import("../../tokenizer/state.ts").default): {
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
            failState: import("../../tokenizer/state.ts").default;
        } | {
            node: T | null;
            error: null;
            thrown: false;
            aborted: true;
            failState: import("../../tokenizer/state.ts").default;
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
        createLookaheadState(state: import("../../tokenizer/state.ts").default): import("../../tokenizer/state.ts").LookaheadState;
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
        skipLineComment(startSkip: number): N.CommentLine | undefined;
        skipSpace(): void;
        replaceToken(type: TokenType): void;
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
        processComment(node: N.Node): void;
        finalizeComment(commentWS: import("../../parser/comments.ts").CommentWhitespace): void;
        finalizeRemainingComments(): void;
        resetPreviousNodeTrailingComments(node: N.Node): void;
        takeSurroundingComments(node: N.Node, start: number, end: number): void;
        options: import("../../options.ts").Options;
        optionFlags: import("../../options.ts").OptionFlags;
        inModule: boolean;
        scope: import("../../util/scope.ts").default<any>;
        classScope: import("../../util/class-scope.ts").default;
        prodParam: import("../../util/production-parameter.ts").default;
        expressionScope: import("../../util/expression-scope.ts").default;
        plugins: import("../../parser/index.ts").PluginsMap;
        filename: string | undefined | null;
        startIndex: number;
        exportedIdentifiers: Set<string>;
        sawUnambiguousESM: boolean;
        ambiguousScriptDifferentAst: boolean;
        state: import("../../tokenizer/state.ts").default;
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
export default _default_1;
//# sourceMappingURL=index.d.ts.map