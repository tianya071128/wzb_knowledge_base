/*
 * @lc app=leetcode.cn id=1572 lang=javascript
 * @lcpr version=30204
 *
 * [1572] 矩阵对角线元素的和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} mat
 * @return {number}
 */
var diagonalSum = function (mat) {
  /** @type {number} */
  let ans = 0,
    /** @type {number} 对角线 */
    x = 0,
    /** @type {number} 副对角线 */
    y = mat[0].length - 1;

  for (let i = 0; i < mat.length; i++) {
    ans += mat[i][x];

    if (x !== y) {
      ans += mat[i][y];
    }

    x++;
    y--;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2,3],[4,5,6],[7,8,9]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[5]]\n
// @lcpr case=end

 */
