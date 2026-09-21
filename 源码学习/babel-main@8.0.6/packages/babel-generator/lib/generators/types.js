import * as _t from "@babel/types";
const {
  isAssignmentPattern,
  isIdentifier
} = _t;
import jsesc from "jsesc";
import { _methodHead } from "./methods.js";
let lastRawIdentResult = "";
export function _getRawIdentifier(node) {
  const {
    name
  } = node;
  const token = this.tokenMap.find(node, tok => tok.value === name);
  if (token) {
    lastRawIdentResult = this._originalCode.slice(token.start, token.end);
    return lastRawIdentResult;
  }
  return lastRawIdentResult = node.name;
}
export function Identifier(node) {
  if (this._buf._map && node.loc?.identifierName && node.loc.identifierName !== node.name) {
    this.sourceIdentifierName(node.loc.identifierName);
  }
  this.word(this.tokenMap ? lastRawIdentResult : node.name);
}
export function ArgumentPlaceholder() {
  this.tokenChar(63);
}
export function RestElement(node) {
  this.token("...");
  this.print(node.argument);
}
export { RestElement as SpreadElement };
export function ObjectExpression(node) {
  const props = node.properties;
  this.tokenChar(123);
  if (props.length) {
    const oldNoLineTerminatorAfterNode = this.enterDelimited();
    this.space();
    this.printList(props, this.shouldPrintTrailingComma("}"), true, true, undefined, true);
    this.space();
    this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
  }
  this.rightBrace(node);
}
export { ObjectExpression as ObjectPattern };
export function ObjectMethod(node) {
  this.printJoin(node.decorators);
  _methodHead.call(this, node);
  this.space();
  this.print(node.body);
}
export function ObjectProperty(node) {
  this.printJoin(node.decorators);
  if (node.computed) {
    this.tokenChar(91);
    this.print(node.key);
    this.tokenChar(93);
  } else {
    if (isAssignmentPattern(node.value) && isIdentifier(node.key) && node.key.name === node.value.left.name) {
      this.print(node.value);
      return;
    }
    this.print(node.key);
    if (node.shorthand && isIdentifier(node.key) && isIdentifier(node.value) && node.key.name === node.value.name) {
      return;
    }
  }
  this.tokenChar(58);
  this.space();
  this.print(node.value);
}
export function ArrayExpression(node) {
  const elems = node.elements;
  const len = elems.length;
  this.tokenChar(91);
  const oldNoLineTerminatorAfterNode = this.enterDelimited();
  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    if (elem) {
      if (i > 0) this.space();
      this.print(elem, undefined, true);
      if (i < len - 1 || this.shouldPrintTrailingComma("]")) {
        this.tokenChar(44, i);
      }
    } else {
      this.tokenChar(44, i);
    }
  }
  this._noLineTerminatorAfterNode = oldNoLineTerminatorAfterNode;
  this.tokenChar(93);
}
export { ArrayExpression as ArrayPattern };
export function RegExpLiteral(node) {
  this.word(`/${node.pattern}/${node.flags}`, false);
}
export function BooleanLiteral(node) {
  this.word(node.value ? "true" : "false");
}
export function NullLiteral() {
  this.word("null");
}
export function NumericLiteral(node) {
  const raw = this.getPossibleRaw(node);
  const opts = this.format.jsescOption;
  const value = node.value;
  const str = value + "";
  if (opts.numbers) {
    this.number(jsesc(value, opts), value);
  } else if (raw == null) {
    this.number(str, value);
  } else if (this.format.minified) {
    this.number(raw.length < str.length ? raw : str, value);
  } else {
    this.number(raw, value);
  }
}
export function StringLiteral(node) {
  const raw = this.getPossibleRaw(node);
  if (!this.format.minified && raw !== undefined) {
    this.token(raw);
    return;
  }
  const val = jsesc(node.value, this.format.jsescOption);
  this.token(val);
}
export function BigIntLiteral(node) {
  const raw = this.getPossibleRaw(node);
  if (!this.format.minified && raw !== undefined) {
    this.word(raw);
    return;
  }
  this.word(node.value + "n");
}
const validTopicTokenSet = new Set(["^^", "@@", "^", "%", "#"]);
export function TopicReference() {
  const {
    topicToken
  } = this.format;
  if (validTopicTokenSet.has(topicToken)) {
    this.token(topicToken);
  } else {
    const givenTopicTokenJSON = JSON.stringify(topicToken);
    const validTopics = Array.from(validTopicTokenSet, v => JSON.stringify(v));
    throw new Error(`The "topicToken" generator option must be one of ` + `${validTopics.join(", ")} (${givenTopicTokenJSON} received instead).`);
  }
}
export function VoidPattern() {
  this.word("void");
}