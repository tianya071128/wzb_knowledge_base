/*
 * @lc app=leetcode.cn id=64 lang=typescript
 * @lcpr version=30204
 *
 * [64] 最小路径和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function minPathSum(grid: number[][]): number {
  /**
   * 动态规划
   */

  // 1. 初始化 dp 表
  const m = grid.length,
    n = grid[0].length;
  const dp = new Array(m).fill(0).map((item) => new Array<number>(n).fill(0));

  // 初始化首列
  for (let i = 0; i < n; i++) {
    dp[0][i] = grid[0][i] + (dp[0][i - 1] ?? 0);
  }
  // 初始化首行
  for (let i = 0; i < m; i++) {
    dp[i][0] = grid[i][0] + (dp[i - 1]?.[0] ?? 0);
  }

  // 2. 状态转移方程
  // f(i, j) = Min(f(i - 1, j), f(i, j - 1)) + 当前项的值
  for (let i = 1; i < grid.length; i++) {
    for (let j = 1; j < grid[i].length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }

  return dp[m - 1][n - 1];
}
// @lc code=end

/*
// @lcpr case=start
// [[1,3,1],[1,5,1],[4,2,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2,3],[4,5,6]]\n
// @lcpr case=end

 */
