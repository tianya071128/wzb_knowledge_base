/*
 * @lc app=leetcode.cn id=2027 lang=javascript
 * @lcpr version=30204
 *
 * [2027] 转换字符串的最少操作次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var minimumMoves = function (s) {
  /**
   * 贪心: 每次找到 X, 就将 X 后面的二个字符都包含
   */

  /** @type {number} 结果 */
  let ans = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === 'X') {
      ans++;
      i += 2;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "XXX"\n
// @lcpr case=end

// @lcpr case=start
// "XXOX"\n
// @lcpr case=end

// @lcpr case=start
// "OOOO"\n
// @lcpr case=end

 */
