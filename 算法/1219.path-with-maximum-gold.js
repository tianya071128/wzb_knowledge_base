/*
 * @lc app=leetcode.cn id=1219 lang=javascript
 * @lcpr version=30204
 *
 * [1219] 黄金矿工
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var getMaximumGold = function (grid) {
  /**
   * 回溯
   */
  let ans = 0,
    directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ],
    m = grid.length,
    n = grid[0].length,
    paths = new Set();

  function dfs(i, j) {
    if (grid[i][j] === 0) return 0;

    let res = grid[i][j],
      max = 0;

    paths.add(`${i}${j}`);

    // 找到四周的点
    for (let k = 0; k < directions.length; k++) {
      let x = i + directions[k][0],
        y = j + directions[k][1];

      if (
        x >= 0 &&
        x < m &&
        y >= 0 &&
        y < n &&
        grid[x][y] !== 0 &&
        !paths.has(`${x}${y}`)
      ) {
        max = Math.max(max, dfs(x, y));
      }
    }

    paths.delete(`${i}${j}`);

    return res + max;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] !== 0) {
        let n = dfs(i, j);
        ans = Math.max(n, ans);
      }
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=getMaximumGold
// paramTypes= ["number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [[0,6,0],[3,8,4],[0,9,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,0,0,0,0,0,32,0,0,20],[0,0,2,0,0,0,0,40,0,32],[13,20,36,0,0,0,20,0,0,0],[0,31,27,0,19,0,0,25,18,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,18,0,6],[0,0,0,25,0,0,0,0,0,0],[0,0,0,21,0,30,0,0,0,0],[19,10,0,0,34,0,2,0,0,27],[0,0,0,0,0,34,0,0,0,0]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = getMaximumGold;
// @lcpr-after-debug-end
