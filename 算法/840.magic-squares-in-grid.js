/*
 * @lc app=leetcode.cn id=840 lang=javascript
 * @lcpr version=30204
 *
 * [840] 矩阵中的幻方
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var numMagicSquaresInside = function (grid) {
  /**
   * 暴力计算
   */
  let ans = 0;

  for (let i = 2; i < grid.length; i++) {
    other: for (let j = 2; j < grid[i].length; j++) {
      let n1 = grid[i - 2][j - 2],
        n2 = grid[i - 2][j - 1],
        n3 = grid[i - 2][j],
        n4 = grid[i - 1][j - 2],
        n5 = grid[i - 1][j - 1],
        n6 = grid[i - 1][j],
        n7 = grid[i][j - 2],
        n8 = grid[i][j - 1],
        n9 = grid[i][j],
        hash = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

      for (const item of [n1, n2, n3, n4, n5, n6, n7, n8, n9]) {
        if (!hash.has(item)) continue other;
        hash.delete(item);
      }

      let sum1 = n1 + n2 + n3,
        sum2 = n4 + n5 + n6,
        sum3 = n7 + n8 + n9,
        sum4 = n1 + n4 + n7,
        sum5 = n2 + n5 + n8,
        sum6 = n3 + n6 + n9,
        sum7 = n1 + n5 + n9,
        sum8 = n3 + n5 + n7;

      if (
        [sum2, sum3, sum4, sum5, sum6, sum7, sum8].some((item) => item !== sum1)
      )
        continue;

      ans++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[4,3,8,4],[9,5,1,9],[2,7,6,2]]\n
// @lcpr case=end

// @lcpr case=start
// [[5,5,5],[5,5,5],[5,5,5]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numMagicSquaresInside;
// @lcpr-after-debug-end
