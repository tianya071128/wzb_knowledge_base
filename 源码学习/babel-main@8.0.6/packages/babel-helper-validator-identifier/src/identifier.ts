import * as charCodes from "charcodes";
import {
  bmpIdentifier,
  bmpIdentifierStart,
  supplementaryIdentifierCodes,
  supplementaryIdentifierStartCodes,
} from "./identifier-regex.ts";

// This has a complexity linear to the value of the code. The
// assumption is that looking up supplementary identifier characters is
// rare.
function isInSupplementarySet(code: number, set: readonly number[]): boolean {
  let pos = 0x10000;
  for (let i = 0, length = set.length; i < length; i += 2) {
    pos += set[i];
    if (pos > code) return false;

    pos += set[i + 1];
    if (pos >= code) return true;
  }
  return false;
}

// Test whether a given character code starts an identifier.

export function isIdentifierStart(code: number): boolean {
  if (code < charCodes.uppercaseA) return code === charCodes.dollarSign;
  if (code <= charCodes.uppercaseZ) return true;
  if (code < charCodes.lowercaseA) return code === charCodes.underscore;
  if (code <= charCodes.lowercaseZ) return true;
  if (code <= 0xffff) {
    return code >= 0xaa && bmpIdentifierStart.test(String.fromCharCode(code));
  }
  return (
    !isNaN(code) &&
    code <= 0x10ffff &&
    (bmpIdentifierStart.test(String.fromCodePoint(code)) ||
      isInSupplementarySet(code, supplementaryIdentifierStartCodes))
  );
}

// Test whether a given character is part of an identifier.

export function isIdentifierChar(code: number): boolean {
  if (code < charCodes.digit0) return code === charCodes.dollarSign;
  if (code < charCodes.colon) return true;
  if (code < charCodes.uppercaseA) return false;
  if (code <= charCodes.uppercaseZ) return true;
  if (code < charCodes.lowercaseA) return code === charCodes.underscore;
  if (code <= charCodes.lowercaseZ) return true;
  if (code <= 0xffff) {
    return code >= 0xaa && bmpIdentifier.test(String.fromCharCode(code));
  }
  return (
    !isNaN(code) &&
    code <= 0x10ffff &&
    (bmpIdentifier.test(String.fromCodePoint(code)) ||
      isInSupplementarySet(code, supplementaryIdentifierStartCodes) ||
      isInSupplementarySet(code, supplementaryIdentifierCodes))
  );
}

// Test whether a given string is a valid identifier name 测试给定的字符串是否是有效的标识符名称
/**
 * 判断 name 整体是否是一个合法的「标识符名字」
 * 规则 = 第一个字符满足 isIdentifierStart，其余每个字符满足 isIdentifierChar
 */
export function isIdentifierName(name: string): boolean {
  let isFirst = true;
  // 遍历 name 的每个字符
  for (let i = 0; i < name.length; i++) {
    // The implementation is based on 实施基于
    // https://source.chromium.org/chromium/chromium/src/+/master:v8/src/builtins/builtins-string-gen.cc;l=1455;drc=221e331b49dfefadbc6fa40b0c68e6f97606d0b3;bpv=0;bpt=1
    // We reimplement `codePointAt` because `codePointAt` is a V8 builtin which is not inlined by TurboFan (as of M91) 我们重新实现了“codePointAt”，因为“codePointAt”是一个内置的V8引擎，它没有被TurboFan内联（从M91开始）
    // since `name` is mostly ASCII, an inlined `charCodeAt` wins here 由于“name”主要是ASCII码，因此内联的“charCodeAt”在这里获胜

    // ↑ 注释点出这是一次刻意的性能权衡：
    //   name 绝大多数是纯 ASCII（var/function/生成的 _name…），
    //   charCodeAt 能被 TurboFan 内联成 O(1) 定点读取；
    //   而 codePointAt 是 V8 内建函数、不被内联，每个字符都多一层调用开销。
    //   于是参考 V8 自身 String.prototype.codePointAt 的实现，手写代理对解码。
    let cp = name.charCodeAt(i);
    // 处理 Unicode 字符
    if ((cp & 0xfc00) === 0xd800 && i + 1 < name.length) {
      const trail = name.charCodeAt(++i);
      if ((trail & 0xfc00) === 0xdc00) {
        cp = 0x10000 + ((cp & 0x3ff) << 10) + (trail & 0x3ff);
      }
    }
    if (isFirst) {
      isFirst = false;
      // 首字符用更严的规则（不能以数字开头：0-9 在 ID_Continue 里，
      // 但不在 ID_Start 里 —— 所以 var 1abc 非法、var abc1 合法）。
      if (!isIdentifierStart(cp)) {
        return false;
      }
    } else if (!isIdentifierChar(cp)) {
      // 后续字符放行 ID_Continue（数字、连接符 _、组合记号等）。
      return false;
    }
  }

  // 用 !isFirst 而不是 true 收尾：若循环一次都没进（name === ""）， 
  // isFirst 仍为 true → 返回 false。空字符串不是合法标识符名。
  return !isFirst;
}
