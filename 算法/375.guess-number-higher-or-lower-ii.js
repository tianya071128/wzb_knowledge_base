/*
 * @lc app=leetcode.cn id=375 lang=javascript
 * @lcpr version=30204
 *
 * [375] 猜数字大小 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var getMoneyAmount = function (n) {
  if (n <= 1) return 0;
  if (n === 2) return 1;
  if (n === 3) return 2;

  return Math.max(getMoneyAmount(n - 4) + (n - 3), n - 3 + (n - 1));
};
// @lc code=end

/*
// @lcpr case=start
// 28\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

// @lcpr case=start
// 2\n
// @lcpr case=end

 */
