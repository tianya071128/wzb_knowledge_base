import * as _t from "@babel/types";
const {
  isFor,
  isIfStatement,
  isStatement,
  isVoidPattern
} = _t;
import { TokenContext } from "../node/index.js";
export function WithStatement(node) {
  this.word("with");
  this.space();
  this.tokenChar(40);
  this.print(node.object);
  this.tokenChar(41);
  this.printBlock(node.body);
}
export function IfStatement(node) {
  this.word("if");
  this.space();
  this.tokenChar(40);
  this.print(node.test);
  this.tokenChar(41);
  this.space();
  const needsBlock = node.alternate && isIfStatement(getLastStatement(node.consequent));
  if (needsBlock) {
    this.tokenChar(123);
    this.newline();
    this.indent();
  }
  this.printAndIndentOnComments(node.consequent);
  if (needsBlock) {
    this.dedent();
    this.newline();
    this.tokenChar(125);
  }
  if (node.alternate) {
    if (this.endsWith(125)) this.space();
    this.word("else");
    this.space();
    this.printAndIndentOnComments(node.alternate);
  }
}
function getLastStatement(statement) {
  const {
    body
  } = statement;
  if (isStatement(body) === false) {
    return statement;
  }
  return getLastStatement(body);
}
export function ForStatement(node) {
  this.word("for");
  this.space();
  this.tokenChar(40);
  this.tokenContext |= TokenContext.forInitHead | TokenContext.forInOrInitHeadAccumulate;
  this.print(node.init);
  this.tokenContext = TokenContext.normal;
  this.tokenChar(59);
  if (node.test) {
    this.space();
    this.print(node.test);
  }
  this.tokenChar(59, 1);
  if (node.update) {
    this.space();
    this.print(node.update);
  }
  this.tokenChar(41);
  this.printBlock(node.body);
}
export function WhileStatement(node) {
  this.word("while");
  this.space();
  this.tokenChar(40);
  this.print(node.test);
  this.tokenChar(41);
  this.printBlock(node.body);
}
export function ForInStatement(node) {
  this.word("for");
  this.space();
  this.noIndentInnerCommentsHere();
  this.tokenChar(40);
  this.tokenContext |= TokenContext.forInHead | TokenContext.forInOrInitHeadAccumulate;
  this.print(node.left);
  this.tokenContext = TokenContext.normal;
  this.space();
  this.word("in");
  this.space();
  this.print(node.right);
  this.tokenChar(41);
  this.printBlock(node.body);
}
export function ForOfStatement(node) {
  this.word("for");
  this.space();
  if (node.await) {
    this.word("await");
    this.space();
  }
  this.noIndentInnerCommentsHere();
  this.tokenChar(40);
  this.tokenContext |= TokenContext.forOfHead;
  this.print(node.left);
  this.space();
  this.word("of");
  this.space();
  this.print(node.right);
  this.tokenChar(41);
  this.printBlock(node.body);
}
export function DoWhileStatement(node) {
  this.word("do");
  this.space();
  this.print(node.body);
  this.space();
  this.word("while");
  this.space();
  this.tokenChar(40);
  this.print(node.test);
  this.tokenChar(41);
  this.semicolon();
}
function printStatementAfterKeyword(printer, node) {
  if (node) {
    printer.space();
    printer.printTerminatorless(node);
  }
  printer.semicolon();
}
export function BreakStatement(node) {
  this.word("break");
  printStatementAfterKeyword(this, node.label);
}
export function ContinueStatement(node) {
  this.word("continue");
  printStatementAfterKeyword(this, node.label);
}
export function ReturnStatement(node) {
  this.word("return");
  printStatementAfterKeyword(this, node.argument);
}
export function ThrowStatement(node) {
  this.word("throw");
  printStatementAfterKeyword(this, node.argument);
}
export function LabeledStatement(node) {
  this.print(node.label);
  this.tokenChar(58);
  this.space();
  this.print(node.body);
}
export function TryStatement(node) {
  this.word("try");
  this.space();
  this.print(node.block);
  this.space();
  if (node.handlers) {
    this.print(node.handlers[0]);
  } else {
    this.print(node.handler);
  }
  if (node.finalizer) {
    this.space();
    this.word("finally");
    this.space();
    this.print(node.finalizer);
  }
}
export function CatchClause(node) {
  this.word("catch");
  this.space();
  if (node.param) {
    this.tokenChar(40);
    this.print(node.param);
    this.print(node.param.typeAnnotation);
    this.tokenChar(41);
    this.space();
  }
  this.print(node.body);
}
export function SwitchStatement(node) {
  this.word("switch");
  this.space();
  this.tokenChar(40);
  this.print(node.discriminant);
  this.tokenChar(41);
  this.space();
  this.tokenChar(123);
  this.printSequence(node.cases, true);
  this.rightBrace(node);
}
export function SwitchCase(node) {
  if (node.test) {
    this.word("case");
    this.space();
    this.print(node.test);
    this.tokenChar(58);
  } else {
    this.word("default");
    this.tokenChar(58);
  }
  if (node.consequent.length) {
    this.newline();
    this.printSequence(node.consequent, true);
  }
}
export function DebuggerStatement() {
  this.word("debugger");
  this.semicolon();
}
function commaSeparatorWithNewline(occurrenceCount) {
  this.tokenChar(44, occurrenceCount);
  this.newline();
}
export function VariableDeclaration(node, parent) {
  if (node.declare) {
    this.word("declare");
    this.space();
  }
  const {
    kind
  } = node;
  switch (kind) {
    case "await using":
      this.word("await");
      this.space();
    case "using":
      this.word("using", true);
      break;
    default:
      this.word(kind);
  }
  this.space();
  let hasInits = false;
  if (!isFor(parent)) {
    for (const declar of node.declarations) {
      if (declar.init) {
        hasInits = true;
        break;
      }
    }
  }
  this.printList(node.declarations, undefined, undefined, node.declarations.length > 1, hasInits ? commaSeparatorWithNewline : undefined);
  if (parent != null) {
    switch (parent.type) {
      case "ForStatement":
        if (parent.init === node) {
          return;
        }
        break;
      case "ForInStatement":
      case "ForOfStatement":
        if (parent.left === node) {
          return;
        }
    }
  }
  this.semicolon();
}
export function VariableDeclarator(node) {
  this.print(node.id);
  if (node.definite) this.tokenChar(33);
  if (!isVoidPattern(node.id)) {
    this.print(node.id.typeAnnotation);
  }
  if (node.init) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.init);
  }
}