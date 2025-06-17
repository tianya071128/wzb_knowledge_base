/*
 * @lc app=leetcode.cn id=494 lang=javascript
 * @lcpr version=30204
 *
 * [494] 目标和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 优化: 转换为动态规划
 *  1. neg = (sum - target) / 2    --> 计算出需要为负数的元素和
 *     -> sum: 元素和
 *     -> 数组 nums 中的元素都是非负整数，neg 也必须是非负整数，所以上式成立的前提是 sum−target 是非负偶数。若不符合该条件可直接返回 0。
 *  2. 若上式成立，问题转化成在数组 nums 中选取若干元素，使得这些元素之和等于 neg，计算选取元素的方案数。
 *
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function (nums, target) {
  // 回溯
  let ans = 0,
    total = 0;
  function dfs(i) {
    // 到底了, 查看结果
    if (i >= nums.length) {
      if (total === target) ans++;
      return;
    }

    // 尝试该项为 +
    total += nums[i];
    dfs(i + 1);
    // 复原
    total -= nums[i];

    // 尝试该项为 -
    total -= nums[i];
    dfs(i + 1);
    // 复原
    total += nums[i];
  }

  dfs(0);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1]\n1\n
// @lcpr case=end

 */
