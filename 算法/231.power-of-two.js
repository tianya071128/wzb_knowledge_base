/*
 * @lc app=leetcode.cn id=231 lang=javascript
 * @lcpr version=30204
 *
 * [231] 2 的幂
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfTwo = function (n) {
  while (n > 1 && n % 2 === 0) {
    n = n / 2;
  }

  return n === 1;
};
// @lc code=end

/*
// @lcpr case=start
// -16\n
// @lcpr case=end

// @lcpr case=start
// 16\n
// @lcpr case=end

// @lcpr case=start
// 3\n
// @lcpr case=end

 */
