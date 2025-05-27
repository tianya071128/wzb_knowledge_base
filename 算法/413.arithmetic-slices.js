/*
 * @lc app=leetcode.cn id=413 lang=javascript
 * @lcpr version=30204
 *
 * [413] 等差数列划分
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 优化:...
 * @param {number[]} nums
 * @return {number}
 */
var numberOfArithmeticSlices = function (nums) {
  // 初始 dp 表
  const dp = new Array(nums.length).fill(0).map((item) => ({
    /** 子数组 个数 */
    n: 0,
    /** 与前值的差值 */
    diff: 0,
    /** 与前值组成的子数组长度 */
    len: 0,
  }));

  // 初始 dp 表状态
  // 初始前两项 --> dp[0] 就是初始值
  dp[1] = {
    n: 0,
    diff: nums[1] - nums[0],
    len: 2,
  };

  // 状态转移方程
  for (let i = 2; i < nums.length; i++) {
    // 先计算出该项是否能够与前值组成子数组
    if (dp[i - 1].diff === nums[i] - nums[i - 1]) {
      dp[i] = {
        n: dp[i - 1].n + (dp[i - 1].len + 1 - 2),
        diff: dp[i - 1].diff,
        len: dp[i - 1].len + 1,
      };
    } else {
      dp[i] = {
        n: dp[i - 1].n,
        diff: nums[i] - nums[i - 1],
        len: 2,
      };
    }
  }

  return dp.at(-1).n;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,6,7,8]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numberOfArithmeticSlices;
// @lcpr-after-debug-end
