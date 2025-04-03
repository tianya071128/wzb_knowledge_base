/*
 * @lc app=leetcode.cn id=304 lang=javascript
 * @lcpr version=30204
 *
 * [304] 二维区域和检索 - 矩阵不可变
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
// /**
//  * @param {number[][]} matrix
//  */
// var NumMatrix = function (matrix) {
//   this.cache = new Map();
//   this.matrix = matrix;
// };

// /**
//  * @param {number} row1
//  * @param {number} col1
//  * @param {number} row2
//  * @param {number} col2
//  * @return {number}
//  */
// NumMatrix.prototype.sumRegion = function (row1, col1, row2, col2) {
//   const cacheKey = `${row1}.${col1}.${row2}.${col2}`;

//   if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

//   let total = 0;
//   for (let row = row1; row <= row2; row++) {
//     for (let col = col1; col <= col2; col++) {
//       total += this.matrix[row][col];
//     }
//   }

//   this.cache.set(cacheKey, total);
//   return total;
// };

/**
 * 二维前缀和:
 *  参考: https://leetcode.cn/problems/range-sum-query-2d-immutable/solutions/2667331/tu-jie-yi-zhang-tu-miao-dong-er-wei-qian-84qp/
 */
/**
 * @param {number[][]} matrix
 */
var NumMatrix = function (matrix) {
  this.matrix = matrix;

  // 预先求前缀和
  const sum = new Array(matrix.length + 1)
    .fill(0)
    .map((item) => new Array(matrix[0].length + 1).fill(0));
  for (let i = 1; i <= matrix.length; i++) {
    for (let j = 1; j <= matrix[0].length; j++) {
      sum[i][j] =
        sum[i - 1][j] +
        sum[i][j - 1] -
        sum[i - 1][j - 1] +
        matrix[i - 1][j - 1];
    }
  }
  this.sum = sum;
};

/**
 * @param {number} row1
 * @param {number} col1
 * @param {number} row2
 * @param {number} col2
 * @return {number}
 */
NumMatrix.prototype.sumRegion = function (row1, col1, row2, col2) {
  return (
    this.sum[row2 + 1][col2 + 1] -
    this.sum[row1][col2 + 1] -
    this.sum[row2 + 1][col1] +
    this.sum[row1][col1]
  );
};

/**
 * Your NumMatrix object will be instantiated and called as such:
 * var obj = new NumMatrix(matrix)
 * var param_1 = obj.sumRegion(row1,col1,row2,col2)
 */
// @lc code=end

/*
// @lcpr case=start
// ["NumMatrix","sumRegion","sumRegion","sumRegion"]\n[[[[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]],[2,1,4,3],[1,1,2,2],[1,2,2,4]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = NumMatrix;
// @lcpr-after-debug-end
