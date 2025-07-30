/*
 * @lc app=leetcode.cn id=740 lang=javascript
 * @lcpr version=30204
 *
 * [740] 删除并获得点数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var deleteAndEarn = function (nums) {
  /**
   * 贪心:
   *  1. 先 hash 记录下数字的个数, 并且对数字进行排序
   *  2. 对数字进行动态规划
   *      f(i) =
   *        - 如果当前 i 元素与上一个元素不相连, 则 f(i) = f(i - 1) + sum(i)
   *        - 相连, 则 f(i) = max(f(i - 2) + sum(i), f(i - 1))
   */

  const hash = new Map();
  for (const n of nums) {
    hash.set(n, (hash.get(n) ?? 0) + n);
  }

  // 动态规划
  const list = [...hash.keys()].sort((a, b) => a - b),
    dp = new Array(list.length + 1).fill(0);

  // 初始状态
  dp[1] = hash.get(list[0]);

  // 状态转移方程
  for (let i = 2; i < dp.length; i++) {
    const sum = hash.get(list[i - 1]);
    // 如果当前 i 元素与上一个元素不相连
    if (list[i - 1] - list[i - 2] !== 1) {
      dp[i] = dp[i - 1] + sum;
    }
    // 相连
    else {
      dp[i] = Math.max(dp[i - 2] + sum, dp[i - 1]);
    }
  }

  return dp.at(-1);
};
// @lc code=end

/*
// @lcpr case=start
// [3,4,2]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,3,3,3,4,5,5,5,5,5,6,6,6,6]\n
// @lcpr case=end

 */
