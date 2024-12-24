/*
 * @lc app=leetcode.cn id=518 lang=javascript
 * @lcpr version=30204
 *
 * [518] 零钱兑换 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
var change = function (amount, coins) {
  // 动态规划
  /**
   *  假设: coins 为 [1, 2, 5], amount 为 5
   *  硬币\金额     0   1    2    3    4    5
   *   0           1   0    0    0    0    0
   *   1           1   1    1    1    1    1
   *   2           1   1    2    2    3    3
   *   3           1   1    2    3    4    4
   */
  // 1. 初始化 dp 表
  const len = coins.length;
  const dp = new Array(len + 1)
    .fill(0)
    .map(() => new Array(amount + 1).fill(0));

  // 2. 初始化 dp 表状态
  // 首列为 1
  for (let index = 1; index <= len; index++) {
    dp[index][0] = 1;
  }

  // 3. 状态转移方程
  //   对应两种决策: 放入和不放入
  //  f(i, c) = f(i - 1, c) + f(i, c - amount[i - 1])
  for (let i = 1; i <= len; i++) {
    for (let c = 1; c <= amount; c++) {
      // 只可以选择不放入
      if (c < coins[i - 1]) {
        dp[i][c] = dp[i - 1][c];
      } else {
        dp[i][c] = dp[i - 1][c] + dp[i][c - coins[i - 1]];
      }
    }
  }

  return dp[len][amount];
};
// @lc code=end

/*
// @lcpr case=start
// 5\n[1, 2, 5]\n
// @lcpr case=end

// @lcpr case=start
// 3\n[2]\n
// @lcpr case=end

// @lcpr case=start
// 10\n[10]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = change;
// @lcpr-after-debug-end
