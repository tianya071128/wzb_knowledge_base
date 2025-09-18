/*
 * @lc app=leetcode.cn id=885 lang=javascript
 * @lcpr version=30204
 *
 * [885] 螺旋矩阵 III
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} rows
 * @param {number} cols
 * @param {number} rStart
 * @param {number} cStart
 * @return {number[][]}
 */
var spiralMatrixIII = function (rows, cols, rStart, cStart) {
  if (rows === 0 || cols === 0) return [];

  /**
   * 模拟
   */
  let directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ],
    ans = [[rStart, cStart]],
    direction = 0, // 方向索引
    step = 1, // 当次走几步
    position = [rStart, cStart]; // 位置

  while (ans.length !== rows * cols) {
    const curDirection = directions[direction];

    for (let i = 1; i <= step; i++) {
      position = [position[0] + curDirection[0], position[1] + curDirection[1]];

      // 检查该位置是否超出边界
      if (
        position[0] >= 0 &&
        position[0] < rows &&
        position[1] >= 0 &&
        position[1] < cols
      ) {
        ans.push(position);
      }
    }

    // 转换方向和步长
    direction = (direction + 1) % 4;
    step += 0.5;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 1\n4\n0\n0\n
// @lcpr case=end

// @lcpr case=start
// 5\n6\n1\n4\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = spiralMatrixIII;
// @lcpr-after-debug-end
