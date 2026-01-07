/*
 * @lc app=leetcode.cn id=1277 lang=javascript
 * @lcpr version=30204
 *
 * [1277] 统计全为 1 的正方形子矩阵
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var countSquares = function (matrix) {
  /**
   * 转换下思路, 也就是求以右下角为正方形的最大边, 然后累加到结果中
   *
   * 动态规划: 求最大边
   *  f(i, j)
   *   - 当前项为 0, 则肯定为 0
   *   - 当前项为 1，Math.min(f(i - 1, j), f(i, j)) + 1
   *      - 特殊情况：如果 Math.min(f(i - 1, j), f(i, j)) 其跨行的对角线元素为 0， 那么需要结果减1
   */
  let ans = 0,
    m = matrix.length,
    n = matrix[0].length,
    dp = new Array(m).fill(0).map((item) => new Array(n).fill(0));

  // 初始 dp 表状态
  for (let i = 0; i < m; i++) {
    dp[i][0] = matrix[i][0];
    ans += matrix[i][0];
  }
  for (let i = 1; i < n; i++) {
    dp[0][i] = matrix[0][i];
    ans += matrix[0][i];
  }

  // 状态转移
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 1) {
        let min = Math.min(dp[i - 1][j], dp[i][j - 1]);
        // 特殊情况：如果 Math.min(f(i - 1, j), f(i, j)) 其跨行的对角线元素为 0， 那么需要结果减1
        if (min > 0 && matrix[i - min][j - min] !== 1) {
          min--;
        }

        dp[i][j] = min + 1;
        ans += dp[i][j];
      }
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=countSquares
// paramTypes= ["number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [[0,1,1,1],[1,1,1,1],[0,1,1,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,0,1],[1,1,0],[1,1,0]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = countSquares;
// @lcpr-after-debug-end
