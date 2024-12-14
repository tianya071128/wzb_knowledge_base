/*
 * @lc app=leetcode.cn id=7 lang=javascript
 * @lcpr version=30204
 *
 * [7] 整数反转
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function (x) {
  // if (x === 0) return x;

  // let symbol = x > 0 ? 1 : -1, // 正整数还是负整数
  //   // max = x > 0 ? x ** 31 - 1 : x ** 31, // 允许的最大值
  //   integer = Math.abs(x), // 取正数
  //   n = Math.floor(Math.log10(integer)), // 指数级
  //   last, // 末位
  //   res = 0; // 结果
  // while (n >= 0) {
  //   // 取出整数的末位
  //   last = integer % 10;
  //   res += last * 10 ** n;

  //   // 重置值
  //   integer = Math.floor(integer / 10);
  //   n--;
  // }

  // res = symbol * res;

  // if (res > 2 ** 31 - 1 || res < -(2 ** 31)) return 0;

  // return res;

  /**
   * 优化后, 更更简洁: https://leetcode.cn/problems/reverse-integer/solutions/755611/zheng-shu-fan-zhuan-by-leetcode-solution-bccn/
   */
  let rev = 0;
  while (x !== 0) {
    const digit = x % 10;
    x = ~~(x / 10); // 同 Math.floor(x / 10)
    rev = rev * 10 + digit;
    if (rev < Math.pow(-2, 31) || rev > Math.pow(2, 31) - 1) {
      return 0;
    }
  }
  return rev;
};
// @lc code=end

/*
// @lcpr case=start
// 123\n
// @lcpr case=end

// @lcpr case=start
// -123\n
// @lcpr case=end

// @lcpr case=start
// 120\n
// @lcpr case=end

// @lcpr case=start
// 0\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = reverse;
// @lcpr-after-debug-end
