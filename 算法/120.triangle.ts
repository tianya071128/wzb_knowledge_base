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
  // 回溯
  let min = Infinity;

  /**
   *
   * @param i 上一行取值的索引
   * @param rowIndex 上一行的行数
   * @param n 总和
   */
  function dfs(i, rowIndex, total) {
    // 终止条件: 到达最后一行
    if (rowIndex === triangle.length - 1) {
      min = Math.min(min, total);
      return;
    }

    // 上一层结点下标 相同或者等于 上一层结点下标 + 1
    dfs(i, rowIndex + 1, total + triangle[rowIndex + 1][i]);
    dfs(i + 1, rowIndex + 1, total + triangle[rowIndex + 1][i + 1]);
  }

  dfs(0, 0, triangle[0][0]);

  return min;
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
