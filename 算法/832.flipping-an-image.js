/*
 * @lc app=leetcode.cn id=832 lang=javascript
 * @lcpr version=30204
 *
 * [832] 翻转图像
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} image
 * @return {number[][]}
 */
var flipAndInvertImage = function (image) {
  for (let i = 0; i < image.length; i++) {
    let left = 0,
      right = image[i].length - 1;

    while (left <= right) {
      if (left === right) {
        image[i][left] = image[i][left] === 0 ? 1 : 0;
      } else {
        // 交换位置
        [image[i][left], image[i][right]] = [image[i][right], image[i][left]];
        image[i][left] = image[i][left] === 0 ? 1 : 0;
        image[i][right] = image[i][right] === 0 ? 1 : 0;
      }

      left++;
      right--;
    }
  }

  return image;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,1,0],[1,0,1],[0,0,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = flipAndInvertImage;
// @lcpr-after-debug-end
