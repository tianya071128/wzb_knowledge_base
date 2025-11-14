/*
 * @lc app=leetcode.cn id=1162 lang=javascript
 * @lcpr version=30204
 *
 * [1162] 地图分析
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxDistance = function (grid) {
  /**
   * 标记:
   *  - 从 1 出发, 标记下 <= 0 的海洋格子离 1 的距离 --> 以负数标记, 因为
   *  - 重复标记，若遇到更小的距离应该重置
   *  - 最后找到距离最大的
   */
  let n = grid.length,
    ans = -1,
    position = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        // 启动向四周扩散
        let queue = [[i, j]];

        while (queue.length) {
          let cur = queue.pop(),
            distance = (Math.abs(cur[0] - i) + Math.abs(cur[1] - j)) * -1,
            curNum = grid[cur[0]][cur[1]];

          // 已经标记过了，并且离之前的更近， 不处理
          if (curNum < 0 && curNum >= distance) continue;

          // 标记一下
          if (curNum !== 1) grid[cur[0]][cur[1]] = distance;

          // 查找四周
          for (const item of position) {
            let x = cur[0] + item[0],
              y = cur[1] + item[1];

            if (x >= 0 && x < n && y >= 0 && y < n && grid[x][y] !== 1) {
              queue.unshift([x, y]);
            }
          }
        }
      }
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] < 0) {
        ans = Math.max(ans, Math.abs(grid[i][j]));
      }
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maxDistance
// paramTypes= ["number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [[1,0,1],[0,0,0],[1,0,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,0,0],[0,0,0],[0,0,0]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxDistance;
// @lcpr-after-debug-end
