/*
 * @lc app=leetcode.cn id=867 lang=javascript
 * @lcpr version=30204
 *
 * [867] 转置矩阵
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var transpose = function (matrix) {
  /**
   * 直接模拟即可
   */
  // 直接在生成数组的时候就可以赋值的...
  let ans = Array(matrix[0].length)
    .fill(0)
    .map((item) => Array(matrix.length).fill(0));

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      ans[j][i] = matrix[i][j];
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2,3],[4,5,6],[7,8,9]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2,3],[4,5,6]]\n
// @lcpr case=end

 */
