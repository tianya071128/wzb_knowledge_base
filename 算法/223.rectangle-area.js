/*
 * @lc app=leetcode.cn id=223 lang=javascript
 * @lcpr version=30204
 *
 * [223] 矩形面积
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

function getJoinLength(a1, a2, b1, b2) {
  if (a1 >= b1 && a1 < b2) {
    return Math.min(a2, b2) - a1;
  } else if (a2 <= b2 && a2 > b1) {
    return a2 - Math.max(a1, b1);
  } else if (a1 <= b1 && a2 >= b2) {
    return b2 - b1;
  } else {
    return 0;
  }
}

/**
 * @param {number} ax1
 * @param {number} ay1
 * @param {number} ax2
 * @param {number} ay2
 * @param {number} bx1
 * @param {number} by1
 * @param {number} bx2
 * @param {number} by2
 * @return {number}
 */
var computeArea = function (ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
  // 面积 = 矩阵1 + 矩阵2 - 并集面积
  const joinX = getJoinLength(ax1, ax2, bx1, bx2);
  const joinY = getJoinLength(ay1, ay2, by1, by2);

  return (ax2 - ax1) * (ay2 - ay1) + (bx2 - bx1) * (by2 - by1) - joinX * joinY;
};
// @lc code=end

/*
// @lcpr case=start
// -3\n0\n3\n4\n0\n-1\n9\n2\n
// @lcpr case=end

// @lcpr case=start
// -2\n-2\n2\n2\n-2\n-2\n2\n2\n
// @lcpr case=end

// @lcpr case=start
// -2\n-2\n2\n2\n-1\n-1\n1\n1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = computeArea;
// @lcpr-after-debug-end
