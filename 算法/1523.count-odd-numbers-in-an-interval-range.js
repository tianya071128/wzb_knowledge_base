/*
 * @lc app=leetcode.cn id=1523 lang=javascript
 * @lcpr version=30204
 *
 * [1523] 在区间范围内统计奇数数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} low
 * @param {number} high
 * @return {number}
 */
var countOdds = function (low, high) {
  let total = high - low + 1;

  return Math.floor(total / 2) + (total % 2 === 1 && high % 2 === 1 ? 1 : 0);
};
// @lc code=end

/*
// @lcpr case=start
// 3\n7\n
// @lcpr case=end

// @lcpr case=start
// 8\n10\n
// @lcpr case=end

 */
