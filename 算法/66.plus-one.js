/*
 * @lc app=leetcode.cn id=66 lang=javascript
 * @lcpr version=30204
 *
 * [66] 加一
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
  /**
   * 思路:
   *  1. 反向遍历, 数组项 +1
   *  2. 如遇进位, 则继续遍历
   *      2.1 直到没有进位的
   *      2.2 如果一直遍历到头部, 还存在进位的, 那在头部插入一位 1
   */
  let carry = 1;
  for (let i = digits.length - 1; i >= 0; i--) {
    const item = digits[i] + carry;
    if (item > 9) {
      digits[i] = item - 10;
      carry = 1;
    } else {
      digits[i] = item;
      return digits;
    }
  }

  if (carry) digits.unshift(1);

  return digits;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [4,3,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [9]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = plusOne;
// @lcpr-after-debug-end
