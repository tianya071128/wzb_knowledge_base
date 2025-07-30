/*
 * @lc app=leetcode.cn id=733 lang=javascript
 * @lcpr version=30204
 *
 * [733] 图像渲染
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} image
 * @param {number} sr
 * @param {number} sc
 * @param {number} color
 * @return {number[][]}
 */
var floodFill = function (image, sr, sc, color) {
  // 如果初始像素与 color 相同, 那么直接返回
  if (image[sr][sc] === color) return image;

  let init = image[sr][sc], // 初始像素
    queue = [[sr, sc]], // 处理的队列
    cur; // 当前处理坐标

  while ((cur = queue.shift())) {
    // 如果不与初始像素相同, 不处理当前
    if (image[cur[0]]?.[cur[1]] !== init) continue;

    image[cur[0]][cur[1]] = color;

    // 将上下左右四个添加至队列
    queue.push(
      [cur[0] + 1, cur[1]],
      [cur[0] - 1, cur[1]],
      [cur[0], cur[1] + 1],
      [cur[0], cur[1] - 1]
    );
  }

  return image;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,1,1],[1,1,0],[1,0,1]]\n1\n1\n2\n
// @lcpr case=end

// @lcpr case=start
// [[0,0,0],[0,0,0]]\n0\n0\n0\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = floodFill;
// @lcpr-after-debug-end
