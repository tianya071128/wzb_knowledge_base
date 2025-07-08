/*
 * @lc app=leetcode.cn id=583 lang=javascript
 * @lcpr version=30204
 *
 * [583] 两个字符串的删除操作
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function (word1, word2) {
  /**
   * 动态规划:
   *      "l" "e" "e" "t" "c" "o" "d" "e"
   *  "e"
   *  "t"
   *  "c"
   *  "o"
   *
   *  观察可得:
   *   dp[i][j] 的值
   *      - 如果 i 和 j 的字符相同, 那么就是 dp[i - 1][j - 1]
   *      - 如果不相同的话, 那么就是 Min(dp[i - 1][j], dp[i][j - 1]) + 1
   */
  const dp = new Array(word1.length + 1)
    .fill(0)
    .map((item) => new Array(word2.length + 1).fill(0));

  // 初始 dp 状态
  for (let i = 1; i < dp[0].length; i++) {
    dp[0][i] = i;
  }
  for (let i = 1; i < dp.length; i++) {
    dp[i][0] = i;
  }

  // 状态转移
  for (let i = 1; i < dp.length; i++) {
    for (let j = 1; j < dp[i].length; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + 1;
      }
    }
  }

  return dp[word1.length][word2.length];
};
// @lc code=end

/*
// @lcpr case=start
// "seaadf"\n"atewersd"\n
// @lcpr case=end

// @lcpr case=start
// "leetcode"\n"etco"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minDistance;
// @lcpr-after-debug-end
