/*
 * @lc app=leetcode.cn id=1374 lang=javascript
 * @lcpr version=30204
 *
 * [1374] 生成每种字符都是奇数个的字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {string}
 */
var generateTheString = function (n) {
  return 'a'.repeat(n % 2 === 0 ? n - 1 : n) + 'b'.repeat(n % 2 === 0 ? 1 : 0);
};
// @lc code=end

/*
// @lcpr case=start
// 4\n
// @lcpr case=end

// @lcpr case=start
// 2\n
// @lcpr case=end

// @lcpr case=start
// 7\n
// @lcpr case=end

 */
