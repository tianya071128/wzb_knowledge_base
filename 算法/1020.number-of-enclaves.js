/*
 * @lc app=leetcode.cn id=1020 lang=javascript
 * @lcpr version=30204
 *
 * [1020] 飞地的数量
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var numEnclaves = function (grid) {
  /**
   * 从边出发, 将找到的都置为0, 之后计算一下1的个数即可
   */
  let p = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ],
    m = grid.length,
    n = grid[0].length;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (
        (i === 0 || i === m - 1 || j === 0 || j === n - 1) &&
        grid[i][j] === 1
      ) {
        let queue = [[i, j]];
        while (queue.length) {
          let cur = queue.pop();
          // 将该点的四周为陆地的添加至队列
          for (const [n1, n2] of p) {
            let x = cur[0] + n1,
              y = cur[1] + n2;

            if (grid[x]?.[y] === 1) {
              queue.push([x, y]);
            }
          }

          // 渲染为 0
          grid[cur[0]][cur[1]] = 0;
        }
      }
    }
  }

  // 找到剩余 1 的个数
  return grid.reduce(
    (total, item) => total + item.reduce((total, item) => total + item),
    0
  );
};
// @lc code=end

/*
// @lcpr case=start
// [[0,0,0,1,1,1,0,1,0,0],[1,1,0,0,0,1,0,1,1,1],[0,0,0,1,1,1,0,1,0,0],[0,1,1,0,0,0,1,0,1,0],[0,1,1,1,1,1,0,0,1,0],[0,0,1,0,1,1,1,1,0,1],[0,1,1,0,0,0,1,1,1,1],[0,0,1,0,0,1,0,1,0,1],[1,0,1,0,1,1,0,0,0,0],[0,0,0,0,1,1,0,0,0,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numEnclaves;
// @lcpr-after-debug-end
