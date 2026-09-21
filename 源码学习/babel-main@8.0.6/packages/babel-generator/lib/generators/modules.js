import * as _t from "@babel/types";
const {
  isClassDeclaration,
  isExportDefaultSpecifier,
  isExportNamespaceSpecifier,
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isStatement
} = _t;
import { TokenContext } from "../node/index.js";
import { _shouldPrintDecoratorsBeforeExport } from "./expressions.js";
export function ImportSpecifier(node) {
  if (node.importKind === "type" || node.importKind === "typeof") {
    this.word(node.importKind);
    this.space();
  }
  this.print(node.imported);
  if (node.local && node.local.name !== node.imported.name) {
    this.space();
    this.word("as");
    this.space();
    this.print(node.local);
  }
}
export function ImportDefaultSpecifier(node) {
  this.print(node.local);
}
export function ExportDefaultSpecifier(node) {
  this.print(node.exported);
}
export function ExportSpecifier(node) {
  if (node.exportKind === "type") {
    this.word("type");
    this.space();
  }
  this.print(node.local);
  if (node.exported && node.local.name !== node.exported.name) {
    this.space();
    this.word("as");
    this.space();
    this.print(node.exported);
  }
}
export function ExportNamespaceSpecifier(node) {
  this.tokenChar(42);
  this.space();
  this.word("as");
  this.space();
  this.print(node.exported);
}
export function _printAttributes(node, hasPreviousBrace) {
  const {
    attributes
  } = node;
  this.word("with");
  this.space();
  const occurrenceCount = hasPreviousBrace ? 1 : 0;
  this.token("{", undefined, occurrenceCount);
  this.space();
  this.printList(attributes, this.shouldPrintTrailingComma("}"));
  this.space();
  this.token("}", undefined, occurrenceCount);
}
export function ExportAllDeclaration(node) {
  this.word("export");
  this.space();
  if (node.exportKind === "type") {
    this.word("type");
    this.space();
  }
  this.tokenChar(42);
  this.space();
  this.word("from");
  this.space();
  if (node.attributes?.length) {
    this.print(node.source, true);
    this.space();
    _printAttributes.call(this, node, false);
  } else {
    this.print(node.source);
  }
  this.semicolon();
}
function maybePrintDecoratorsBeforeExport(printer, node) {
  if (isClassDeclaration(node.declaration) && _shouldPrintDecoratorsBeforeExport.call(printer, node)) {
    printer.printJoin(node.declaration.decorators);
  }
}
export function ExportNamedDeclaration(node) {
  maybePrintDecoratorsBeforeExport(this, node);
  this.word("export");
  this.space();
  if (node.declaration) {
    const declar = node.declaration;
    this.print(declar);
    if (!isStatement(declar)) this.semicolon();
  } else {
    if (node.exportKind === "type") {
      this.word("type");
      this.space();
    }
    const specifiers = node.specifiers.slice(0);
    let hasSpecial = false;
    for (;;) {
      const first = specifiers[0];
      if (isExportDefaultSpecifier(first) || isExportNamespaceSpecifier(first)) {
        hasSpecial = true;
        this.print(specifiers.shift());
        if (specifiers.length) {
          this.tokenChar(44);
          this.space();
        }
      } else {
        break;
      }
    }
    let hasBrace = false;
    if (specifiers.length || !specifiers.length && !hasSpecial) {
      hasBrace = true;
      this.tokenChar(123);
      if (specifiers.length) {
        this.space();
        this.printList(specifiers, this.shouldPrintTrailingComma("}"));
        this.space();
      }
      this.tokenChar(125);
    }
    if (node.source) {
      this.space();
      this.word("from");
      this.space();
      if (node.attributes?.length) {
        this.print(node.source, true);
        this.space();
        _printAttributes.call(this, node, hasBrace);
      } else {
        this.print(node.source);
      }
    }
    this.semicolon();
  }
}
export function ExportDefaultDeclaration(node) {
  maybePrintDecoratorsBeforeExport(this, node);
  this.word("export");
  this.noIndentInnerCommentsHere();
  this.space();
  this.word("default");
  this.space();
  this.tokenContext |= TokenContext.exportDefault;
  const declar = node.declaration;
  this.print(declar);
  if (!isStatement(declar)) this.semicolon();
}
export function ImportDeclaration(node) {
  this.word("import");
  this.space();
  const isTypeKind = node.importKind === "type" || node.importKind === "typeof";
  if (isTypeKind) {
    this.noIndentInnerCommentsHere();
    this.word(node.importKind);
    this.space();
  } else if (node.module) {
    this.noIndentInnerCommentsHere();
    this.word("module");
    this.space();
  } else if (node.phase) {
    this.noIndentInnerCommentsHere();
    this.word(node.phase);
    this.space();
  }
  const specifiers = node.specifiers.slice(0);
  const hasSpecifiers = !!specifiers.length;
  while (hasSpecifiers) {
    const first = specifiers[0];
    if (isImportDefaultSpecifier(first) || isImportNamespaceSpecifier(first)) {
      this.print(specifiers.shift());
      if (specifiers.length) {
        this.tokenChar(44);
        this.space();
      }
    } else {
      break;
    }
  }
  let hasBrace = false;
  if (specifiers.length) {
    hasBrace = true;
    this.tokenChar(123);
    this.space();
    this.printList(specifiers, this.shouldPrintTrailingComma("}"));
    this.space();
    this.tokenChar(125);
  } else if (isTypeKind && !hasSpecifiers) {
    hasBrace = true;
    this.tokenChar(123);
    this.tokenChar(125);
  }
  if (hasSpecifiers || isTypeKind) {
    this.space();
    this.word("from");
    this.space();
  }
  if (node.attributes?.length) {
    this.print(node.source, true);
    this.space();
    _printAttributes.call(this, node, hasBrace);
  } else {
    this.print(node.source);
  }
  this.semicolon();
}
export function ImportAttribute(node) {
  this.print(node.key);
  this.tokenChar(58);
  this.space();
  this.print(node.value);
}
export function ImportNamespaceSpecifier(node) {
  this.tokenChar(42);
  this.space();
  this.word("as");
  this.space();
  this.print(node.local);
}
export function ImportExpression(node) {
  this.word("import");
  if (node.phase) {
    this.tokenChar(46);
    this.word(node.phase);
  }
  this.tokenChar(40);
  const shouldPrintTrailingComma = this.shouldPrintTrailingComma(")");
  this.print(node.source);
  if (node.options != null) {
    this.tokenChar(44);
    this.space();
    this.print(node.options);
  }
  if (shouldPrintTrailingComma) {
    this.tokenChar(44);
  }
  this.rightParens(node);
}