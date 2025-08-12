/*
 * @lc app=leetcode.cn id=813 lang=javascript
 * @lcpr version=30204
 *
 * [813] 最大平均值和的分组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var largestSumOfAverages = function (nums, k) {
  /**
   * 动态规划:
   *    i 标识 nums 的元素索引, k 表示分组
   *  f(i, k) = Math.max(f(i - 1, k - 1) + nums([i, i]), f(i - 2, k - 1) + nums([i - 1, i]), ...)
   */

  // 初始 dp 表
  const dp = new Array(k + 1)
    .fill(0)
    .map((item) => new Array(nums.length + 1).fill(0));

  // 初始 dp 状态 -- 当 k 为 1 时
  let total = 0;
  for (let i = 1; i < dp[1].length; i++) {
    total += nums[i - 1];
    dp[1][i] = total / i;
  }

  // 状态转移方程
  for (let i = 2; i < dp.length; i++) {
    for (let j = i; j < dp[i].length; j++) {
      let max = -Infinity,
        total = nums[j - 1];

      // 将 nums[j] 的值与之前的值相连作为一个分组尝试
      for (let k = j - 1; k >= i - 1; k--) {
        max = Math.max(max, dp[i - 1][k] + total / (j - k));

        total += nums[k - 1];
      }

      dp[i][j] = max;
    }
  }

  return dp[k][nums.length];
};
// @lc code=end

/*
// @lcpr case=start
// [4,1,7,5,6,2,3]\n4\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,6,7]\n4\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = largestSumOfAverages;
// @lcpr-after-debug-end
