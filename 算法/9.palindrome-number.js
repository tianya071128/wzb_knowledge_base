/*
 * @lc app=leetcode.cn id=9 lang=javascript
 * @lcpr version=30204
 *
 * [9] 回文数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
  // x = String(x);
  // len = Math.floor(x.length / 2);
  // for (let index = 0; index < len; index++) {
  //   if (x[index] !== x[x.length - index - 1]) return false;
  // }
  // return true;
  /**
   * 解题思路: https://leetcode.cn/problems/palindrome-number/solutions/260785/ji-jian-jie-fa-by-ijzqardmbd-2/
   *
   *  1. 负数肯定为 false
   *  2. 小于 10 的肯定为 true
   *  3. 其余的:
   *      3.1 任意大于零的十进制 k 位整数 x，通过整除 10^k−1 可截取首位数字。
   *      3.2 任意大于零的 k % 10 取末位
   *      3.2 (x % n) / 10 去除首位和末位，（x % n去除首位，x / 10去除末位），x 位数减 2 -- n 为数量级
   */
  if (x < 0) return false;
  if (x < 10) return true;
  /**
   * 获取数量级:
   *  例如: 12345 --> 4
   */
  let n = Math.floor(Math.log10(x));
  while (x > 0 && n > 0) {
    // 首位
    const first = Math.floor(x / 10 ** n);
    // 末位
    const last = x % 10;
    if (first !== last) return false;

    // 中间位
    x = Math.floor(Math.floor(x % 10 ** n) / 10);
    n -= 2;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// 121\n
// @lcpr case=end

// @lcpr case=start
// -121\n
// @lcpr case=end

// @lcpr case=start
// 10\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isPalindrome;
// @lcpr-after-debug-end
