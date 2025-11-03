/*
 * @lc app=leetcode.cn id=983 lang=javascript
 * @lcpr version=30204
 *
 * [983] 最低票价
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} days
 * @param {number[]} costs
 * @return {number}
 */
var mincostTickets = function (days, costs) {
  let dp = new Array(days.length + 1).fill(0);
  let j = 0;
  for (let i = 1; i <= days.length; i++) {
    dp[i] = dp[i - 1] + costs[0];
    while (j < days.length && days[j] < days[i - 1]) {
      j++;
    }
    dp[i] = Math.min(
      dp[i],
      dp[j] + costs[1],
      dp[Math.max(j - 6, 0)] + costs[2]
    );
  }
  return dp[days.length];
};
// @lc code=end

/*
// @lcpr case=start
// [1,4,6,7,8,20]\n[2,7,15]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,6,7,8,9,10,30,31]\n[2,7,15]\n
// @lcpr case=end

 */
