/*
 * @lc app=leetcode.cn id=1869 lang=javascript
 * @lcpr version=30204
 *
 * [1869] 哪种连续子字符串更长
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var checkZeroOnes = function (s) {
  /** @type {number} 0 的连续长度 */
  let len0 = 0,
    /** @type {number} 1 的连续长度 */
    len1 = 0,
    /** @type {number} 0 的最大长度 */
    maxLen0 = 0,
    /** @type {number} 1 的最大长度 */
    maxLen1 = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '0') {
      len0++;
      if (s[i] !== s[i + 1]) {
        maxLen0 = Math.max(maxLen0, len0);
        len0 = 0;
      }
    } else {
      len1++;
      if (s[i] !== s[i + 1]) {
        maxLen1 = Math.max(maxLen1, len1);
        len1 = 0;
      }
    }
  }

  return maxLen1 > maxLen0;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=checkZeroOnes
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "011000111"\n
// @lcpr case=end

// @lcpr case=start
// "111000"\n
// @lcpr case=end

// @lcpr case=start
// "110100010"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = checkZeroOnes;
// @lcpr-after-debug-end
