/*
 * @lc app=leetcode.cn id=326 lang=javascript
 * @lcpr version=30204
 *
 * [326] 3 的幂
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function (n) {
  if (n < 1) return false;

  let start = 1;
  while (start < n) {
    start *= 3;
  }

  return start === n;
};
// @lc code=end

/*
// @lcpr case=start
// 2147483647\n
// @lcpr case=end

// @lcpr case=start
// 0\n
// @lcpr case=end

// @lcpr case=start
// 9\n
// @lcpr case=end

// @lcpr case=start
// 45\n
// @lcpr case=end

 */
