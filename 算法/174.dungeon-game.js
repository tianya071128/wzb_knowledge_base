/*
 * @lc app=leetcode.cn id=174 lang=javascript
 * @lcpr version=30204
 *
 * [174] 地下城游戏
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} dungeon
 * @return {number}
 */
var calculateMinimumHP = function (dungeon) {
  /**
   * 从左下角到右上角动态规划: 因为最低初始跟起点有关, 不好在之前判断, 如终点到起点更好判断
   *  - 当之前的路线为正数时, 直接取 1 --> 表示之前的路线已经够了, 不需要之后的路线提供健康值
   *
   *  - f(i, j) = Math.max(Math.min(f(i, j + 1), f(i + 1, j)) + V(i, j), 0)
   */
  let m = dungeon.length,
    n = dungeon[0].length,
    dp = new Array(m).fill(0).map((item) => new Array(n).fill(0));

  // 初始化 dp 状态
  dp[m - 1][n - 1] = Math.max(1, 1 - dungeon[m - 1][n - 1]);
  for (let i = m - 2; i >= 0; i--) {
    dp[i][n - 1] = Math.max(1, dp[i + 1][n - 1] - dungeon[i][n - 1]);
  }
  for (let i = n - 2; i >= 0; i--) {
    dp[m - 1][i] = Math.max(1, dp[m - 1][i + 1] - dungeon[m - 1][i]);
  }

  // 状态转移
  for (let i = m - 2; i >= 0; i--) {
    for (let j = n - 2; j >= 0; j--) {
      dp[i][j] = Math.max(
        1,
        Math.min(dp[i][j + 1], dp[i + 1][j]) - dungeon[i][j]
      );
    }
  }

  return dp[0][0];
};
// @lc code=end

/*
// @lcpr case=start
// [[-2,-3,3],[-5,-10,1],[10,30,-5]]\n
// @lcpr case=end

// @lcpr case=start
// [[0]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = calculateMinimumHP;
// @lcpr-after-debug-end
