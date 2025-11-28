/*
 * @lc app=leetcode.cn id=1314 lang=javascript
 * @lcpr version=30204
 *
 * [1314] 矩阵区域和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} mat
 * @param {number} k
 * @return {number[][]}
 */
var matrixBlockSum = function (mat, k) {
  /**
   * 二维前缀和
   */
  let m = mat.length,
    n = mat[0].length,
    prefixSum = new Array(m + 1).fill(0).map((item) => Array(n + 1).fill(0));

  // 计算前缀和
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      prefixSum[i + 1][j + 1] =
        prefixSum[i + 1][j] + prefixSum[i][j + 1] - prefixSum[i][j] + mat[i][j];
    }
  }

  // 复用 mat 作为返回值
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 得出所求区域的范围
      let mMin = Math.max(i - k, 0),
        mMax = Math.min(i + k, m - 1),
        nMin = Math.max(j - k, 0),
        nMax = Math.min(j + k, n - 1);

      mat[i][j] =
        prefixSum[mMax + 1][nMax + 1] -
        prefixSum[mMax + 1][nMin] -
        prefixSum[mMin][nMax + 1] +
        prefixSum[mMin][nMin];
    }
  }

  return mat;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=matrixBlockSum
// paramTypes= ["number[][]","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [[1]]\n2\n
// @lcpr case=end

// @lcpr case=start
// [[1,2,3],[4,5,6],[7,8,9]]\n2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = matrixBlockSum;
// @lcpr-after-debug-end
