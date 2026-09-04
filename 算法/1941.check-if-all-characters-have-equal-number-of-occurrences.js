/*
 * @lc app=leetcode.cn id=1941 lang=javascript
 * @lcpr version=30204
 *
 * [1941] 检查是否所有字符出现次数相同
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var areOccurrencesEqual = function (s) {
  /** @type {number[]} 字符数量 */
  let list = new Array(26).fill(0),
    /** @type {number} 基准数量 */
    n = 0;

  for (const item of s) {
    list[item.charCodeAt() - 'a'.charCodeAt()]++;
  }

  for (const item of list) {
    if (item > 0) {
      if (n > 0 && n !== item) return false;

      n = item;
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// "abacbc"\n
// @lcpr case=end

// @lcpr case=start
// "aaabb"\n
// @lcpr case=end

 */
