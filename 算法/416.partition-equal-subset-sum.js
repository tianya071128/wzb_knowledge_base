/*
 * @lc app=leetcode.cn id=416 lang=javascript
 * @lcpr version=30204
 *
 * [416] 分割等和子集
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums) {
  /**
   * 要分割成两个元素和相等的, 那么每个子集的总和为总和的一半，
   * 此时问题可以转换为根据 nums, 是否满足 nums 的子数组的总和为固定值, 也就是硬币的问题
   */
  const total = nums.reduce((total, item) => total + item);

  // 如果一半值不是整数或者 nums 只有一个元素, 直接可以判定为 false
  if (total % 2 === 1 || nums.length === 1) return false;

  const target = total / 2;

  // 初始化 dp 表
  const dp = new Array(nums.length + 1)
    .fill(0)
    .map((item) => new Array(target + 1).fill(false));

  // 初始 dp 状态 --> 当为 0元时, 此时为 true
  dp.forEach((item) => (item[0] = true));

  for (let i = 1; i < dp.length; i++) {
    for (let j = 1; j <= target; j++) {
      // 状态转移方程
      //  1. 该项不参与, 之前项等于 j 的结果
      //  2. 该项参与, 之前项等于 j - nums[i - 1] 的结果
      dp[i][j] = !!(dp[i - 1][j] || dp[i - 1][j - nums[i - 1]]);

      // 如果满足条件, 直接返回
      if (j === target && dp[i][j]) return true;
    }
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// [1,5,11,5]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,5]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = canPartition;
// @lcpr-after-debug-end
