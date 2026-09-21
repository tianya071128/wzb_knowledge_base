import { _functionHead, _param, _parameters } from "./methods.js";
import { _classMethodHead } from "./classes.js";
import { _printTemplate } from "./template-literals.js";
export function TSTypeAnnotation(node, parent) {
  this.token((parent.type === "TSFunctionType" || parent.type === "TSConstructorType") && parent.returnType === node ? "=>" : ":");
  this.space();
  if (node.optional) this.tokenChar(63);
  this.print(node.typeAnnotation);
}
export function TSTypeParameterInstantiation(node, parent) {
  this.tokenChar(60);
  let printTrailingSeparator = parent.type === "ArrowFunctionExpression" && node.params.length === 1;
  if (this.tokenMap && node.start != null && node.end != null) {
    printTrailingSeparator &&= !!this.tokenMap.find(node, t => this.tokenMap.matchesOriginal(t, ","));
    printTrailingSeparator ||= this.shouldPrintTrailingComma(">");
  }
  this.printList(node.params, printTrailingSeparator);
  this.tokenChar(62);
}
export { TSTypeParameterInstantiation as TSTypeParameterDeclaration };
export function TSTypeParameter(node) {
  if (node.const) {
    this.word("const");
    this.space();
  }
  if (node.in) {
    this.word("in");
    this.space();
  }
  if (node.out) {
    this.word("out");
    this.space();
  }
  this.word(node.name.name);
  if (node.constraint) {
    this.space();
    this.word("extends");
    this.space();
    this.print(node.constraint);
  }
  if (node.default) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.default);
  }
}
export function TSParameterProperty(node) {
  if (node.accessibility) {
    this.word(node.accessibility);
    this.space();
  }
  if (node.readonly) {
    this.word("readonly");
    this.space();
  }
  _param.call(this, node.parameter);
}
export function TSDeclareFunction(node, parent) {
  if (node.declare) {
    this.word("declare");
    this.space();
  }
  _functionHead.call(this, node, parent, false);
  this.semicolon();
}
export function TSDeclareMethod(node) {
  _classMethodHead.call(this, node, false);
  this.semicolon();
}
export function TSQualifiedName(node) {
  this.print(node.left);
  this.tokenChar(46);
  this.print(node.right);
}
export function TSCallSignatureDeclaration(node) {
  tsPrintSignatureDeclarationBase.call(this, node);
  maybePrintTrailingCommaOrSemicolon(this, node);
}
function maybePrintTrailingCommaOrSemicolon(printer, node) {
  if (!printer.tokenMap || !node.start || !node.end) {
    printer.semicolon();
    return;
  }
  if (printer.tokenMap.endMatches(node, ",")) {
    printer.token(",");
  } else if (printer.tokenMap.endMatches(node, ";")) {
    printer.semicolon();
  }
}
export function TSConstructSignatureDeclaration(node) {
  this.word("new");
  this.space();
  tsPrintSignatureDeclarationBase.call(this, node);
  maybePrintTrailingCommaOrSemicolon(this, node);
}
export function TSPropertySignature(node) {
  const {
    readonly
  } = node;
  if (readonly) {
    this.word("readonly");
    this.space();
  }
  tsPrintPropertyOrMethodName.call(this, node);
  this.print(node.typeAnnotation);
  maybePrintTrailingCommaOrSemicolon(this, node);
}
function tsPrintPropertyOrMethodName(node) {
  if (node.computed) {
    this.tokenChar(91);
  }
  this.print(node.key);
  if (node.computed) {
    this.tokenChar(93);
  }
  if (node.optional) {
    this.tokenChar(63);
  }
}
export function TSMethodSignature(node) {
  const {
    kind
  } = node;
  if (kind === "set" || kind === "get") {
    this.word(kind);
    this.space();
  }
  tsPrintPropertyOrMethodName.call(this, node);
  tsPrintSignatureDeclarationBase.call(this, node);
  maybePrintTrailingCommaOrSemicolon(this, node);
}
export function TSIndexSignature(node) {
  const {
    readonly,
    static: isStatic
  } = node;
  if (isStatic) {
    this.word("static");
    this.space();
  }
  if (readonly) {
    this.word("readonly");
    this.space();
  }
  this.tokenChar(91);
  _parameters.call(this, node.parameters, 93);
  this.print(node.typeAnnotation);
  maybePrintTrailingCommaOrSemicolon(this, node);
}
export function TSAnyKeyword() {
  this.word("any");
}
export function TSBigIntKeyword() {
  this.word("bigint");
}
export function TSUnknownKeyword() {
  this.word("unknown");
}
export function TSNumberKeyword() {
  this.word("number");
}
export function TSObjectKeyword() {
  this.word("object");
}
export function TSBooleanKeyword() {
  this.word("boolean");
}
export function TSStringKeyword() {
  this.word("string");
}
export function TSSymbolKeyword() {
  this.word("symbol");
}
export function TSVoidKeyword() {
  this.word("void");
}
export function TSUndefinedKeyword() {
  this.word("undefined");
}
export function TSNullKeyword() {
  this.word("null");
}
export function TSNeverKeyword() {
  this.word("never");
}
export function TSIntrinsicKeyword() {
  this.word("intrinsic");
}
export function TSThisType() {
  this.word("this");
}
export function TSFunctionType(node) {
  tsPrintFunctionOrConstructorType.call(this, node);
}
export function TSConstructorType(node) {
  if (node.abstract) {
    this.word("abstract");
    this.space();
  }
  this.word("new");
  this.space();
  tsPrintFunctionOrConstructorType.call(this, node);
}
function tsPrintFunctionOrConstructorType(node) {
  const {
    typeParameters
  } = node;
  const parameters = node.params;
  this.print(typeParameters);
  this.tokenChar(40);
  _parameters.call(this, parameters, 41);
  this.space();
  const returnType = node.returnType;
  this.print(returnType);
}
export function TSTypeReference(node) {
  const typeArguments = node.typeArguments;
  this.print(node.typeName, !!typeArguments);
  this.print(typeArguments);
}
export function TSTypePredicate(node) {
  if (node.asserts) {
    this.word("asserts");
    this.space();
  }
  this.print(node.parameterName);
  if (node.typeAnnotation) {
    this.space();
    this.word("is");
    this.space();
    this.print(node.typeAnnotation.typeAnnotation);
  }
}
export function TSTypeQuery(node) {
  this.word("typeof");
  this.space();
  this.print(node.exprName);
  const typeArguments = node.typeArguments;
  if (typeArguments) {
    this.print(typeArguments);
  }
}
export function TSTypeLiteral(node) {
  printBraced(this, node, () => this.printJoin(node.members, true, true, undefined, undefined, true));
}
export function TSArrayType(node) {
  this.print(node.elementType, true);
  this.tokenChar(91);
  this.tokenChar(93);
}
export function TSTupleType(node) {
  this.tokenChar(91);
  this.printList(node.elementTypes, this.shouldPrintTrailingComma("]"));
  this.tokenChar(93);
}
export function TSOptionalType(node) {
  this.print(node.typeAnnotation);
  this.tokenChar(63);
}
export function TSRestType(node) {
  this.token("...");
  this.print(node.typeAnnotation);
}
export function TSNamedTupleMember(node) {
  this.print(node.label);
  if (node.optional) this.tokenChar(63);
  this.tokenChar(58);
  this.space();
  this.print(node.elementType);
}
export function TSUnionType(node) {
  tsPrintUnionOrIntersectionType(this, node, "|");
}
export function TSIntersectionType(node) {
  tsPrintUnionOrIntersectionType(this, node, "&");
}
function tsPrintUnionOrIntersectionType(printer, node, sep) {
  let hasLeadingToken = 0;
  if (printer.tokenMap?.startMatches(node, sep)) {
    hasLeadingToken = 1;
    printer.token(sep);
  }
  printer.printJoin(node.types, undefined, undefined, function (i) {
    this.space();
    this.token(sep, undefined, i + hasLeadingToken);
    this.space();
  });
}
export function TSConditionalType(node) {
  this.print(node.checkType);
  this.space();
  this.word("extends");
  this.space();
  this.print(node.extendsType);
  this.space();
  this.tokenChar(63);
  this.space();
  this.print(node.trueType);
  this.space();
  this.tokenChar(58);
  this.space();
  this.print(node.falseType);
}
export function TSInferType(node) {
  this.word("infer");
  this.print(node.typeParameter);
}
export function TSParenthesizedType(node) {
  this.tokenChar(40);
  this.print(node.typeAnnotation);
  this.tokenChar(41);
}
export function TSTypeOperator(node) {
  this.word(node.operator);
  this.space();
  this.print(node.typeAnnotation);
}
export function TSIndexedAccessType(node) {
  this.print(node.objectType, true);
  this.tokenChar(91);
  this.print(node.indexType);
  this.tokenChar(93);
}
export function TSMappedType(node) {
  const {
    nameType,
    optional,
    readonly,
    typeAnnotation
  } = node;
  this.tokenChar(123);
  const oldNoLineTerminatorAfterNode = this.enterDelimited();
  this.space();
  if (readonly) {
    tokenIfPlusMinus(this, readonly);
    this.word("readonly");
    this.space();
  }
  this.tokenChar(91);
  this.word(node.key.name);
  this.space();
  this.word("in");
  this.space();
  this.print(node.constraint);
  if (nameType) {
    this.space();
    this.word("as");
    this.space();
    this.print(nameType, undefined, true);
  }
  this.tokenChar(93);
  if (optional) {
    tokenIfPlusMinus(this, optional);
    this.tokenChar(63);
  }
  if (typeAnnotation) {
    this.tokenChar(58);
    this.space();
    this.print(typeAnnotation, undefined, true);
  }
  this.space();
  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
  this.tokenChar(125);
}
function tokenIfPlusMinus(self, tok) {
  if (tok !== true) {
    self.token(tok);
  }
}
export function TSTemplateLiteralType(node) {
  _printTemplate.call(this, node, node.types);
}
export function TSLiteralType(node) {
  this.print(node.literal);
}
export function TSClassImplements(node) {
  this.print(node.expression);
  this.print(node.typeArguments);
}
export { TSClassImplements as TSInterfaceHeritage };
export function TSInterfaceDeclaration(node) {
  const {
    declare,
    id,
    typeParameters,
    extends: extendz,
    body
  } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  this.word("interface");
  this.space();
  this.print(id);
  this.print(typeParameters);
  if (extendz?.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(extendz);
  }
  this.space();
  this.print(body);
}
export function TSInterfaceBody(node) {
  printBraced(this, node, () => this.printJoin(node.body, true, true, undefined, undefined, true));
}
export function TSTypeAliasDeclaration(node) {
  const {
    declare,
    id,
    typeParameters,
    typeAnnotation
  } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  this.word("type");
  this.space();
  this.print(id);
  this.print(typeParameters);
  this.space();
  this.tokenChar(61);
  this.space();
  this.print(typeAnnotation);
  this.semicolon();
}
export function TSAsExpression(node) {
  const {
    expression,
    typeAnnotation
  } = node;
  this.print(expression, true);
  this.space();
  this.word("as");
  this.space();
  this.print(typeAnnotation);
}
export function TSSatisfiesExpression(node) {
  const {
    expression,
    typeAnnotation
  } = node;
  this.print(expression, true);
  this.space();
  this.word("satisfies");
  this.space();
  this.print(typeAnnotation);
}
export function TSTypeAssertion(node) {
  const {
    typeAnnotation,
    expression
  } = node;
  this.tokenChar(60);
  this.print(typeAnnotation);
  this.tokenChar(62);
  this.space();
  this.print(expression);
}
export function TSInstantiationExpression(node) {
  this.print(node.expression);
  this.print(node.typeArguments);
}
export function TSEnumDeclaration(node) {
  const {
    declare,
    const: isConst,
    id
  } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  if (isConst) {
    this.word("const");
    this.space();
  }
  this.word("enum");
  this.space();
  this.print(id);
  this.space();
  this.print(node.body);
}
export function TSEnumBody(node) {
  printBraced(this, node, () => this.printList(node.members, this.shouldPrintTrailingComma("}") ?? false, true, true, undefined, true));
}
export function TSEnumMember(node) {
  const {
    id,
    initializer
  } = node;
  this.print(id);
  if (initializer) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(initializer);
  }
}
export function TSModuleDeclaration(node) {
  const {
    declare,
    kind
  } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  if (kind !== "global") {
    this.word(kind);
    this.space();
  }
  this.print(node.id);
  if (!node.body) {
    this.semicolon();
    return;
  }
  this.space();
  this.print(node.body);
}
export function TSModuleBlock(node) {
  printBraced(this, node, () => this.printSequence(node.body, true, true));
}
export function TSImportType(node) {
  const {
    qualifier,
    options
  } = node;
  this.word("import");
  this.tokenChar(40);
  this.print(node.source);
  if (options) {
    this.tokenChar(44);
    this.print(options);
  }
  this.tokenChar(41);
  if (qualifier) {
    this.tokenChar(46);
    this.print(qualifier);
  }
  const typeArguments = node.typeArguments;
  if (typeArguments) {
    this.print(typeArguments);
  }
}
export function TSImportEqualsDeclaration(node) {
  const {
    id,
    moduleReference
  } = node;
  this.word("import");
  this.space();
  this.print(id);
  this.space();
  this.tokenChar(61);
  this.space();
  this.print(moduleReference);
  this.semicolon();
}
export function TSExternalModuleReference(node) {
  this.token("require(");
  this.print(node.expression);
  this.tokenChar(41);
}
export function TSNonNullExpression(node) {
  this.print(node.expression);
  this.tokenChar(33);
  this.setLastChar(33);
}
export function TSExportAssignment(node) {
  this.word("export");
  this.space();
  this.tokenChar(61);
  this.space();
  this.print(node.expression);
  this.semicolon();
}
export function TSNamespaceExportDeclaration(node) {
  this.word("export");
  this.space();
  this.word("as");
  this.space();
  this.word("namespace");
  this.space();
  this.print(node.id);
  this.semicolon();
}
function tsPrintSignatureDeclarationBase(node) {
  const {
    typeParameters
  } = node;
  const parameters = node.params;
  this.print(typeParameters);
  this.tokenChar(40);
  _parameters.call(this, parameters, 41);
  this.print(node.returnType);
}
export function _tsPrintClassMemberModifiers(node) {
  const isPrivateField = node.type === "ClassPrivateProperty";
  const isPublicField = node.type === "ClassAccessorProperty" || node.type === "ClassProperty";
  printModifiersList(this, node, [isPublicField && node.declare && "declare", !isPrivateField && node.accessibility]);
  if (node.static) {
    this.word("static");
    this.space();
  }
  printModifiersList(this, node, [!isPrivateField && node.abstract && "abstract", !isPrivateField && node.override && "override", (isPublicField || isPrivateField) && node.readonly && "readonly"]);
}
function printBraced(printer, node, cb) {
  printer.token("{");
  const oldNoLineTerminatorAfterNode = printer.enterDelimited();
  cb();
  printer._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
  printer.rightBrace(node);
}
function printModifiersList(printer, node, modifiers) {
  const modifiersSet = new Set();
  for (const modifier of modifiers) {
    if (modifier) modifiersSet.add(modifier);
  }
  printer.tokenMap?.find(node, tok => {
    if (modifiersSet.has(tok.value)) {
      printer.token(tok.value);
      printer.space();
      modifiersSet.delete(tok.value);
      return modifiersSet.size === 0;
    }
    return false;
  });
  for (const modifier of modifiersSet) {
    printer.word(modifier);
    printer.space();
  }
}