/*
 * @lc app=leetcode.cn id=48 lang=javascript
 * @lcpr version=30204
 *
 * [48] 旋转图像
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  let record = [],
    len = matrix.length - 1;

  for (let i = len; i >= 0; i--) {
    const nums = matrix[i];
    for (let j = 0; j < nums.length; j++) {
      const currentItem = record[i * (len + 1) + j] ?? nums[j];

      // 该项旋转后的位置
      const row = j,
        column = len - i,
        ratateItem = matrix[row][column];

      // 将该项存入到 record 中
      record[row * (len + 1) + column] = ratateItem;
      matrix[row][column] = currentItem;
    }
  }
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2,3],[4,5,6],[7,8,9]]\n
// @lcpr case=end

// @lcpr case=start
// [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = rotate;
// @lcpr-after-debug-end
