/*
 * @lc app=leetcode.cn id=357 lang=javascript
 * @lcpr version=30204
 *
 * [357] 统计各位数字都不同的数字个数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var countNumbersWithUniqueDigits = function (n) {
  /**
   * 当 n 为 4, 需要计算出 n 为 3 的数量总和, 以及 10000 - 99999 之间的值
   * 观察可知:
   *  第一位可以为 1 ~ 9 之间的数, 所以有 9 种可能
   *  第二位可以为 0 ~ 9 之间的数, 但是需要提出第一位重复的值, 所以有 9 种可能
   *  第三位可以为 0 ~ 9 之间的数, 但是需要提出第一、二位重复的值, 所以有 8 种可能
   *  ...
   * 就可以得出 10000 - 99999 之间的值
   */

  let dp = [1, 10];

  for (let i = 2; i <= n; i++) {
    let total = 9 * 9,
      base = 8,
      cur = i - 2;
    while (cur) {
      total *= base;
      base--;
      cur--;
    }
    dp[i] = dp[i - 1] + total;
  }

  return dp[n];
};
// @lc code=end

/*
// @lcpr case=start
// 7\n
// @lcpr case=end

// @lcpr case=start
// 5\n
// @lcpr case=end

 */
