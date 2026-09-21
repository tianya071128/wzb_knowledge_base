import { Position } from "../util/location.js";
import { types as ct } from "./context.js";
import { tt } from "./types.js";
export const LoopLabelKind = {
  Loop: 1,
  Switch: 2
};
export default class State {
  flags = 2048;
  get strict() {
    return (this.flags & 1) > 0;
  }
  set strict(v) {
    if (v) this.flags |= 1;else this.flags &= -2;
  }
  startIndex;
  curLine;
  lineStart;
  startLoc;
  endLoc;
  init({
    strictMode,
    sourceType,
    startIndex,
    startLine,
    startColumn
  }) {
    this.strict = strictMode === false ? false : strictMode === true ? true : sourceType === "module";
    this.startIndex = startIndex;
    this.curLine = startLine;
    this.lineStart = -startColumn;
    this.startLoc = this.endLoc = new Position(startLine, startColumn, startIndex);
  }
  errors = [];
  noArrowAt = [];
  noArrowParamsConversionAt = [];
  get canStartArrow() {
    return (this.flags & 2) > 0;
  }
  set canStartArrow(v) {
    if (v) this.flags |= 2;else this.flags &= -3;
  }
  get inType() {
    return (this.flags & 4) > 0;
  }
  set inType(v) {
    if (v) this.flags |= 4;else this.flags &= -5;
  }
  get noAnonFunctionType() {
    return (this.flags & 8) > 0;
  }
  set noAnonFunctionType(v) {
    if (v) this.flags |= 8;else this.flags &= -9;
  }
  get hasFlowComment() {
    return (this.flags & 16) > 0;
  }
  set hasFlowComment(v) {
    if (v) this.flags |= 16;else this.flags &= -17;
  }
  get isAmbientContext() {
    return (this.flags & 32) > 0;
  }
  set isAmbientContext(v) {
    if (v) this.flags |= 32;else this.flags &= -33;
  }
  get inAbstractClass() {
    return (this.flags & 64) > 0;
  }
  set inAbstractClass(v) {
    if (v) this.flags |= 64;else this.flags &= -65;
  }
  get inDisallowConditionalTypesContext() {
    return (this.flags & 128) > 0;
  }
  set inDisallowConditionalTypesContext(v) {
    if (v) this.flags |= 128;else this.flags &= -129;
  }
  get inConditionalConsequent() {
    return (this.flags & 256) > 0;
  }
  set inConditionalConsequent(v) {
    if (v) this.flags |= 256;else this.flags &= -257;
  }
  get inHackPipelineBody() {
    return (this.flags & 512) > 0;
  }
  set inHackPipelineBody(v) {
    if (v) this.flags |= 512;else this.flags &= -513;
  }
  get seenTopicReference() {
    return (this.flags & 1024) > 0;
  }
  set seenTopicReference(v) {
    if (v) this.flags |= 1024;else this.flags &= -1025;
  }
  labels = [];
  commentsLen = 0;
  commentStack = [];
  pos = 0;
  type = 135;
  value = null;
  start = 0;
  end = 0;
  lastTokEndLoc = null;
  lastTokStartLoc = null;
  context = [ct.brace];
  get canStartJSXElement() {
    return (this.flags & 2048) > 0;
  }
  set canStartJSXElement(v) {
    if (v) this.flags |= 2048;else this.flags &= -2049;
  }
  get containsEsc() {
    return (this.flags & 4096) > 0;
  }
  set containsEsc(v) {
    if (v) this.flags |= 4096;else this.flags &= -4097;
  }
  firstInvalidTemplateEscapePos = null;
  get hasTopLevelAwait() {
    return (this.flags & 8192) > 0;
  }
  set hasTopLevelAwait(v) {
    if (v) this.flags |= 8192;else this.flags &= -8193;
  }
  strictErrors = new Map();
  tokensLength = 0;
  curPosition() {
    return new Position(this.curLine, this.pos - this.lineStart, this.pos + this.startIndex);
  }
  clone() {
    const state = new State();
    state.flags = this.flags;
    state.startIndex = this.startIndex;
    state.curLine = this.curLine;
    state.lineStart = this.lineStart;
    state.startLoc = this.startLoc;
    state.endLoc = this.endLoc;
    state.errors = this.errors.slice();
    state.noArrowAt = this.noArrowAt.slice();
    state.noArrowParamsConversionAt = this.noArrowParamsConversionAt.slice();
    state.labels = this.labels.slice();
    state.commentsLen = this.commentsLen;
    state.commentStack = this.commentStack.slice();
    state.pos = this.pos;
    state.type = this.type;
    state.value = this.value;
    state.start = this.start;
    state.end = this.end;
    state.lastTokEndLoc = this.lastTokEndLoc;
    state.lastTokStartLoc = this.lastTokStartLoc;
    state.context = this.context.slice();
    state.firstInvalidTemplateEscapePos = this.firstInvalidTemplateEscapePos;
    state.strictErrors = this.strictErrors;
    state.tokensLength = this.tokensLength;
    return state;
  }
}