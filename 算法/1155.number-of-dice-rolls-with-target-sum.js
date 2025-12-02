/*
 * @lc app=leetcode.cn id=1155 lang=javascript
 * @lcpr version=30204
 *
 * [1155] 掷骰子等于目标和的方法数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number} k
 * @param {number} target
 * @return {number}
 */
var numRollsToTarget = function (n, k, target) {
  /**
   * 动态规划: 以 n 和 target 作为二维 dp 组
   *  dp(n, target) = dp(n - 1, target - 1) + dp(n - 1, target - 2) ... + dp(n - 1, target - k)
   */
  // 滚动 dp 表
  let dp = new Array(target + 1).fill(0);

  // 初始化一个骰子时的结果
  for (let i = 1; i <= k; i++) {
    dp[i] = 1;
  }

  // 状态转移
  for (let i = 2; i <= n; i++) {
    // 当次 dp 表
    let cur = new Array(target + 1).fill(0);
    for (let j = 1; j <= target; j++) {
      let total = 0;
      for (let z = 1; z <= Math.min(j, k); z++) {
        total += dp[j - z];
      }
      cur[j] = total % (10 ** 9 + 7);
    }

    dp = cur;
  }

  return dp.at(-1);
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=numRollsToTarget
// paramTypes= ["number","number","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 1\n6\n3\n
// @lcpr case=end

// @lcpr case=start
// 20\n20\n70\n
// @lcpr case=end

// @lcpr case=start
// 30\n30\n500\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numRollsToTarget;
// @lcpr-after-debug-end
