import * as _t from "@babel/types";
const {
  isExportDefaultDeclaration,
  isExportNamedDeclaration
} = _t;
import { _shouldPrintDecoratorsBeforeExport } from "./expressions.js";
import { _tsPrintClassMemberModifiers } from "./typescript.js";
import { _variance } from "./flow.js";
import { _methodHead } from "./methods.js";
export function ClassDeclaration(node, parent) {
  const inExport = isExportDefaultDeclaration(parent) || isExportNamedDeclaration(parent);
  if (!inExport || !_shouldPrintDecoratorsBeforeExport.call(this, parent)) {
    this.printJoin(node.decorators);
  }
  if (node.declare) {
    this.word("declare");
    this.space();
  }
  if (node.abstract) {
    this.word("abstract");
    this.space();
  }
  this.word("class");
  if (node.id) {
    this.space();
    this.print(node.id);
  }
  this.print(node.typeParameters);
  if (node.superClass) {
    this.space();
    this.word("extends");
    this.space();
    this.print(node.superClass);
    this.print(node.superTypeArguments);
  }
  if (node.implements) {
    this.space();
    this.word("implements");
    this.space();
    this.printList(node.implements);
  }
  this.space();
  this.print(node.body);
}
export { ClassDeclaration as ClassExpression };
export function ClassBody(node) {
  this.tokenChar(123);
  if (node.body.length === 0) {
    this.tokenChar(125);
  } else {
    const separator = classBodyEmptySemicolonsPrinter(this, node);
    separator?.(-1);
    const oldNoLineTerminatorAfterNode = this.enterDelimited();
    this.printJoin(node.body, true, true, separator, true, true);
    this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
    if (!this.endsWith(10)) this.newline();
    this.rightBrace(node);
  }
}
function classBodyEmptySemicolonsPrinter(printer, node) {
  if (!printer.tokenMap || node.start == null || node.end == null) {
    return null;
  }
  const indexes = printer.tokenMap.getIndexes(node);
  if (!indexes) return null;
  let k = 1;
  let occurrenceCount = 0;
  let nextLocIndex = 0;
  const advanceNextLocIndex = () => {
    while (nextLocIndex < node.body.length && node.body[nextLocIndex].start == null) {
      nextLocIndex++;
    }
  };
  advanceNextLocIndex();
  return i => {
    if (nextLocIndex <= i) {
      nextLocIndex = i + 1;
      advanceNextLocIndex();
    }
    const end = nextLocIndex === node.body.length ? node.end : node.body[nextLocIndex].start;
    let tok;
    while (k < indexes.length && printer.tokenMap.matchesOriginal(tok = printer._tokens[indexes[k]], ";") && tok.start < end) {
      printer.tokenChar(59, occurrenceCount++);
      k++;
    }
  };
}
export function ClassProperty(node) {
  this.printJoin(node.decorators);
  if (!node.static && !this.format.preserveFormat) {
    const endLine = node.key.loc?.end?.line;
    if (endLine) this.catchUp(endLine);
  }
  _tsPrintClassMemberModifiers.call(this, node);
  if (node.computed) {
    this.tokenChar(91);
    this.print(node.key);
    this.tokenChar(93);
  } else {
    _variance.call(this, node);
    this.print(node.key);
  }
  if (node.optional) {
    this.tokenChar(63);
  }
  if (node.definite) {
    this.tokenChar(33);
  }
  this.print(node.typeAnnotation);
  if (node.value) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.value);
  }
  this.semicolon();
}
export function ClassAccessorProperty(node) {
  this.printJoin(node.decorators);
  const endLine = node.key.loc?.end?.line;
  if (endLine) this.catchUp(endLine);
  _tsPrintClassMemberModifiers.call(this, node);
  this.word("accessor", true);
  this.space();
  if (node.computed) {
    this.tokenChar(91);
    this.print(node.key);
    this.tokenChar(93);
  } else {
    _variance.call(this, node);
    this.print(node.key);
  }
  if (node.optional) {
    this.tokenChar(63);
  }
  if (node.definite) {
    this.tokenChar(33);
  }
  this.print(node.typeAnnotation);
  if (node.value) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.value);
  }
  this.semicolon();
}
export function ClassPrivateProperty(node) {
  this.printJoin(node.decorators);
  _tsPrintClassMemberModifiers.call(this, node);
  this.print(node.key);
  if (node.optional) {
    this.tokenChar(63);
  }
  if (node.definite) {
    this.tokenChar(33);
  }
  this.print(node.typeAnnotation);
  if (node.value) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.value);
  }
  this.semicolon();
}
export function ClassMethod(node) {
  _classMethodHead.call(this, node);
  this.space();
  this.print(node.body);
}
export function ClassPrivateMethod(node) {
  _classMethodHead.call(this, node);
  this.space();
  this.print(node.body);
}
export function _classMethodHead(node, allowDecorators = true) {
  if (allowDecorators) {
    this.printJoin(node.decorators);
  }
  if (!this.format.preserveFormat) {
    const endLine = node.key.loc?.end?.line;
    if (endLine) this.catchUp(endLine);
  }
  _tsPrintClassMemberModifiers.call(this, node);
  _methodHead.call(this, node);
}
export function StaticBlock(node) {
  this.word("static");
  this.space();
  this.tokenChar(123);
  if (node.body.length === 0) {
    this.tokenChar(125);
  } else {
    this.newline();
    this.printSequence(node.body, true);
    this.rightBrace(node);
  }
}