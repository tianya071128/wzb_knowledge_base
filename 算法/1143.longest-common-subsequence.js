/*
 * @lc app=leetcode.cn id=1143 lang=javascript
 * @lcpr version=30204
 *
 * [1143] 最长公共子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function (text1, text2) {
  /**
   * 动态规划
   *
   *  dp(i, j) =
   *    - 如果位置 i 和 j 的字符相同, 那么就是: dp(i - 1, j - 1) +  1
   *    - 如果位置 i 和 j 的字符不同, 那么就是: Math.max(dp(i - 1, j), dp(i, j - 1))
   */
  // 初始dp表
  const dp = new Array(text1.length + 1)
    .fill(0)
    .map((item) => new Array(text2.length + 1).fill(0));

  // 状态转移方程
  for (let i = 1; i < dp.length; i++) {
    for (let j = 1; j < dp[i].length; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp.at(-1).at(-1);
};
// @lc code=end

/*
// @lcpr case=start
// "abcdeasdfsdfcvert"\n"aceastrtgfgsdf"\n
// @lcpr case=end

// @lcpr case=start
// "abc"\n"abc"\n
// @lcpr case=end

// @lcpr case=start
// "abc"\n"def"\n
// @lcpr case=end

 */
