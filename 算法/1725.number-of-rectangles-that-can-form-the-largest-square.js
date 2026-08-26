/*
 * @lc app=leetcode.cn id=1725 lang=javascript
 * @lcpr version=30204
 *
 * [1725] 可以形成最大正方形的矩形数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} rectangles
 * @return {number}
 */
var countGoodRectangles = function (rectangles) {
  /** @type {number} 结果 */
  let ans = 0,
    /** @type {number} 最大边长 */
    maxLen = 0;

  for (const [h, w] of rectangles) {
    /** @type {number} 正方形取两边最短的 */
    let cur = Math.min(h, w);

    if (cur === maxLen) {
      ans++;
    } else if (cur > maxLen) {
      ans = 1;
      maxLen = cur;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[5,8],[3,9],[5,12],[16,5]]\n
// @lcpr case=end

// @lcpr case=start
// [[2,3],[3,7],[4,3],[3,7]]\n
// @lcpr case=end

 */
