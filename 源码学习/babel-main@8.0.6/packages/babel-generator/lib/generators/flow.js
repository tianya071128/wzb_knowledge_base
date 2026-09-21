import * as _t from "@babel/types";
const {
  isDeclareExportDeclaration,
  isStatement
} = _t;
import { ExportAllDeclaration } from "./modules.js";
import { TokenContext } from "../node/index.js";
export function AnyTypeAnnotation() {
  this.word("any");
}
export function ArrayTypeAnnotation(node) {
  this.print(node.elementType, true);
  this.tokenChar(91);
  this.tokenChar(93);
}
export function BooleanTypeAnnotation() {
  this.word("boolean");
}
export function BooleanLiteralTypeAnnotation(node) {
  this.word(node.value ? "true" : "false");
}
export function NullLiteralTypeAnnotation() {
  this.word("null");
}
export function DeclareClass(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }
  this.word("class");
  this.space();
  _interfaceish.call(this, node);
}
export function DeclareFunction(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }
  this.word("function");
  this.space();
  this.print(node.id);
  this.print(node.id.typeAnnotation?.typeAnnotation);
  if (node.predicate) {
    this.space();
    this.print(node.predicate);
  }
  this.semicolon();
}
export function InferredPredicate() {
  this.tokenChar(37);
  this.word("checks");
}
export function DeclaredPredicate(node) {
  this.tokenChar(37);
  this.word("checks");
  this.tokenChar(40);
  this.print(node.value);
  this.tokenChar(41);
}
export function DeclareInterface(node) {
  this.word("declare");
  this.space();
  InterfaceDeclaration.call(this, node);
}
export function DeclareModule(node) {
  this.word("declare");
  this.space();
  this.word("module");
  this.space();
  this.print(node.id);
  this.space();
  this.print(node.body);
}
export function DeclareModuleExports(node) {
  this.word("declare");
  this.space();
  this.word("module");
  this.tokenChar(46);
  this.word("exports");
  this.print(node.typeAnnotation);
}
export function DeclareTypeAlias(node) {
  this.word("declare");
  this.space();
  TypeAlias.call(this, node);
}
export function DeclareOpaqueType(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }
  OpaqueType.call(this, node);
}
export function DeclareVariable(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }
  this.word("var");
  this.space();
  this.print(node.id);
  this.print(node.id.typeAnnotation);
  this.semicolon();
}
export function DeclareExportDeclaration(node) {
  this.word("declare");
  this.space();
  this.word("export");
  this.space();
  if (node.default) {
    this.word("default");
    this.space();
  }
  FlowExportDeclaration.call(this, node);
}
export function DeclareExportAllDeclaration(node) {
  this.word("declare");
  this.space();
  ExportAllDeclaration.call(this, node);
}
export function EnumDeclaration(node) {
  const {
    id,
    body
  } = node;
  this.word("enum");
  this.space();
  this.print(id);
  this.print(body);
}
function enumExplicitType(context, name, hasExplicitType) {
  if (hasExplicitType) {
    context.space();
    context.word("of");
    context.space();
    context.word(name);
  }
  context.space();
}
function enumBody(context, node) {
  const {
    members
  } = node;
  context.token("{");
  context.indent();
  context.newline();
  for (const member of members) {
    context.print(member);
    context.newline();
  }
  if (node.hasUnknownMembers) {
    context.token("...");
    context.newline();
  }
  context.dedent();
  context.token("}");
}
export function EnumBooleanBody(node) {
  const {
    explicitType
  } = node;
  enumExplicitType(this, "boolean", explicitType);
  enumBody(this, node);
}
export function EnumNumberBody(node) {
  const {
    explicitType
  } = node;
  enumExplicitType(this, "number", explicitType);
  enumBody(this, node);
}
export function EnumStringBody(node) {
  const {
    explicitType
  } = node;
  enumExplicitType(this, "string", explicitType);
  enumBody(this, node);
}
export function EnumSymbolBody(node) {
  enumExplicitType(this, "symbol", true);
  enumBody(this, node);
}
export function EnumDefaultedMember(node) {
  const {
    id
  } = node;
  this.print(id);
  this.tokenChar(44);
}
function enumInitializedMember(context, node) {
  context.print(node.id);
  context.space();
  context.token("=");
  context.space();
  context.print(node.init);
  context.token(",");
}
export function EnumBooleanMember(node) {
  enumInitializedMember(this, node);
}
export function EnumNumberMember(node) {
  enumInitializedMember(this, node);
}
export function EnumStringMember(node) {
  enumInitializedMember(this, node);
}
function FlowExportDeclaration(node) {
  if (node.declaration) {
    const declar = node.declaration;
    this.print(declar);
    if (!isStatement(declar)) this.semicolon();
  } else {
    this.tokenChar(123);
    if (node.specifiers.length) {
      this.space();
      this.printList(node.specifiers);
      this.space();
    }
    this.tokenChar(125);
    if (node.source) {
      this.space();
      this.word("from");
      this.space();
      this.print(node.source);
    }
    this.semicolon();
  }
}
export function ExistsTypeAnnotation() {
  this.tokenChar(42);
}
export function FunctionTypeAnnotation(node, parent) {
  this.print(node.typeParameters);
  this.tokenChar(40);
  if (node.this) {
    this.word("this");
    this.tokenChar(58);
    this.space();
    this.print(node.this.typeAnnotation);
    if (node.params.length || node.rest) {
      this.tokenChar(44);
      this.space();
    }
  }
  this.printList(node.params);
  if (node.rest) {
    if (node.params.length) {
      this.tokenChar(44);
      this.space();
    }
    this.token("...");
    this.print(node.rest);
  }
  this.tokenChar(41);
  const type = parent?.type;
  if (type != null && (type === "ObjectTypeCallProperty" || type === "ObjectTypeInternalSlot" || type === "DeclareFunction" || type === "ObjectTypeProperty" && parent.method)) {
    this.tokenChar(58);
  } else {
    this.space();
    this.token("=>");
  }
  this.space();
  this.print(node.returnType);
}
export function FunctionTypeParam(node) {
  this.print(node.name);
  if (node.optional) this.tokenChar(63);
  if (node.name) {
    this.tokenChar(58);
    this.space();
  }
  this.print(node.typeAnnotation);
}
export function InterfaceExtends(node) {
  this.print(node.id);
  this.print(node.typeParameters, true);
}
export { InterfaceExtends as ClassImplements, InterfaceExtends as GenericTypeAnnotation };
export function _interfaceish(node) {
  this.print(node.id);
  this.print(node.typeParameters);
  if (node.extends?.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(node.extends);
  }
  if (node.type === "DeclareClass") {
    if (node.mixins?.length) {
      this.space();
      this.word("mixins");
      this.space();
      this.printList(node.mixins);
    }
    if (node.implements?.length) {
      this.space();
      this.word("implements");
      this.space();
      this.printList(node.implements);
    }
  }
  this.space();
  this.print(node.body);
}
export function _variance(node) {
  const kind = node.variance?.kind;
  if (kind != null) {
    if (kind === "plus") {
      this.tokenChar(43);
    } else if (kind === "minus") {
      this.tokenChar(45);
    }
  }
}
export function InterfaceDeclaration(node) {
  this.word("interface");
  this.space();
  _interfaceish.call(this, node);
}
function andSeparator(occurrenceCount) {
  this.space();
  this.token("&", false, occurrenceCount);
  this.space();
}
export function InterfaceTypeAnnotation(node) {
  this.word("interface");
  if (node.extends?.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(node.extends);
  }
  this.space();
  this.print(node.body);
}
export function IntersectionTypeAnnotation(node) {
  this.printJoin(node.types, undefined, undefined, andSeparator);
}
export function MixedTypeAnnotation() {
  this.word("mixed");
}
export function EmptyTypeAnnotation() {
  this.word("empty");
}
export function NullableTypeAnnotation(node) {
  this.tokenChar(63);
  this.print(node.typeAnnotation);
}
export { BigIntLiteral as BigIntLiteralTypeAnnotation, NumericLiteral as NumberLiteralTypeAnnotation, StringLiteral as StringLiteralTypeAnnotation } from "./types.js";
export function NumberTypeAnnotation() {
  this.word("number");
}
export function StringTypeAnnotation() {
  this.word("string");
}
export function ThisTypeAnnotation() {
  this.word("this");
}
export function TupleTypeAnnotation(node) {
  this.tokenChar(91);
  this.printList(node.types);
  this.tokenChar(93);
}
export function TypeofTypeAnnotation(node) {
  this.word("typeof");
  this.space();
  this.print(node.argument);
}
export function TypeAlias(node) {
  this.word("type");
  this.space();
  this.print(node.id);
  this.print(node.typeParameters);
  this.space();
  this.tokenChar(61);
  this.space();
  this.print(node.right);
  this.semicolon();
}
export function TypeAnnotation(node, parent) {
  this.tokenChar(58);
  this.space();
  if (parent.type === "ArrowFunctionExpression") {
    this.tokenContext |= TokenContext.arrowFlowReturnType;
  } else if (node.optional) {
    this.tokenChar(63);
  }
  this.print(node.typeAnnotation);
}
export function TypeParameterInstantiation(node) {
  this.tokenChar(60);
  this.printList(node.params);
  this.tokenChar(62);
}
export { TypeParameterInstantiation as TypeParameterDeclaration };
export function TypeParameter(node) {
  _variance.call(this, node);
  this.word(node.name);
  if (node.bound) {
    this.print(node.bound);
  }
  if (node.default) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.default);
  }
}
export function OpaqueType(node) {
  this.word("opaque");
  this.space();
  this.word("type");
  this.space();
  this.print(node.id);
  this.print(node.typeParameters);
  if (node.supertype) {
    this.tokenChar(58);
    this.space();
    this.print(node.supertype);
  }
  if (node.impltype) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.impltype);
  }
  this.semicolon();
}
export function ObjectTypeAnnotation(node) {
  if (node.exact) {
    this.token("{|");
  } else {
    this.tokenChar(123);
  }
  const props = [...node.properties, ...(node.callProperties || []), ...(node.indexers || []), ...(node.internalSlots || [])];
  if (props.length) {
    this.newline();
    this.space();
    this.printJoin(props, true, true, () => {
      if (props.length !== 1 || node.inexact) {
        this.tokenChar(44);
        this.space();
      }
    }, true);
    this.space();
  }
  if (node.inexact) {
    this.indent();
    this.token("...");
    if (props.length) {
      this.newline();
    }
    this.dedent();
  }
  if (node.exact) {
    this.token("|}");
  } else {
    this.tokenChar(125);
  }
}
export function ObjectTypeInternalSlot(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }
  this.tokenChar(91);
  this.tokenChar(91);
  this.print(node.id);
  this.tokenChar(93);
  this.tokenChar(93);
  if (node.optional) this.tokenChar(63);
  if (!node.method) {
    this.tokenChar(58);
    this.space();
  }
  this.print(node.value);
}
export function ObjectTypeCallProperty(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }
  this.print(node.value);
}
export function ObjectTypeIndexer(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }
  _variance.call(this, node);
  this.tokenChar(91);
  if (node.id) {
    this.print(node.id);
    this.tokenChar(58);
    this.space();
  }
  this.print(node.key);
  this.tokenChar(93);
  this.tokenChar(58);
  this.space();
  this.print(node.value);
}
export function ObjectTypeProperty(node) {
  if (node.proto) {
    this.word("proto");
    this.space();
  }
  if (node.static) {
    this.word("static");
    this.space();
  }
  if (node.kind === "get" || node.kind === "set") {
    this.word(node.kind);
    this.space();
  }
  _variance.call(this, node);
  this.print(node.key);
  if (node.optional) this.tokenChar(63);
  if (!node.method) {
    this.tokenChar(58);
    this.space();
  }
  this.print(node.value);
}
export function ObjectTypeSpreadProperty(node) {
  this.token("...");
  this.print(node.argument);
}
export function QualifiedTypeIdentifier(node) {
  this.print(node.qualification);
  this.tokenChar(46);
  this.print(node.id);
}
export function SymbolTypeAnnotation() {
  this.word("symbol");
}
function orSeparator(occurrenceCount) {
  this.space();
  this.token("|", false, occurrenceCount);
  this.space();
}
export function UnionTypeAnnotation(node) {
  this.printJoin(node.types, undefined, undefined, orSeparator);
}
export function TypeCastExpression(node) {
  this.tokenChar(40);
  this.print(node.expression);
  this.print(node.typeAnnotation);
  this.tokenChar(41);
}
export function Variance(node) {
  if (node.kind === "plus") {
    this.tokenChar(43);
  } else {
    this.tokenChar(45);
  }
}
export function VoidTypeAnnotation() {
  this.word("void");
}
export function IndexedAccessType(node) {
  this.print(node.objectType, true);
  this.tokenChar(91);
  this.print(node.indexType);
  this.tokenChar(93);
}
export function OptionalIndexedAccessType(node) {
  this.print(node.objectType);
  if (node.optional) {
    this.token("?.");
  }
  this.tokenChar(91);
  this.print(node.indexType);
  this.tokenChar(93);
}