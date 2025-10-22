/*
 * @lc app=leetcode.cn id=836 lang=javascript
 * @lcpr version=30204
 *
 * [836] 矩形重叠
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} rec1
 * @param {number[]} rec2
 * @return {boolean}
 */
var isRectangleOverlap = function (rec1, rec2) {
  /**
   * 要重叠, 那么必然 X 轴和 Y 轴都有相交点
   */
  return (
    ((rec1[0] >= rec2[0] && rec1[0] < rec2[2]) ||
      (rec2[0] >= rec1[0] && rec2[0] < rec1[2])) &&
    ((rec1[1] >= rec2[1] && rec1[1] < rec2[3]) ||
      (rec2[1] >= rec1[1] && rec2[1] < rec1[3]))
  );
};
// @lc code=end

/*
// @lcpr case=start
// [2,2,0,0]\n[1,1,3,3]\n
// @lcpr case=end

// @lcpr case=start
// [0,0,1,1]\n[1,0,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [0,0,1,1]\n[2,2,3,3]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isRectangleOverlap;
// @lcpr-after-debug-end
