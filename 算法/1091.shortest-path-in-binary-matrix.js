/*
 * @lc app=leetcode.cn id=1091 lang=javascript
 * @lcpr version=30204
 *
 * [1091] 二进制矩阵中的最短路径
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var shortestPathBinaryMatrix = function (grid) {
  /**
   * 广度搜索
   */
  let queue = [],
    ans = 1,
    directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [-1, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
    ],
    n = grid.length;

  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;

  if (n === 1) return 1;

  // 添加起点
  grid[0][0] = 1;
  queue.push([0, 0]);

  while (queue.length) {
    let cur = [];
    for (const [i, j] of queue) {
      // 找到相邻矩阵节点
      for (const [diffX, diffY] of directions) {
        let x = i + diffX,
          y = j + diffY;

        // 是否合规
        if (x >= 0 && x < n && y >= 0 && y < n && grid[x][y] === 0) {
          cur.push([x, y]);
          grid[x][y] = 1;

          if (x === n - 1 && y === n - 1) return ans + 1;
        }
      }
    }

    ans++;
    queue = cur;
  }

  return -1;
};
// @lc code=end

/*
// @lcpr case=start
// [[0,1],[1,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,0,0],[1,1,0],[1,1,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,0,0],[1,1,0],[1,1,0]]\n
// @lcpr case=end

 */
