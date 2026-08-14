/*
 * @lc app=leetcode.cn id=1688 lang=javascript
 * @lcpr version=30204
 *
 * [1688] 比赛中的配对次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var numberOfMatches = function (n) {
  /** @type {number} 结果 */
  let ans = 0;

  while (n > 1) {
    ans += Math.floor(n / 2);

    n = Math.ceil(n / 2);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 7\n
// @lcpr case=end

// @lcpr case=start
// 14\n
// @lcpr case=end

 */
