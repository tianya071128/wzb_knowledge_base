/*
 * @lc app=leetcode.cn id=633 lang=javascript
 * @lcpr version=30204
 *
 * [633] 平方数之和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} c
 * @return {boolean}
 */
var judgeSquareSum = function (c) {
  /**
   * 使用双指针
   */
  let left = 0,
    right = Math.floor(Math.sqrt(c));
  while (left <= right) {
    const sum = left * left + right * right;

    if (sum === c) {
      return true;
    } else if (sum > c) {
      right--;
    } else {
      left++;
    }
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// 1\n
// @lcpr case=end

// @lcpr case=start
// 2147483647\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = judgeSquareSum;
// @lcpr-after-debug-end
