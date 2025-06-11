/*
 * @lc app=leetcode.cn id=342 lang=javascript
 * @lcpr version=30204
 *
 * [342] 4的幂
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfFour = function (n) {
  /**
   * 与 3 的幂类似
   */
  if (n < 1) return false;

  let start = 1;
  while (start < n) {
    start *= 4;
  }

  return start === n;
};
// @lc code=end

/*
// @lcpr case=start
// 2\n
// @lcpr case=end

// @lcpr case=start
// 5\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */
