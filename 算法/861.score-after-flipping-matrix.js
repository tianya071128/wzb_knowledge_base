/*
 * @lc app=leetcode.cn id=861 lang=javascript
 * @lcpr version=30204
 *
 * [861] 翻转矩阵后的得分
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var matrixScore = function (grid) {
  /**
   * 贪心:
   *  1. 每一行: 针对第一个数字(高位), 必须为 1
   *  2. 每一行: 尽可能多的 1
   */
  // 每一行处理
  for (let i = 0; i < grid.length; i++) {
    // 此时转换
    if (grid[i][0] === 0) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j] = grid[i][j] === 0 ? 1 : 0;
      }
    }
  }

  // 每一列处理 - 第一列无需处理
  for (let i = 1; i < grid[0].length; i++) {
    let num = 0; // 计算 1 的个数
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i] === 1) num++;
    }

    // 如果 0 比较多 - 转换
    if (num < grid.length / 2) {
      for (let j = 0; j < grid.length; j++) {
        grid[j][i] = grid[j][i] === 0 ? 1 : 0;
      }
    }
  }

  // 计算结果
  let sum = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = grid[i].length - 1; j >= 0; j--) {
      sum += grid[i][j] * 2 ** (grid[i].length - 1 - j);
    }
  }

  return sum;
};
// @lc code=end

/*
// @lcpr case=start
// [[0,0,1,1],[1,0,1,0],[1,1,0,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[0]]\n
// @lcpr case=end

 */
