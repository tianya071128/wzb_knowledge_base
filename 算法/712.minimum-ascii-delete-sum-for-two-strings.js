/*
 * @lc app=leetcode.cn id=712 lang=javascript
 * @lcpr version=30204
 *
 * [712] 两个字符串的最小ASCII删除和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s1
 * @param {string} s2
 * @return {number}
 */
var minimumDeleteSum = function (s1, s2) {
  /**
   * 动态规划: 两个字符串相同的变种
   */
  let dp = new Array(s1.length + 1)
    .fill(0)
    .map((item) => new Array(s2.length + 1).fill(0));

  // 初始化
  for (let i = 1; i < dp.length; i++) {
    dp[i][0] = s1[i - 1].charCodeAt() + dp[i - 1][0];
  }
  for (let i = 1; i < dp[0].length; i++) {
    dp[0][i] = s2[i - 1].charCodeAt() + dp[0][i - 1];
  }

  // 状态转移
  for (let i = 1; i < dp.length; i++) {
    for (let j = 1; j < dp[i].length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i][j - 1] + s2[j - 1].charCodeAt(),
          dp[i - 1][j] + s1[i - 1].charCodeAt()
        );
      }
    }
  }

  return dp[s1.length][s2.length];
};
// @lc code=end

/*
// @lcpr case=start
// "sea"\n"eat"\n
// @lcpr case=end

// @lcpr case=start
// "delete"\n"leet"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minimumDeleteSum;
// @lcpr-after-debug-end
