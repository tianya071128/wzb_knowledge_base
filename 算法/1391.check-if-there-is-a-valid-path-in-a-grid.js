/*
 * @lc app=leetcode.cn id=1391 lang=javascript
 * @lcpr version=30204
 *
 * [1391] 检查网格中是否存在有效路径
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} grid
 * @return {boolean}
 */
var hasValidPath = function (grid) {
  // 如果起点是 4 的话, 那么就有两条路可以走, 此时转换一下
  if (grid[0][0] === 4) {
    return (
      hasValidPath(
        grid.map((item, i) =>
          item.map((item, j) => (i === 0 && j === 0 ? 1 : item))
        )
      ) ||
      hasValidPath(
        grid.map((item, i) =>
          item.map((item, j) => (i === 0 && j === 0 ? 2 : item))
        )
      )
    );
  }

  /**
   * 每个网格根据不同的路都存在两个入口(或出口),
   */
  let location = [
      [
        [0, -1],
        [0, 1],
      ],
      [
        [-1, 0],
        [1, 0],
      ],
      [
        [0, -1],
        [1, 0],
      ],
      [
        [0, 1],
        [1, 0],
      ],
      [
        [0, -1],
        [-1, 0],
      ],
      [
        [0, 1],
        [-1, 0],
      ],
    ],
    m = grid.length,
    n = grid[0].length;

  // 从起始点出发
  let cur = [0, 0], // 当前位置
    prev; // 上一个位置
  while (true) {
    let nexts = location[grid[cur[0]][cur[1]] - 1];

    // 如果是不存在的话, 表示已经走过, 死循环
    if (!nexts) return false;

    // 以当前位置判断能通向的位置
    let hasAdja = false, // 是否与上一个位置相邻
      next; // 下一个位置
    for (let i = 0; i < nexts.length; i++) {
      let nextX = cur[0] + nexts[i][0],
        nextY = cur[1] + nexts[i][1];

      // 未超出边界
      if (nextX >= 0 && nextX < m && nextY >= 0 && nextY < n) {
        // 是否与上一个位置相邻
        if (prev && prev[0] === nextX && prev[1] === nextY) {
          hasAdja = true;
        } else {
          next = [nextX, nextY];
        }
      }
    }

    // 当前位置没有与上一个位置相邻
    if (prev && !hasAdja) return false;

    // 如果到达了终点
    if (cur[0] === m - 1 && cur[1] === n - 1) return true;

    // 没有了下一个位置
    if (!next) return false;

    grid[cur[0]][cur[1]] = 0; // 标记已经走过

    prev = cur;
    cur = next;
  }
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=hasValidPath
// paramTypes= ["number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [[4,1,3],[6,1,2]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2,1],[1,2,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,1,2]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,1,1,1,1,1,3]]\n
// @lcpr case=end

// @lcpr case=start
// [[2],[2],[2],[2],[2],[2],[6]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = hasValidPath;
// @lcpr-after-debug-end
