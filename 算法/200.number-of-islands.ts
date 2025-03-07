/*
 * @lc app=leetcode.cn id=200 lang=typescript
 * @lcpr version=30204
 *
 * [200] 岛屿数量
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function numIslands(grid: string[][]): number {
  /**
   * 解题思路:
   *  1. 遍历矩阵
   *  2. 当碰到为陆地("1")将结果 +1
   *       2.1 并且迭代当项的 上下左右四个方向, 将其陆地("1")置为 水("0")
   *       2.2 重复步骤2, 直至没有陆地
   */
  let ans = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // 当为陆地("1")
      if (grid[i][j] === '1') {
        ans++;

        const queue: [number, number][] = [[i, j]];
        while (queue.length) {
          const [i, j] = queue.pop()!;
          // 四个方向
          const dir = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0],
          ];
          // 先将该项置为 水("0"), 防止循环
          grid[i][j] = '0';

          for (const dirItem of dir) {
            const diri = i + dirItem[0];
            const dirj = j + dirItem[1];

            // 检测是否超出边界
            if (
              diri < 0 ||
              diri >= grid.length ||
              dirj < 0 ||
              dirj >= grid[0].length
            )
              continue;

            if (grid[diri][dirj] === '1') queue.push([diri, dirj]);
          }
        }
      }
    }
  }

  return ans;
}
// @lc code=end

/*
// @lcpr case=start
// [["1","1","1"],["0","1","0"],["1","1","1"]]\n
// @lcpr case=end

// @lcpr case=start
// [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]\n
// @lcpr case=end

// @lcpr case=start
// [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]\n
// @lcpr case=end

 */
