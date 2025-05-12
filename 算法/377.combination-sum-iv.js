/*
 * @lc app=leetcode.cn id=377 lang=javascript
 * @lcpr version=30204
 *
 * [377] 组合总和 Ⅳ
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var combinationSum4 = function (nums, target) {
  /** 回溯 */
  // let ans = 0;
  // function dfs(target) {
  //   // 剪枝
  //   if (target <= 0) {
  //     target === 0 && ans++; // 增加结果
  //     return;
  //   }
  //   for (const n of nums) {
  //     dfs(target - n);
  //   }
  // }
  // dfs(target);
  // return ans;
  /**
   * 动态规划: https://leetcode.cn/problems/combination-sum-iv/solutions/2706336/ben-zhi-shi-pa-lou-ti-cong-ji-yi-hua-sou-y52j/
   *  类似于爬楼梯: 70 那题相当于 nums=[1,2]，因为每次只能爬 1 个或 2 个台阶。
   *
   * f(金额) = f(金额 - nums[0]) + f(金额 - nums[1]) + f(金额 - nums[2]) + ...
   */
  let dp = new Array(target + 1).fill(0);

  // 初始化 dp 表 --> 当正好为 0 时, 表示正好存在该种情况
  dp[0] = 1;

  for (let i = 1; i <= target; i++) {
    // 状态转移方程: f(金额) = f(金额 - nums[0]) + f(金额 - nums[1]) + f(金额 - nums[2]) + ...
    for (const n of nums) {
      if (i >= n) {
        dp[i] += dp[i - n];
      }
    }
  }

  return dp[target];
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n32\n
// @lcpr case=end

// @lcpr case=start
// [9]\n3\n
// @lcpr case=end

 */
