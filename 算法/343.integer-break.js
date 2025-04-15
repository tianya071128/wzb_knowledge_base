/*
 * @lc app=leetcode.cn id=343 lang=javascript
 * @lcpr version=30204
 *
 * [343] 整数拆分
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var integerBreak = function (n) {
  if (n === 2) return 1;
  if (n === 3) return 2;
  if (n === 4) return 4;

  /**
   * 观察规律得出结论:
   *  当余数可以 拆分为 3 * x 时是比较大
   */
  let total = 1;
  while (n >= 5) {
    total *= 3;
    n -= 3;
  }

  return total * n;
};
// @lc code=end

/*
// @lcpr case=start
// 5\n
// @lcpr case=end

// @lcpr case=start
// 6\n
// @lcpr case=end

// @lcpr case=start
// 7\n
// @lcpr case=end

// @lcpr case=start
// 8\n
// @lcpr case=end

 */
