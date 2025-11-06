/*
 * @lc app=leetcode.cn id=1006 lang=javascript
 * @lcpr version=30204
 *
 * [1006] 笨阶乘
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var clumsy = function (n) {
  /**
   * 观察可知:
   *  如果之前的符号是 - 时, 那么就需要后面三个数 n * (n - 1) / (n - 2)
   */
  let ans,
    prev = '-1';
  while (n > 0) {
    if (prev === '+') {
      prev = '-';
      ans += n;
      n--;
    } else {
      let res = Math.floor((n * Math.max(1, n - 1)) / Math.max(1, n - 2));
      prev = '+';

      if (ans == null) {
        ans = res;
      } else {
        ans -= res;
      }
      n -= 3;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 10000\n
// @lcpr case=end

// @lcpr case=start
// 10\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = clumsy;
// @lcpr-after-debug-end
