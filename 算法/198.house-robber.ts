/*
 * @lc app=leetcode.cn id=198 lang=typescript
 * @lcpr version=30204
 *
 * [198] 打家劫舍
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function rob(nums: number[]): number {
  // 动态规划:
  // 当前房屋有两个选择:
  //  1. 决定打劫, 那么上一个房屋就不能打劫
  //  2. 不打劫, 那么上一个房屋打不打劫都可以
  // 所有状态转移方程应该为: n 表示位置, j 表示是否打劫(0 打劫 | 1 不打劫)，当前项价值
  //  f(n, 0) = f(n - 1, 1) + val
  //  f(n, 1) = Math.max(f(n - 1, 0), f(n - 1, 1))

  // 1. 初始化 dp 表
  const dp = Array(nums.length)
    .fill(0)
    .map((item) => [0, 0]);

  // 2. 初始化 dp 表状态
  //  第 0 项初始化一下
  dp[0][0] = nums[0];

  // 3. 状态转移
  for (let i = 1; i < nums.length; i++) {
    dp[i][0] = dp[i - 1][1] + nums[i];
    dp[i][1] = Math.max(dp[i - 1][0], dp[i - 1][1]);
  }

  return Math.max(dp[nums.length - 1][0], dp[nums.length - 1][1]);
}
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,1]\n
// @lcpr case=end

// @lcpr case=start
// [2,7,9,3,1]\n
// @lcpr case=end

 */
