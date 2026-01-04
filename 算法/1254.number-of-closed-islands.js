/*
 * @lc app=leetcode.cn id=1254 lang=javascript
 * @lcpr version=30204
 *
 * [1254] 统计封闭岛屿的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var closedIsland = function (grid) {
  // 矩阵标记: 走过的路都标记成 1
  // 并且在深度搜索的过程中记录下是否在边界处, 如果在的话, 该次的遍历就无效, 但还是需要遍历所有的相邻的 0
  let ans = 0,
    m = grid.length,
    n = grid[0].length,
    direction = [
      [0, 1],
      [0, -1],
      [-1, 0],
      [1, 0],
    ];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 0) {
        let queue = [[i, j]],
          cur,
          flag = true; // 是否被 1 包围, 只要 queue 没有边界处的, 即可表示被包围
        while ((cur = queue.shift())) {
          grid[cur[0]][cur[1]] = 1;

          for (const [x, y] of direction) {
            let nextX = cur[0] + x,
              nextY = cur[1] + y;

            if (
              nextX >= 0 &&
              nextX < m &&
              nextY >= 0 &&
              nextY < n &&
              grid[nextX][nextY] === 0
            ) {
              queue.push([nextX, nextY]);
            }
          }

          // 是否为边界
          if (
            flag &&
            (cur[0] === 0 ||
              cur[0] === m - 1 ||
              cur[1] === 0 ||
              cur[1] === n - 1)
          )
            flag = false;
        }

        if (flag) ans++;
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,1,1,1,1,1,1,0],[1,0,0,0,0,1,1,0],[1,0,1,0,1,1,1,0],[1,0,0,0,0,1,0,1],[1,1,1,1,1,1,1,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,0,1,0,0],[0,1,0,1,0],[0,1,1,1,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],[1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]]\n
// @lcpr case=end

 */
