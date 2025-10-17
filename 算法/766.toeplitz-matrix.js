/*
 * @lc app=leetcode.cn id=766 lang=javascript
 * @lcpr version=30204
 *
 * [766] 托普利茨矩阵
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {boolean}
 */
var isToeplitzMatrix = function (matrix) {
  /**
   * 模拟:
   *  起始点是固定的, 第一行和第一列
   */

  /**
   * 检测对角线上元素是否相同
   * @param {number} x 行
   * @param {*} y 列
   * @return {boolean} 是否相同
   */
  function isSame(x, y) {
    let n = matrix[x][y];

    while (x < matrix.length && y < matrix[0].length) {
      if (matrix[x][y] !== n) return false;

      x = x + 1;
      y = y + 1;
    }

    return true;
  }

  // 处理第一列
  for (let i = 0; i < matrix.length; i++) {
    if (!isSame(i, 0)) return false;
  }

  // 处理第一行
  for (let i = 1; i < matrix[0].length; i++) {
    if (!isSame(0, i)) return false;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2,3,4],[5,1,2,3],[9,5,1,2]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2],[2,2]]\n
// @lcpr case=end

 */
