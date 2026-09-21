import { tokenIsLiteralPropertyName, tt } from "../tokenizer/types.js";
import Tokenizer from "../tokenizer/index.js";
import { hasNewLine } from "../util/whitespace.js";
import { isIdentifierChar } from "../util/identifier.js";
import ClassScopeHandler from "../util/class-scope.js";
import ExpressionScopeHandler from "../util/expression-scope.js";
import { ScopeFlag } from "../util/scopeflags.js";
import ProductionParameterHandler, { ParamKind } from "../util/production-parameter.js";
import { Errors } from "../parse-error.js";
import { OptionFlags } from "../options.js";
export default class UtilParser extends Tokenizer {
  addExtra(node, key, value, enumerable = true) {
    if (!node) return;
    let {
      extra
    } = node;
    if (extra == null) {
      extra = {};
      node.extra = extra;
    }
    if (enumerable) {
      extra[key] = value;
    } else {
      Object.defineProperty(extra, key, {
        enumerable,
        value
      });
    }
  }
  isContextual(token) {
    return this.state.type === token && !this.state.containsEsc;
  }
  isUnparsedContextual(nameStart, name) {
    if (this.input.startsWith(name, nameStart)) {
      const nextCh = this.input.charCodeAt(nameStart + name.length);
      return !(isIdentifierChar(nextCh) || (nextCh & 0xfc00) === 0xd800);
    }
    return false;
  }
  isLookaheadContextual(name) {
    const next = this.nextTokenStart();
    return this.isUnparsedContextual(next, name);
  }
  eatContextual(token) {
    if (this.isContextual(token)) {
      this.next();
      return true;
    }
    return false;
  }
  expectContextual(token, toParseError) {
    if (!this.eatContextual(token)) {
      if (toParseError != null) {
        throw this.raise(toParseError, this.state.startLoc);
      }
      this.unexpected(null, token);
    }
  }
  canInsertSemicolon() {
    return this.match(135) || this.match(4) || this.hasPrecedingLineBreak();
  }
  hasPrecedingLineBreak() {
    return hasNewLine(this.input, this.offsetToSourcePos(this.state.lastTokEndLoc.index), this.state.start);
  }
  hasFollowingLineBreak() {
    return hasNewLine(this.input, this.state.end, this.nextTokenStart());
  }
  isLineTerminator() {
    return this.eat(9) || this.canInsertSemicolon();
  }
  semicolon(allowAsi = true) {
    if (allowAsi ? this.isLineTerminator() : this.eat(9)) return;
    this.raise(Errors.MissingSemicolon, this.state.lastTokEndLoc);
  }
  expect(type, loc) {
    if (!this.eat(type)) {
      this.unexpected(loc, type);
    }
  }
  tryParse(fn, oldState = this.state.clone()) {
    const abortSignal = {
      node: null
    };
    try {
      const node = fn((node = null) => {
        abortSignal.node = node;
        throw abortSignal;
      });
      if (this.state.errors.length > oldState.errors.length) {
        const failState = this.state;
        this.state = oldState;
        this.state.tokensLength = failState.tokensLength;
        return {
          node,
          error: failState.errors[oldState.errors.length],
          thrown: false,
          aborted: false,
          failState
        };
      }
      return {
        node: node,
        error: null,
        thrown: false,
        aborted: false,
        failState: null
      };
    } catch (error) {
      const failState = this.state;
      this.state = oldState;
      if (error instanceof SyntaxError) {
        return {
          node: null,
          error,
          thrown: true,
          aborted: false,
          failState
        };
      }
      if (error === abortSignal) {
        return {
          node: abortSignal.node,
          error: null,
          thrown: false,
          aborted: true,
          failState
        };
      }
      throw error;
    }
  }
  checkExpressionErrors(refExpressionErrors, andThrow) {
    if (!refExpressionErrors) return false;
    const {
      shorthandAssignLoc,
      doubleProtoLoc,
      privateKeyLoc,
      optionalParametersLoc,
      voidPatternLoc
    } = refExpressionErrors;
    const hasErrors = !!shorthandAssignLoc || !!doubleProtoLoc || !!optionalParametersLoc || !!privateKeyLoc || !!voidPatternLoc;
    if (!andThrow) {
      return hasErrors;
    }
    if (shorthandAssignLoc != null) {
      this.raise(Errors.InvalidCoverInitializedName, shorthandAssignLoc);
    }
    if (doubleProtoLoc != null) {
      this.raise(Errors.DuplicateProto, doubleProtoLoc);
    }
    if (privateKeyLoc != null) {
      this.raise(Errors.UnexpectedPrivateField, privateKeyLoc);
    }
    if (optionalParametersLoc != null) {
      this.unexpected(optionalParametersLoc);
    }
    if (voidPatternLoc != null) {
      this.raise(Errors.InvalidCoverDiscardElement, voidPatternLoc);
    }
  }
  isLiteralPropertyName() {
    return tokenIsLiteralPropertyName(this.state.type);
  }
  isPrivateName(node) {
    return node.type === "PrivateName";
  }
  getPrivateNameSV(node) {
    return node.id.name;
  }
  hasPropertyAsPrivateName(node) {
    return (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") && this.isPrivateName(node.property);
  }
  isObjectProperty(node) {
    return node.type === "ObjectProperty";
  }
  isObjectMethod(node) {
    return node.type === "ObjectMethod";
  }
  initializeScopes(inModule = this.options.sourceType === "module") {
    const oldLabels = this.state.labels;
    this.state.labels = [];
    const oldExportedIdentifiers = this.exportedIdentifiers;
    this.exportedIdentifiers = new Set();
    const oldInModule = this.inModule;
    this.inModule = inModule;
    const oldScope = this.scope;
    const ScopeHandler = this.getScopeHandler();
    this.scope = new ScopeHandler(this, inModule);
    const oldProdParam = this.prodParam;
    this.prodParam = new ProductionParameterHandler();
    const oldClassScope = this.classScope;
    this.classScope = new ClassScopeHandler(this);
    const oldExpressionScope = this.expressionScope;
    this.expressionScope = new ExpressionScopeHandler(this);
    return () => {
      this.state.labels = oldLabels;
      this.exportedIdentifiers = oldExportedIdentifiers;
      this.inModule = oldInModule;
      this.scope = oldScope;
      this.prodParam = oldProdParam;
      this.classScope = oldClassScope;
      this.expressionScope = oldExpressionScope;
    };
  }
  enterInitialScopes() {
    let paramFlags = ParamKind.PARAM;
    if (this.inModule || this.optionFlags & OptionFlags.AllowAwaitOutsideFunction) {
      paramFlags |= ParamKind.PARAM_AWAIT;
    }
    if (this.optionFlags & OptionFlags.AllowYieldOutsideFunction) {
      paramFlags |= ParamKind.PARAM_YIELD;
    }
    const isCommonJS = !this.inModule && this.options.sourceType === "commonjs";
    if (isCommonJS || this.optionFlags & OptionFlags.AllowReturnOutsideFunction) {
      paramFlags |= ParamKind.PARAM_RETURN;
    }
    this.prodParam.enter(paramFlags);
    let scopeFlags = isCommonJS ? ScopeFlag.FUNCTION : ScopeFlag.PROGRAM;
    if (this.optionFlags & OptionFlags.AllowNewTargetOutsideFunction) {
      scopeFlags |= ScopeFlag.NEW_TARGET;
    }
    if (this.optionFlags & OptionFlags.AllowSuperOutsideMethod) {
      scopeFlags |= ScopeFlag.SUPER | ScopeFlag.DIRECT_SUPER;
    }
    this.scope.enter(scopeFlags);
  }
  checkDestructuringPrivate(refExpressionErrors) {
    const {
      privateKeyLoc
    } = refExpressionErrors;
    if (privateKeyLoc !== null) {
      this.expectPlugin("destructuringPrivate", privateKeyLoc);
    }
  }
}
export class ExpressionErrors {
  shorthandAssignLoc = null;
  doubleProtoLoc = null;
  privateKeyLoc = null;
  optionalParametersLoc = null;
  voidPatternLoc = null;
}