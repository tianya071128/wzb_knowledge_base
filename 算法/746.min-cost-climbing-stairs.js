/*
 * @lc app=leetcode.cn id=746 lang=javascript
 * @lcpr version=30204
 *
 * [746] 使用最小花费爬楼梯
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = function (cost) {
  /**
   * 动态规划: 在开头和结尾插入 0, 固定起始和结束台阶
   */
  cost.push(0);
  cost.unshift(0);

  let cost1 = 0, // 第一个台阶
    cost2 = 0; // 到达的第二个台阶

  for (let i = 2; i < cost.length; i++) {
    // 状态转移方程: dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])
    const cost3 = Math.min(cost2 + cost[i - 1], cost1 + cost[i - 2]);

    cost1 = cost2;
    cost2 = cost3;
  }

  return cost2;
};
// @lc code=end

/*
// @lcpr case=start
// [10,15,20]\n
// @lcpr case=end

// @lcpr case=start
// [1,100,1,1,1,100,1,1,100,1]\n
// @lcpr case=end

 */
