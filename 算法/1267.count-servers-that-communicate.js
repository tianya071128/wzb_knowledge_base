/*
 * @lc app=leetcode.cn id=1267 lang=javascript
 * @lcpr version=30204
 *
 * [1267] 统计参与通信的服务器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var countServers = function (grid) {
  let hash = new Set(),
    m = grid.length,
    n = grid[0].length;

  for (let x = 0; x < m; x++) {
    let first;
    for (let y = 0; y < n; y++) {
      if (grid[x][y] === 1) {
        if (!first) {
          first = `${x},${y}`;
        } else {
          hash.add(first);
          hash.add(`${x},${y}`);
        }
      }
    }
  }

  for (let y = 0; y < n; y++) {
    let first;
    for (let x = 0; x < m; x++) {
      if (grid[x][y] === 1) {
        if (!first) {
          first = `${x},${y}`;
        } else {
          hash.add(first);
          hash.add(`${x},${y}`);
        }
      }
    }
  }

  return hash.size;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,0,0,1,0],[0,0,0,0,0],[0,0,0,1,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,0],[1,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,1,0,0],[0,0,1,0],[0,0,1,0],[0,0,0,1]]\n
// @lcpr case=end

 */
