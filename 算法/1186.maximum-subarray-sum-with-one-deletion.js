/*
 * @lc app=leetcode.cn id=1186 lang=javascript
 * @lcpr version=30204
 *
 * [1186] 删除一次得到子数组最大和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var maximumSum = function (arr) {
  /**
   * 动态规划:
   *  以每项结尾有两个状态:
   *   - 不删除 f(i) = f(i - 1)[不删除] + arr[i]
   *   - 删除   f(i) = Math.max(f(i - 1)[删除] + arr[i], f(i - 1)[不删除])
   */
  let ans = -Infinity,
    dp = [0, 0]; // 滚动 dp - [不删除, 删除]

  for (let i = 0; i < arr.length; i++) {
    dp[1] = Math.max(dp[0], dp[1] + arr[i]);
    dp[0] = dp[0] + arr[i];

    ans = Math.max(ans, ...dp);
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maximumSum
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,-2,0,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,-2,-2,3]\n
// @lcpr case=end

// @lcpr case=start
// [-1,-1,-1,-1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maximumSum;
// @lcpr-after-debug-end