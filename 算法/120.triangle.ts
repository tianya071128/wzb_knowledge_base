/*
 * @lc app=leetcode.cn id=120 lang=typescript
 * @lcpr version=30204
 *
 * [120] 三角形最小路径和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function minimumTotal(triangle: number[][]): number {
  // 动态规划
  // 1. dp 表结构与 triangle 类似
  const dp = Array(triangle.length)
    .fill(0)
    .map<number[]>((item, index) => Array(triangle[index].length).fill(0));

  // 2. 初始化 dp 表首项和末尾项
  for (let i = 0; i < dp.length; i++) {
    dp[i][0] = triangle[i][0] + (dp[i - 1]?.[0] ?? 0);
    dp[i][dp[i].length - 1] =
      (triangle[i].at(-1) ?? 0) + (dp[i - 1]?.at(-1) ?? 0);
  }

  // 3. 状态转移方程
  // f[i, j] = Min(f[i - 1][j - 1], f[i - 1][j]) + V[i, j]
  for (let i = 2; i < triangle.length; i++) {
    for (let j = 1; j < triangle[i].length - 1; j++) {
      dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i - 1][j]) + triangle[i][j];
    }
  }

  return Math.min(...(dp.at(-1) ?? []));
}
// @lc code=end

/*
// @lcpr case=start
// [[2],[3,4],[6,5,7],[4,1,8,3]]\n
// @lcpr case=end

// @lcpr case=start
// [[-10]]\n
// @lcpr case=end

 */
