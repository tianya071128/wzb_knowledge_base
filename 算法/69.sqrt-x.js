/*
 * @lc app=leetcode.cn id=69 lang=javascript
 * @lcpr version=30204
 *
 * [69] x 的平方根
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function (x) {
  if (x <= 1) return x;
  /**
   * 解题思路: 二分搜索
   */
  let left = 0,
    right = x,
    current;
  while (right - left > 1) {
    current = Math.floor((right + left) / 2);

    if (current * current <= x) {
      left = current;
    } else {
      right = current;
    }
  }

  return left;
};
// @lc code=end

/*
// @lcpr case=start
// 4\n
// @lcpr case=end

// @lcpr case=start
// 8\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = mySqrt;
// @lcpr-after-debug-end
