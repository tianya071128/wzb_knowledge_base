/*
 * @lc app=leetcode.cn id=322 lang=javascript
 * @lcpr version=30204
 *
 * [322] 零钱兑换
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
  // 与 LCR 103 一样的
  /**
   * 动规:
   *  f[硬币i, 金额j] = Max(f[硬币i, 金额j - 硬币i对应的值] + 1, f[硬币i - 1, 金额j])
   *
   *  - 当前硬币选择了, 那么就从总金额中减去当前金额
   *  - 当前硬币没有选择, 那么就从除了当前硬币中计算
   */
  const dp = Array(coins.length + 1)
    .fill(0)
    .map(() => Array(amount + 1).fill(Infinity));

  // 当金额为 0 时, 组成的硬币为 0 枚
  for (let i = 0; i < dp.length; i++) {
    dp[i][0] = 0;
  }

  for (let i = 1; i <= coins.length; i++) {
    for (let j = 1; j <= amount; j++) {
      if (j >= coins[i - 1]) {
        dp[i][j] = Math.min(dp[i][j - coins[i - 1]] + 1, dp[i - 1][j]);
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  return dp[coins.length][amount] === Infinity ? -1 : dp[coins.length][amount];
};
// @lc code=end

/*
// @lcpr case=start
// [1, 2, 5]\n11\n
// @lcpr case=end

// @lcpr case=start
// [2, 5]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1]\n0\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = coinChange;
// @lcpr-after-debug-end
