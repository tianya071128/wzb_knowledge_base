/*
 * @lc app=leetcode.cn id=1025 lang=javascript
 * @lcpr version=30204
 *
 * [1025] 除数博弈
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var divisorGame = function (n) {
  /**
   * 动态规划
   */
  let dp = new Array(n + 1).fill(true); // 表示鲍勃输赢的 dp 数组 --> 反之即为 爱丽丝 的结果
  dp[2] = false;

  for (let i = 4; i <= n; i++) {
    // 从 1 开始整除 i
    for (let j = 1; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        let z = i / j;
        if (!dp[i - j] || (z < i && !dp[i - z])) {
          dp[i] = false;
          break;
        }
      }
    }
  }

  return !dp[n];
};
// @lc code=end

/*
// @lcpr case=start
// 5\n
// @lcpr case=end

// @lcpr case=start
// 33\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = divisorGame;
// @lcpr-after-debug-end
