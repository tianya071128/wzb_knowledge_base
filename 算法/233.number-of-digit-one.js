/*
 * @lc app=leetcode.cn id=233 lang=javascript
 * @lcpr version=30204
 *
 * [233] 数字 1 的个数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var countDigitOne = function (n) {
  /**
   * 计算每位数为 1 时, 其他位数的可能性:
   *  e.g: 1321
   *
   *  千位为 1 时, 后面有 321 + 1 中可能性
   *  百位为 1 时, 因为百位的比 1 大, 所以之后的位取最大 1 * 100 + 99 + 1
   *  ...
   *
   * - 当位数为 1 时, 其他位数的可能性就会组成的数字, 最后加 1
   * - 当位数大于 1 时, 其他位数的可能性就是之前的位数不变, 后面的位数全部为 9, 最后加 1
   * - 当位数小于 1 时, 其他位数的可能性就是之前的位数减1, 后面的位数全部为 9, 最后加 1
   */
  if (n <= 9) return n < 1 ? 0 : 1;

  let len = Math.floor(Math.log10(n)),
    ans = 0;
  for (let i = 0; i <= len; i++) {
    let left = Math.floor(n / 10 ** (len - i + 1)), // 当前位左侧数
      temp = n % 10 ** (len - i + 1), // 除去左侧位其余的
      cur = Math.floor(temp / 10 ** (len - i)), // 当前位
      right = temp % 10 ** (len - i), // 右侧位
      leftBei = 10 ** (len - i);

    if (cur === 1) {
      ans += left * leftBei + right + 1;
    } else if (cur < 1) {
      ans += (left - 1) * leftBei + 10 ** (len - i);
    } else {
      ans += left * leftBei + 10 ** (len - i);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 2401123\n
// @lcpr case=end

// @lcpr case=start
// 13\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = countDigitOne;
// @lcpr-after-debug-end
