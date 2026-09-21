import shallowEqual from "../../utils/shallowEqual.js";
import isType from "../../utils/isType.js";
import deprecationWarning from "../../utils/deprecationWarning.js";
export function isArrayExpression(node, opts) {
  return isType("ArrayExpression", node, opts);
}
export function isAssignmentExpression(node, opts) {
  return isType("AssignmentExpression", node, opts);
}
export function isBinaryExpression(node, opts) {
  return isType("BinaryExpression", node, opts);
}
export function isInterpreterDirective(node, opts) {
  return isType("InterpreterDirective", node, opts);
}
export function isDirective(node, opts) {
  return isType("Directive", node, opts);
}
export function isDirectiveLiteral(node, opts) {
  return isType("DirectiveLiteral", node, opts);
}
export function isBlockStatement(node, opts) {
  return isType("BlockStatement", node, opts);
}
export function isBreakStatement(node, opts) {
  return isType("BreakStatement", node, opts);
}
export function isCallExpression(node, opts) {
  return isType("CallExpression", node, opts);
}
export function isCatchClause(node, opts) {
  return isType("CatchClause", node, opts);
}
export function isConditionalExpression(node, opts) {
  return isType("ConditionalExpression", node, opts);
}
export function isContinueStatement(node, opts) {
  return isType("ContinueStatement", node, opts);
}
export function isDebuggerStatement(node, opts) {
  return isType("DebuggerStatement", node, opts);
}
export function isDoWhileStatement(node, opts) {
  return isType("DoWhileStatement", node, opts);
}
export function isEmptyStatement(node, opts) {
  return isType("EmptyStatement", node, opts);
}
export function isExpressionStatement(node, opts) {
  return isType("ExpressionStatement", node, opts);
}
export function isFile(node, opts) {
  return isType("File", node, opts);
}
export function isForInStatement(node, opts) {
  return isType("ForInStatement", node, opts);
}
export function isForStatement(node, opts) {
  return isType("ForStatement", node, opts);
}
export function isFunctionDeclaration(node, opts) {
  return isType("FunctionDeclaration", node, opts);
}
export function isFunctionExpression(node, opts) {
  return isType("FunctionExpression", node, opts);
}
export function isIdentifier(node, opts) {
  return isType("Identifier", node, opts);
}
export function isIfStatement(node, opts) {
  return isType("IfStatement", node, opts);
}
export function isLabeledStatement(node, opts) {
  return isType("LabeledStatement", node, opts);
}
export function isStringLiteral(node, opts) {
  return isType("StringLiteral", node, opts);
}
export function isNumericLiteral(node, opts) {
  return isType("NumericLiteral", node, opts);
}
export function isNullLiteral(node, opts) {
  return isType("NullLiteral", node, opts);
}
export function isBooleanLiteral(node, opts) {
  return isType("BooleanLiteral", node, opts);
}
export function isRegExpLiteral(node, opts) {
  return isType("RegExpLiteral", node, opts);
}
export function isLogicalExpression(node, opts) {
  return isType("LogicalExpression", node, opts);
}
export function isMemberExpression(node, opts) {
  return isType("MemberExpression", node, opts);
}
export function isNewExpression(node, opts) {
  return isType("NewExpression", node, opts);
}
export function isProgram(node, opts) {
  return isType("Program", node, opts);
}
export function isObjectExpression(node, opts) {
  return isType("ObjectExpression", node, opts);
}
export function isObjectMethod(node, opts) {
  return isType("ObjectMethod", node, opts);
}
export function isObjectProperty(node, opts) {
  return isType("ObjectProperty", node, opts);
}
export function isRestElement(node, opts) {
  return isType("RestElement", node, opts);
}
export function isReturnStatement(node, opts) {
  return isType("ReturnStatement", node, opts);
}
export function isSequenceExpression(node, opts) {
  return isType("SequenceExpression", node, opts);
}
export function isParenthesizedExpression(node, opts) {
  return isType("ParenthesizedExpression", node, opts);
}
export function isSwitchCase(node, opts) {
  return isType("SwitchCase", node, opts);
}
export function isSwitchStatement(node, opts) {
  return isType("SwitchStatement", node, opts);
}
export function isThisExpression(node, opts) {
  return isType("ThisExpression", node, opts);
}
export function isThrowStatement(node, opts) {
  return isType("ThrowStatement", node, opts);
}
export function isTryStatement(node, opts) {
  return isType("TryStatement", node, opts);
}
export function isUnaryExpression(node, opts) {
  return isType("UnaryExpression", node, opts);
}
export function isUpdateExpression(node, opts) {
  return isType("UpdateExpression", node, opts);
}
export function isVariableDeclaration(node, opts) {
  return isType("VariableDeclaration", node, opts);
}
export function isVariableDeclarator(node, opts) {
  return isType("VariableDeclarator", node, opts);
}
export function isWhileStatement(node, opts) {
  return isType("WhileStatement", node, opts);
}
export function isWithStatement(node, opts) {
  return isType("WithStatement", node, opts);
}
export function isAssignmentPattern(node, opts) {
  return isType("AssignmentPattern", node, opts);
}
export function isArrayPattern(node, opts) {
  return isType("ArrayPattern", node, opts);
}
export function isArrowFunctionExpression(node, opts) {
  return isType("ArrowFunctionExpression", node, opts);
}
export function isClassBody(node, opts) {
  return isType("ClassBody", node, opts);
}
export function isClassExpression(node, opts) {
  return isType("ClassExpression", node, opts);
}
export function isClassDeclaration(node, opts) {
  return isType("ClassDeclaration", node, opts);
}
export function isExportAllDeclaration(node, opts) {
  return isType("ExportAllDeclaration", node, opts);
}
export function isExportDefaultDeclaration(node, opts) {
  return isType("ExportDefaultDeclaration", node, opts);
}
export function isExportNamedDeclaration(node, opts) {
  return isType("ExportNamedDeclaration", node, opts);
}
export function isExportSpecifier(node, opts) {
  return isType("ExportSpecifier", node, opts);
}
export function isForOfStatement(node, opts) {
  return isType("ForOfStatement", node, opts);
}
export function isImportDeclaration(node, opts) {
  return isType("ImportDeclaration", node, opts);
}
export function isImportDefaultSpecifier(node, opts) {
  return isType("ImportDefaultSpecifier", node, opts);
}
export function isImportNamespaceSpecifier(node, opts) {
  return isType("ImportNamespaceSpecifier", node, opts);
}
export function isImportSpecifier(node, opts) {
  return isType("ImportSpecifier", node, opts);
}
export function isMetaProperty(node, opts) {
  return isType("MetaProperty", node, opts);
}
export function isClassMethod(node, opts) {
  return isType("ClassMethod", node, opts);
}
export function isObjectPattern(node, opts) {
  return isType("ObjectPattern", node, opts);
}
export function isSpreadElement(node, opts) {
  return isType("SpreadElement", node, opts);
}
export function isSuper(node, opts) {
  return isType("Super", node, opts);
}
export function isTaggedTemplateExpression(node, opts) {
  return isType("TaggedTemplateExpression", node, opts);
}
export function isTemplateElement(node, opts) {
  return isType("TemplateElement", node, opts);
}
export function isTemplateLiteral(node, opts) {
  return isType("TemplateLiteral", node, opts);
}
export function isYieldExpression(node, opts) {
  return isType("YieldExpression", node, opts);
}
export function isAwaitExpression(node, opts) {
  return isType("AwaitExpression", node, opts);
}
export function isImportExpression(node, opts) {
  return isType("ImportExpression", node, opts);
}
export function isImport(node, opts) {
  return isType("Import", node, opts);
}
export function isBigIntLiteral(node, opts) {
  return isType("BigIntLiteral", node, opts);
}
export function isExportNamespaceSpecifier(node, opts) {
  return isType("ExportNamespaceSpecifier", node, opts);
}
export function isOptionalMemberExpression(node, opts) {
  return isType("OptionalMemberExpression", node, opts);
}
export function isOptionalCallExpression(node, opts) {
  return isType("OptionalCallExpression", node, opts);
}
export function isClassProperty(node, opts) {
  return isType("ClassProperty", node, opts);
}
export function isClassPrivateProperty(node, opts) {
  return isType("ClassPrivateProperty", node, opts);
}
export function isClassPrivateMethod(node, opts) {
  return isType("ClassPrivateMethod", node, opts);
}
export function isPrivateName(node, opts) {
  return isType("PrivateName", node, opts);
}
export function isStaticBlock(node, opts) {
  return isType("StaticBlock", node, opts);
}
export function isImportAttribute(node, opts) {
  return isType("ImportAttribute", node, opts);
}
export function isAnyTypeAnnotation(node, opts) {
  return isType("AnyTypeAnnotation", node, opts);
}
export function isArrayTypeAnnotation(node, opts) {
  return isType("ArrayTypeAnnotation", node, opts);
}
export function isBooleanTypeAnnotation(node, opts) {
  return isType("BooleanTypeAnnotation", node, opts);
}
export function isBooleanLiteralTypeAnnotation(node, opts) {
  return isType("BooleanLiteralTypeAnnotation", node, opts);
}
export function isNullLiteralTypeAnnotation(node, opts) {
  return isType("NullLiteralTypeAnnotation", node, opts);
}
export function isClassImplements(node, opts) {
  return isType("ClassImplements", node, opts);
}
export function isDeclareClass(node, opts) {
  return isType("DeclareClass", node, opts);
}
export function isDeclareFunction(node, opts) {
  return isType("DeclareFunction", node, opts);
}
export function isDeclareInterface(node, opts) {
  return isType("DeclareInterface", node, opts);
}
export function isDeclareModule(node, opts) {
  return isType("DeclareModule", node, opts);
}
export function isDeclareModuleExports(node, opts) {
  return isType("DeclareModuleExports", node, opts);
}
export function isDeclareTypeAlias(node, opts) {
  return isType("DeclareTypeAlias", node, opts);
}
export function isDeclareOpaqueType(node, opts) {
  return isType("DeclareOpaqueType", node, opts);
}
export function isDeclareVariable(node, opts) {
  return isType("DeclareVariable", node, opts);
}
export function isDeclareExportDeclaration(node, opts) {
  return isType("DeclareExportDeclaration", node, opts);
}
export function isDeclareExportAllDeclaration(node, opts) {
  return isType("DeclareExportAllDeclaration", node, opts);
}
export function isDeclaredPredicate(node, opts) {
  return isType("DeclaredPredicate", node, opts);
}
export function isExistsTypeAnnotation(node, opts) {
  return isType("ExistsTypeAnnotation", node, opts);
}
export function isFunctionTypeAnnotation(node, opts) {
  return isType("FunctionTypeAnnotation", node, opts);
}
export function isFunctionTypeParam(node, opts) {
  return isType("FunctionTypeParam", node, opts);
}
export function isGenericTypeAnnotation(node, opts) {
  return isType("GenericTypeAnnotation", node, opts);
}
export function isInferredPredicate(node, opts) {
  return isType("InferredPredicate", node, opts);
}
export function isInterfaceExtends(node, opts) {
  return isType("InterfaceExtends", node, opts);
}
export function isInterfaceDeclaration(node, opts) {
  return isType("InterfaceDeclaration", node, opts);
}
export function isInterfaceTypeAnnotation(node, opts) {
  return isType("InterfaceTypeAnnotation", node, opts);
}
export function isIntersectionTypeAnnotation(node, opts) {
  return isType("IntersectionTypeAnnotation", node, opts);
}
export function isMixedTypeAnnotation(node, opts) {
  return isType("MixedTypeAnnotation", node, opts);
}
export function isEmptyTypeAnnotation(node, opts) {
  return isType("EmptyTypeAnnotation", node, opts);
}
export function isNullableTypeAnnotation(node, opts) {
  return isType("NullableTypeAnnotation", node, opts);
}
export function isNumberLiteralTypeAnnotation(node, opts) {
  return isType("NumberLiteralTypeAnnotation", node, opts);
}
export function isBigIntLiteralTypeAnnotation(node, opts) {
  return isType("BigIntLiteralTypeAnnotation", node, opts);
}
export function isNumberTypeAnnotation(node, opts) {
  return isType("NumberTypeAnnotation", node, opts);
}
export function isObjectTypeAnnotation(node, opts) {
  return isType("ObjectTypeAnnotation", node, opts);
}
export function isObjectTypeInternalSlot(node, opts) {
  return isType("ObjectTypeInternalSlot", node, opts);
}
export function isObjectTypeCallProperty(node, opts) {
  return isType("ObjectTypeCallProperty", node, opts);
}
export function isObjectTypeIndexer(node, opts) {
  return isType("ObjectTypeIndexer", node, opts);
}
export function isObjectTypeProperty(node, opts) {
  return isType("ObjectTypeProperty", node, opts);
}
export function isObjectTypeSpreadProperty(node, opts) {
  return isType("ObjectTypeSpreadProperty", node, opts);
}
export function isOpaqueType(node, opts) {
  return isType("OpaqueType", node, opts);
}
export function isQualifiedTypeIdentifier(node, opts) {
  return isType("QualifiedTypeIdentifier", node, opts);
}
export function isStringLiteralTypeAnnotation(node, opts) {
  return isType("StringLiteralTypeAnnotation", node, opts);
}
export function isStringTypeAnnotation(node, opts) {
  return isType("StringTypeAnnotation", node, opts);
}
export function isSymbolTypeAnnotation(node, opts) {
  return isType("SymbolTypeAnnotation", node, opts);
}
export function isThisTypeAnnotation(node, opts) {
  return isType("ThisTypeAnnotation", node, opts);
}
export function isTupleTypeAnnotation(node, opts) {
  return isType("TupleTypeAnnotation", node, opts);
}
export function isTypeofTypeAnnotation(node, opts) {
  return isType("TypeofTypeAnnotation", node, opts);
}
export function isTypeAlias(node, opts) {
  return isType("TypeAlias", node, opts);
}
export function isTypeAnnotation(node, opts) {
  return isType("TypeAnnotation", node, opts);
}
export function isTypeCastExpression(node, opts) {
  return isType("TypeCastExpression", node, opts);
}
export function isTypeParameter(node, opts) {
  return isType("TypeParameter", node, opts);
}
export function isTypeParameterDeclaration(node, opts) {
  return isType("TypeParameterDeclaration", node, opts);
}
export function isTypeParameterInstantiation(node, opts) {
  return isType("TypeParameterInstantiation", node, opts);
}
export function isUnionTypeAnnotation(node, opts) {
  return isType("UnionTypeAnnotation", node, opts);
}
export function isVariance(node, opts) {
  return isType("Variance", node, opts);
}
export function isVoidTypeAnnotation(node, opts) {
  return isType("VoidTypeAnnotation", node, opts);
}
export function isEnumDeclaration(node, opts) {
  return isType("EnumDeclaration", node, opts);
}
export function isEnumBooleanBody(node, opts) {
  return isType("EnumBooleanBody", node, opts);
}
export function isEnumNumberBody(node, opts) {
  return isType("EnumNumberBody", node, opts);
}
export function isEnumStringBody(node, opts) {
  return isType("EnumStringBody", node, opts);
}
export function isEnumSymbolBody(node, opts) {
  return isType("EnumSymbolBody", node, opts);
}
export function isEnumBooleanMember(node, opts) {
  return isType("EnumBooleanMember", node, opts);
}
export function isEnumNumberMember(node, opts) {
  return isType("EnumNumberMember", node, opts);
}
export function isEnumStringMember(node, opts) {
  return isType("EnumStringMember", node, opts);
}
export function isEnumDefaultedMember(node, opts) {
  return isType("EnumDefaultedMember", node, opts);
}
export function isIndexedAccessType(node, opts) {
  return isType("IndexedAccessType", node, opts);
}
export function isOptionalIndexedAccessType(node, opts) {
  return isType("OptionalIndexedAccessType", node, opts);
}
export function isJSXAttribute(node, opts) {
  return isType("JSXAttribute", node, opts);
}
export function isJSXClosingElement(node, opts) {
  return isType("JSXClosingElement", node, opts);
}
export function isJSXElement(node, opts) {
  return isType("JSXElement", node, opts);
}
export function isJSXEmptyExpression(node, opts) {
  return isType("JSXEmptyExpression", node, opts);
}
export function isJSXExpressionContainer(node, opts) {
  return isType("JSXExpressionContainer", node, opts);
}
export function isJSXSpreadChild(node, opts) {
  return isType("JSXSpreadChild", node, opts);
}
export function isJSXIdentifier(node, opts) {
  return isType("JSXIdentifier", node, opts);
}
export function isJSXMemberExpression(node, opts) {
  return isType("JSXMemberExpression", node, opts);
}
export function isJSXNamespacedName(node, opts) {
  return isType("JSXNamespacedName", node, opts);
}
export function isJSXOpeningElement(node, opts) {
  return isType("JSXOpeningElement", node, opts);
}
export function isJSXSpreadAttribute(node, opts) {
  return isType("JSXSpreadAttribute", node, opts);
}
export function isJSXText(node, opts) {
  return isType("JSXText", node, opts);
}
export function isJSXFragment(node, opts) {
  return isType("JSXFragment", node, opts);
}
export function isJSXOpeningFragment(node, opts) {
  return isType("JSXOpeningFragment", node, opts);
}
export function isJSXClosingFragment(node, opts) {
  return isType("JSXClosingFragment", node, opts);
}
export function isPlaceholder(node, opts) {
  return isType("Placeholder", node, opts);
}
export function isV8IntrinsicIdentifier(node, opts) {
  return isType("V8IntrinsicIdentifier", node, opts);
}
export function isArgumentPlaceholder(node, opts) {
  return isType("ArgumentPlaceholder", node, opts);
}
export function isBindExpression(node, opts) {
  return isType("BindExpression", node, opts);
}
export function isClassAccessorProperty(node, opts) {
  return isType("ClassAccessorProperty", node, opts);
}
export function isDecorator(node, opts) {
  return isType("Decorator", node, opts);
}
export function isDoExpression(node, opts) {
  return isType("DoExpression", node, opts);
}
export function isExportDefaultSpecifier(node, opts) {
  return isType("ExportDefaultSpecifier", node, opts);
}
export function isModuleExpression(node, opts) {
  return isType("ModuleExpression", node, opts);
}
export function isTopicReference(node, opts) {
  return isType("TopicReference", node, opts);
}
export function isVoidPattern(node, opts) {
  return isType("VoidPattern", node, opts);
}
export function isTSParameterProperty(node, opts) {
  return isType("TSParameterProperty", node, opts);
}
export function isTSDeclareFunction(node, opts) {
  return isType("TSDeclareFunction", node, opts);
}
export function isTSDeclareMethod(node, opts) {
  return isType("TSDeclareMethod", node, opts);
}
export function isTSQualifiedName(node, opts) {
  return isType("TSQualifiedName", node, opts);
}
export function isTSCallSignatureDeclaration(node, opts) {
  return isType("TSCallSignatureDeclaration", node, opts);
}
export function isTSConstructSignatureDeclaration(node, opts) {
  return isType("TSConstructSignatureDeclaration", node, opts);
}
export function isTSPropertySignature(node, opts) {
  return isType("TSPropertySignature", node, opts);
}
export function isTSMethodSignature(node, opts) {
  return isType("TSMethodSignature", node, opts);
}
export function isTSIndexSignature(node, opts) {
  return isType("TSIndexSignature", node, opts);
}
export function isTSAnyKeyword(node, opts) {
  return isType("TSAnyKeyword", node, opts);
}
export function isTSBooleanKeyword(node, opts) {
  return isType("TSBooleanKeyword", node, opts);
}
export function isTSBigIntKeyword(node, opts) {
  return isType("TSBigIntKeyword", node, opts);
}
export function isTSIntrinsicKeyword(node, opts) {
  return isType("TSIntrinsicKeyword", node, opts);
}
export function isTSNeverKeyword(node, opts) {
  return isType("TSNeverKeyword", node, opts);
}
export function isTSNullKeyword(node, opts) {
  return isType("TSNullKeyword", node, opts);
}
export function isTSNumberKeyword(node, opts) {
  return isType("TSNumberKeyword", node, opts);
}
export function isTSObjectKeyword(node, opts) {
  return isType("TSObjectKeyword", node, opts);
}
export function isTSStringKeyword(node, opts) {
  return isType("TSStringKeyword", node, opts);
}
export function isTSSymbolKeyword(node, opts) {
  return isType("TSSymbolKeyword", node, opts);
}
export function isTSUndefinedKeyword(node, opts) {
  return isType("TSUndefinedKeyword", node, opts);
}
export function isTSUnknownKeyword(node, opts) {
  return isType("TSUnknownKeyword", node, opts);
}
export function isTSVoidKeyword(node, opts) {
  return isType("TSVoidKeyword", node, opts);
}
export function isTSThisType(node, opts) {
  return isType("TSThisType", node, opts);
}
export function isTSFunctionType(node, opts) {
  return isType("TSFunctionType", node, opts);
}
export function isTSConstructorType(node, opts) {
  return isType("TSConstructorType", node, opts);
}
export function isTSTypeReference(node, opts) {
  return isType("TSTypeReference", node, opts);
}
export function isTSTypePredicate(node, opts) {
  return isType("TSTypePredicate", node, opts);
}
export function isTSTypeQuery(node, opts) {
  return isType("TSTypeQuery", node, opts);
}
export function isTSTypeLiteral(node, opts) {
  return isType("TSTypeLiteral", node, opts);
}
export function isTSArrayType(node, opts) {
  return isType("TSArrayType", node, opts);
}
export function isTSTupleType(node, opts) {
  return isType("TSTupleType", node, opts);
}
export function isTSOptionalType(node, opts) {
  return isType("TSOptionalType", node, opts);
}
export function isTSRestType(node, opts) {
  return isType("TSRestType", node, opts);
}
export function isTSNamedTupleMember(node, opts) {
  return isType("TSNamedTupleMember", node, opts);
}
export function isTSUnionType(node, opts) {
  return isType("TSUnionType", node, opts);
}
export function isTSIntersectionType(node, opts) {
  return isType("TSIntersectionType", node, opts);
}
export function isTSConditionalType(node, opts) {
  return isType("TSConditionalType", node, opts);
}
export function isTSInferType(node, opts) {
  return isType("TSInferType", node, opts);
}
export function isTSParenthesizedType(node, opts) {
  return isType("TSParenthesizedType", node, opts);
}
export function isTSTypeOperator(node, opts) {
  return isType("TSTypeOperator", node, opts);
}
export function isTSIndexedAccessType(node, opts) {
  return isType("TSIndexedAccessType", node, opts);
}
export function isTSMappedType(node, opts) {
  return isType("TSMappedType", node, opts);
}
export function isTSTemplateLiteralType(node, opts) {
  return isType("TSTemplateLiteralType", node, opts);
}
export function isTSLiteralType(node, opts) {
  return isType("TSLiteralType", node, opts);
}
export function isTSClassImplements(node, opts) {
  return isType("TSClassImplements", node, opts);
}
export function isTSInterfaceHeritage(node, opts) {
  return isType("TSInterfaceHeritage", node, opts);
}
export function isTSInterfaceDeclaration(node, opts) {
  return isType("TSInterfaceDeclaration", node, opts);
}
export function isTSInterfaceBody(node, opts) {
  return isType("TSInterfaceBody", node, opts);
}
export function isTSTypeAliasDeclaration(node, opts) {
  return isType("TSTypeAliasDeclaration", node, opts);
}
export function isTSInstantiationExpression(node, opts) {
  return isType("TSInstantiationExpression", node, opts);
}
export function isTSAsExpression(node, opts) {
  return isType("TSAsExpression", node, opts);
}
export function isTSSatisfiesExpression(node, opts) {
  return isType("TSSatisfiesExpression", node, opts);
}
export function isTSTypeAssertion(node, opts) {
  return isType("TSTypeAssertion", node, opts);
}
export function isTSEnumBody(node, opts) {
  return isType("TSEnumBody", node, opts);
}
export function isTSEnumDeclaration(node, opts) {
  return isType("TSEnumDeclaration", node, opts);
}
export function isTSEnumMember(node, opts) {
  return isType("TSEnumMember", node, opts);
}
export function isTSModuleDeclaration(node, opts) {
  return isType("TSModuleDeclaration", node, opts);
}
export function isTSModuleBlock(node, opts) {
  return isType("TSModuleBlock", node, opts);
}
export function isTSImportType(node, opts) {
  return isType("TSImportType", node, opts);
}
export function isTSImportEqualsDeclaration(node, opts) {
  return isType("TSImportEqualsDeclaration", node, opts);
}
export function isTSExternalModuleReference(node, opts) {
  return isType("TSExternalModuleReference", node, opts);
}
export function isTSNonNullExpression(node, opts) {
  return isType("TSNonNullExpression", node, opts);
}
export function isTSExportAssignment(node, opts) {
  return isType("TSExportAssignment", node, opts);
}
export function isTSNamespaceExportDeclaration(node, opts) {
  return isType("TSNamespaceExportDeclaration", node, opts);
}
export function isTSTypeAnnotation(node, opts) {
  return isType("TSTypeAnnotation", node, opts);
}
export function isTSTypeParameterInstantiation(node, opts) {
  return isType("TSTypeParameterInstantiation", node, opts);
}
export function isTSTypeParameterDeclaration(node, opts) {
  return isType("TSTypeParameterDeclaration", node, opts);
}
export function isTSTypeParameter(node, opts) {
  return isType("TSTypeParameter", node, opts);
}
export function isStandardized(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ArrayExpression":
    case "AssignmentExpression":
    case "BinaryExpression":
    case "InterpreterDirective":
    case "Directive":
    case "DirectiveLiteral":
    case "BlockStatement":
    case "BreakStatement":
    case "CallExpression":
    case "CatchClause":
    case "ConditionalExpression":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "DoWhileStatement":
    case "EmptyStatement":
    case "ExpressionStatement":
    case "File":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Identifier":
    case "IfStatement":
    case "LabeledStatement":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "LogicalExpression":
    case "MemberExpression":
    case "NewExpression":
    case "Program":
    case "ObjectExpression":
    case "ObjectMethod":
    case "ObjectProperty":
    case "RestElement":
    case "ReturnStatement":
    case "SequenceExpression":
    case "ParenthesizedExpression":
    case "SwitchCase":
    case "SwitchStatement":
    case "ThisExpression":
    case "ThrowStatement":
    case "TryStatement":
    case "UnaryExpression":
    case "UpdateExpression":
    case "VariableDeclaration":
    case "VariableDeclarator":
    case "WhileStatement":
    case "WithStatement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ArrowFunctionExpression":
    case "ClassBody":
    case "ClassExpression":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ExportSpecifier":
    case "ForOfStatement":
    case "ImportDeclaration":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
    case "MetaProperty":
    case "ClassMethod":
    case "ObjectPattern":
    case "SpreadElement":
    case "Super":
    case "TaggedTemplateExpression":
    case "TemplateElement":
    case "TemplateLiteral":
    case "YieldExpression":
    case "AwaitExpression":
    case "ImportExpression":
    case "Import":
    case "BigIntLiteral":
    case "ExportNamespaceSpecifier":
    case "OptionalMemberExpression":
    case "OptionalCallExpression":
    case "ClassProperty":
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
    case "PrivateName":
    case "StaticBlock":
    case "ImportAttribute":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Identifier":
        case "StringLiteral":
        case "BlockStatement":
        case "ClassBody":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isExpression(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ArrayExpression":
    case "AssignmentExpression":
    case "BinaryExpression":
    case "CallExpression":
    case "ConditionalExpression":
    case "FunctionExpression":
    case "Identifier":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "LogicalExpression":
    case "MemberExpression":
    case "NewExpression":
    case "ObjectExpression":
    case "SequenceExpression":
    case "ParenthesizedExpression":
    case "ThisExpression":
    case "UnaryExpression":
    case "UpdateExpression":
    case "ArrowFunctionExpression":
    case "ClassExpression":
    case "MetaProperty":
    case "TaggedTemplateExpression":
    case "TemplateLiteral":
    case "YieldExpression":
    case "AwaitExpression":
    case "ImportExpression":
    case "BigIntLiteral":
    case "OptionalMemberExpression":
    case "OptionalCallExpression":
    case "TypeCastExpression":
    case "JSXElement":
    case "JSXFragment":
    case "BindExpression":
    case "DoExpression":
    case "ModuleExpression":
    case "TopicReference":
    case "TSInstantiationExpression":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Expression":
        case "Identifier":
        case "StringLiteral":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isBinary(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BinaryExpression":
    case "LogicalExpression":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isScopable(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "CatchClause":
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Program":
    case "ObjectMethod":
    case "SwitchStatement":
    case "WhileStatement":
    case "ArrowFunctionExpression":
    case "ClassExpression":
    case "ClassDeclaration":
    case "ForOfStatement":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isBlockParent(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "CatchClause":
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Program":
    case "ObjectMethod":
    case "SwitchStatement":
    case "WhileStatement":
    case "ArrowFunctionExpression":
    case "ForOfStatement":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isBlock(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "Program":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isStatement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "BreakStatement":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "DoWhileStatement":
    case "EmptyStatement":
    case "ExpressionStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "IfStatement":
    case "LabeledStatement":
    case "ReturnStatement":
    case "SwitchStatement":
    case "ThrowStatement":
    case "TryStatement":
    case "VariableDeclaration":
    case "WhileStatement":
    case "WithStatement":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ForOfStatement":
    case "ImportDeclaration":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
    case "EnumDeclaration":
    case "TSDeclareFunction":
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSEnumDeclaration":
    case "TSModuleDeclaration":
    case "TSImportEqualsDeclaration":
    case "TSExportAssignment":
    case "TSNamespaceExportDeclaration":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Statement":
        case "Declaration":
        case "BlockStatement":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isTerminatorless(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BreakStatement":
    case "ContinueStatement":
    case "ReturnStatement":
    case "ThrowStatement":
    case "YieldExpression":
    case "AwaitExpression":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isCompletionStatement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BreakStatement":
    case "ContinueStatement":
    case "ReturnStatement":
    case "ThrowStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isConditional(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ConditionalExpression":
    case "IfStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isLoop(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "WhileStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isWhile(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DoWhileStatement":
    case "WhileStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isExpressionWrapper(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExpressionStatement":
    case "ParenthesizedExpression":
    case "TypeCastExpression":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isFor(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ForInStatement":
    case "ForStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isForXStatement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ForInStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isFunction(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ObjectMethod":
    case "ArrowFunctionExpression":
    case "ClassMethod":
    case "ClassPrivateMethod":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isFunctionParent(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ObjectMethod":
    case "ArrowFunctionExpression":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isPureish(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "ArrowFunctionExpression":
    case "BigIntLiteral":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "VariableDeclaration":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ImportDeclaration":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
    case "EnumDeclaration":
    case "TSDeclareFunction":
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSEnumDeclaration":
    case "TSModuleDeclaration":
    case "TSImportEqualsDeclaration":
      break;
    case "Placeholder":
      if (node.expectedNode === "Declaration") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isFunctionParameter(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "RestElement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
    case "VoidPattern":
      break;
    case "Placeholder":
      if (node.expectedNode === "Identifier") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isPatternLike(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "MemberExpression":
    case "RestElement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
    case "VoidPattern":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Pattern":
        case "Identifier":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isLVal(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "MemberExpression":
    case "ArrayPattern":
    case "ObjectPattern":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Pattern":
        case "Identifier":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isTSEntityName(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "ThisExpression":
    case "TSQualifiedName":
      break;
    case "Placeholder":
      if (node.expectedNode === "Identifier") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isLiteral(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "TemplateLiteral":
    case "BigIntLiteral":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isImmutable(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "BigIntLiteral":
    case "JSXAttribute":
    case "JSXClosingElement":
    case "JSXElement":
    case "JSXExpressionContainer":
    case "JSXSpreadChild":
    case "JSXOpeningElement":
    case "JSXText":
    case "JSXFragment":
    case "JSXOpeningFragment":
    case "JSXClosingFragment":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isUserWhitespacable(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectMethod":
    case "ObjectProperty":
    case "ObjectTypeInternalSlot":
    case "ObjectTypeCallProperty":
    case "ObjectTypeIndexer":
    case "ObjectTypeProperty":
    case "ObjectTypeSpreadProperty":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isMethod(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectMethod":
    case "ClassMethod":
    case "ClassPrivateMethod":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isObjectMember(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectMethod":
    case "ObjectProperty":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isProperty(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectProperty":
    case "ClassProperty":
    case "ClassPrivateProperty":
    case "ClassAccessorProperty":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isUnaryLike(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "UnaryExpression":
    case "SpreadElement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isPattern(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
    case "VoidPattern":
      break;
    case "Placeholder":
      if (node.expectedNode === "Pattern") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isClass(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ClassExpression":
    case "ClassDeclaration":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isImportOrExportDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ImportDeclaration":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isExportDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isModuleSpecifier(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExportSpecifier":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isPrivate(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
    case "PrivateName":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isFlow(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AnyTypeAnnotation":
    case "ArrayTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "BooleanLiteralTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "ClassImplements":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "DeclaredPredicate":
    case "ExistsTypeAnnotation":
    case "FunctionTypeAnnotation":
    case "FunctionTypeParam":
    case "GenericTypeAnnotation":
    case "InferredPredicate":
    case "InterfaceExtends":
    case "InterfaceDeclaration":
    case "InterfaceTypeAnnotation":
    case "IntersectionTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NullableTypeAnnotation":
    case "NumberLiteralTypeAnnotation":
    case "BigIntLiteralTypeAnnotation":
    case "NumberTypeAnnotation":
    case "ObjectTypeAnnotation":
    case "ObjectTypeInternalSlot":
    case "ObjectTypeCallProperty":
    case "ObjectTypeIndexer":
    case "ObjectTypeProperty":
    case "ObjectTypeSpreadProperty":
    case "OpaqueType":
    case "QualifiedTypeIdentifier":
    case "StringLiteralTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "TupleTypeAnnotation":
    case "TypeofTypeAnnotation":
    case "TypeAlias":
    case "TypeAnnotation":
    case "TypeCastExpression":
    case "TypeParameter":
    case "TypeParameterDeclaration":
    case "TypeParameterInstantiation":
    case "UnionTypeAnnotation":
    case "Variance":
    case "VoidTypeAnnotation":
    case "EnumDeclaration":
    case "EnumBooleanBody":
    case "EnumNumberBody":
    case "EnumStringBody":
    case "EnumSymbolBody":
    case "EnumBooleanMember":
    case "EnumNumberMember":
    case "EnumStringMember":
    case "EnumDefaultedMember":
    case "IndexedAccessType":
    case "OptionalIndexedAccessType":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isFlowType(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AnyTypeAnnotation":
    case "ArrayTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "BooleanLiteralTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "ExistsTypeAnnotation":
    case "FunctionTypeAnnotation":
    case "GenericTypeAnnotation":
    case "InterfaceTypeAnnotation":
    case "IntersectionTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NullableTypeAnnotation":
    case "NumberLiteralTypeAnnotation":
    case "BigIntLiteralTypeAnnotation":
    case "NumberTypeAnnotation":
    case "ObjectTypeAnnotation":
    case "StringLiteralTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "TupleTypeAnnotation":
    case "TypeofTypeAnnotation":
    case "UnionTypeAnnotation":
    case "VoidTypeAnnotation":
    case "IndexedAccessType":
    case "OptionalIndexedAccessType":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isFlowBaseAnnotation(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AnyTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NumberTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "VoidTypeAnnotation":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isFlowDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isFlowPredicate(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DeclaredPredicate":
    case "InferredPredicate":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isEnumBody(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "EnumBooleanBody":
    case "EnumNumberBody":
    case "EnumStringBody":
    case "EnumSymbolBody":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isEnumMember(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "EnumBooleanMember":
    case "EnumNumberMember":
    case "EnumStringMember":
    case "EnumDefaultedMember":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isJSX(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "JSXAttribute":
    case "JSXClosingElement":
    case "JSXElement":
    case "JSXEmptyExpression":
    case "JSXExpressionContainer":
    case "JSXSpreadChild":
    case "JSXIdentifier":
    case "JSXMemberExpression":
    case "JSXNamespacedName":
    case "JSXOpeningElement":
    case "JSXSpreadAttribute":
    case "JSXText":
    case "JSXFragment":
    case "JSXOpeningFragment":
    case "JSXClosingFragment":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isMiscellaneous(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Placeholder":
    case "V8IntrinsicIdentifier":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isAccessor(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ClassAccessorProperty":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isTypeScript(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSParameterProperty":
    case "TSDeclareFunction":
    case "TSDeclareMethod":
    case "TSQualifiedName":
    case "TSCallSignatureDeclaration":
    case "TSConstructSignatureDeclaration":
    case "TSPropertySignature":
    case "TSMethodSignature":
    case "TSIndexSignature":
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSFunctionType":
    case "TSConstructorType":
    case "TSTypeReference":
    case "TSTypePredicate":
    case "TSTypeQuery":
    case "TSTypeLiteral":
    case "TSArrayType":
    case "TSTupleType":
    case "TSOptionalType":
    case "TSRestType":
    case "TSNamedTupleMember":
    case "TSUnionType":
    case "TSIntersectionType":
    case "TSConditionalType":
    case "TSInferType":
    case "TSParenthesizedType":
    case "TSTypeOperator":
    case "TSIndexedAccessType":
    case "TSMappedType":
    case "TSTemplateLiteralType":
    case "TSLiteralType":
    case "TSClassImplements":
    case "TSInterfaceHeritage":
    case "TSInterfaceDeclaration":
    case "TSInterfaceBody":
    case "TSTypeAliasDeclaration":
    case "TSInstantiationExpression":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSEnumBody":
    case "TSEnumDeclaration":
    case "TSEnumMember":
    case "TSModuleDeclaration":
    case "TSModuleBlock":
    case "TSImportType":
    case "TSImportEqualsDeclaration":
    case "TSExternalModuleReference":
    case "TSNonNullExpression":
    case "TSExportAssignment":
    case "TSNamespaceExportDeclaration":
    case "TSTypeAnnotation":
    case "TSTypeParameterInstantiation":
    case "TSTypeParameterDeclaration":
    case "TSTypeParameter":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isTSTypeElement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSCallSignatureDeclaration":
    case "TSConstructSignatureDeclaration":
    case "TSPropertySignature":
    case "TSMethodSignature":
    case "TSIndexSignature":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isTSType(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSFunctionType":
    case "TSConstructorType":
    case "TSTypeReference":
    case "TSTypePredicate":
    case "TSTypeQuery":
    case "TSTypeLiteral":
    case "TSArrayType":
    case "TSTupleType":
    case "TSOptionalType":
    case "TSRestType":
    case "TSNamedTupleMember":
    case "TSUnionType":
    case "TSIntersectionType":
    case "TSConditionalType":
    case "TSInferType":
    case "TSParenthesizedType":
    case "TSTypeOperator":
    case "TSIndexedAccessType":
    case "TSMappedType":
    case "TSTemplateLiteralType":
    case "TSLiteralType":
    case "TSClassImplements":
    case "TSInterfaceHeritage":
    case "TSImportType":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isTSBaseType(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSTemplateLiteralType":
    case "TSLiteralType":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
export function isNumberLiteral(node, opts) {
  deprecationWarning("isNumberLiteral", "isNumericLiteral");
  return isType("NumberLiteral", node, opts);
}
export function isRegexLiteral(node, opts) {
  deprecationWarning("isRegexLiteral", "isRegExpLiteral");
  return isType("RegexLiteral", node, opts);
}
export function isRestProperty(node, opts) {
  deprecationWarning("isRestProperty", "isRestElement");
  return isType("RestProperty", node, opts);
}
export function isSpreadProperty(node, opts) {
  deprecationWarning("isSpreadProperty", "isSpreadElement");
  return isType("SpreadProperty", node, opts);
}
export function isModuleDeclaration(node, opts) {
  deprecationWarning("isModuleDeclaration", "isImportOrExportDeclaration");
  return isImportOrExportDeclaration(node, opts);
}