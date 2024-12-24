/*
 * @lc app=leetcode.cn id=LCR 103 lang=javascript
 * @lcpr version=30204
 *
 * [LCR 103] 零钱兑换
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
  // 动态规划
  /**
   *   硬币\金额   0   1   2   3   4   5   6
   *    0         0   0   0   0   0   0   0
   *    1(2)      0
   *    2(4)      0
   *    3(5)      0
   */

  // 1. 初始化 dp 表
  // 2. 初始 dp 表状态
  // 第 0 行和第 0 列为 0
  const len = coins.length;
  const dp = new Array(len + 1)
    .fill(0)
    .map(() => new Array(amount + 1).fill(0));
  // 3. 状态转移方程
  // 每个硬币都有放入和不放入两个选择
  // f(i, m) = Min([f(i - 1, m) + f(i, amount - m) + 1]) --> 需要排除对应为 -1 的
  for (let i = 1; i <= len; i++) {
    for (let c = 1; c <= amount; c++) {
      let res = [];

      // 选择不放入
      if (dp[i - 1][c] !== -1 && dp[i - 1][c] !== 0) {
        res.push(dp[i - 1][c]);
      }

      // 选择放入: 只有金额大于当前硬币时, 才可以放入
      if (c >= coins[i - 1] && dp[i][c - coins[i - 1]] !== -1) {
        res.push(dp[i][c - coins[i - 1]] + 1);
      }

      // 如果选择放入和不放入都不能组装成功的话, 那么此项为 -1;
      dp[i][c] = res.length ? Math.min(...res) : -1;
    }
  }

  return dp[len][amount];
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=coinChange
// paramTypes= ["number[]","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1, 2, 5]\n11\n
// @lcpr case=end

// @lcpr case=start
// [2]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1]\n0\n
// @lcpr case=end

// @lcpr case=start
// [1]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1]\n2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = coinChange;
// @lcpr-after-debug-end
