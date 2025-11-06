/*
 * @lc app=leetcode.cn id=994 lang=javascript
 * @lcpr version=30204
 *
 * [994] 腐烂的橘子
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function (grid) {
  /**
   * 1. 先找出所有的腐烂的橘子
   * 2. 在遍历这些腐烂的橘子的四周, 收集到下一次遍历中
   * 3. 重复上述操作, 直到腐烂的橘子队列为空
   * 4. 检查是否还有新鲜橘子
   */
  let queue = [],
    ans = 0,
    direction = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];

  // 找出所有的腐烂的橘子
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 2) {
        queue.push([i, j]);
      }
    }
  }

  // 遍历这些腐烂的橘子的四周, 收集到下一次遍历中
  while (queue.length) {
    let cur = [];
    for (const [x, y] of queue) {
      // 找到当前腐烂的橘子的四周，如果是新鲜橘子就加入到下一次队列中
      for (let i = 0; i < direction.length; i++) {
        let x1 = x + direction[i][0],
          y1 = y + direction[i][1];
        if (grid[x1]?.[y1] === 1) {
          grid[x1][y1] = 2; // 标记为腐烂的橘子
          cur.push([x1, y1]);
        }
      }
    }

    // 如果当次有新鲜橘子被腐烂, 那么结果+1
    if (cur.length) ans++;

    queue = cur;
  }

  // 检查是否还有新鲜橘子
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 1) {
        return -1;
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[2,1,1],[1,1,0],[0,1,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[2,1,1],[0,1,1],[1,0,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,2]]\n
// @lcpr case=end

 */
