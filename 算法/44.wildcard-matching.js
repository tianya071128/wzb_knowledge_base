/*
 * @lc app=leetcode.cn id=44 lang=javascript
 * @lcpr version=30204
 *
 * [44] 通配符匹配
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function (s, p, sPointer = 0, pPointer = 0) {
  // 超出边界
  if (sPointer >= s.length || pPointer >= p.length) {
    // 如果 p 模式之后剩余的字符都是 *, 则移动
    while (p[pPointer] === '*') {
      pPointer++;
    }

    // 匹配成功
    return sPointer === s.length && pPointer === p.length;
  }

  // 当前位置模式为 ? - 当前位置匹配成功, 进行下一个位置匹配
  if (p[pPointer] === '?') {
    return isMatch(s, p, sPointer + 1, pPointer + 1);
  }

  // 当前模式不为 *, 则直接比较两个字符是否相同
  if (p[pPointer] !== '*') {
    if (s[sPointer] === p[pPointer]) {
      // 进行下一个位置
      return isMatch(s, p, sPointer + 1, pPointer + 1);
    } else {
      return false;
    }
  }

  // 模式为 *
  // 合并之后的 *
  while (p[pPointer + 1] === '*') {
    pPointer++;
  }

  // 特殊情况: 当前 * 为最后一个 --> 直接返回匹配成功
  if (pPointer === p.length - 1) return true;

  // 递归处理
  for (let i = sPointer; i < s.length; i++) {
    if (isMatch(s, p, i, pPointer + 1)) return true;
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// ""\n"******"\n
// @lcpr case=end

// @lcpr case=start
// "aa"\n"*"\n
// @lcpr case=end

// @lcpr case=start
// "cb"\n"?a"\n
// @lcpr case=end

 */
