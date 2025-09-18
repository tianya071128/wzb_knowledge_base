/*
 * @lc app=leetcode.cn id=907 lang=javascript
 * @lcpr version=30204
 *
 * [907] 子数组的最小值之和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var sumSubarrayMins = function (arr) {
  /**
   * 动态规划: 规划以当前项为结尾的子数组的最小总和 --> sum(dp) 即为最终结果
   *
   *  dp[j] = dp[j - 1] + (以当前项为结尾的子数组个数) * 当前项
   *
   */
  let dp = new Array(arr.length).fill(0),
    ans = 0,
    mold = 10 ** 9 + 7;
  stack = [[-Infinity, -1]]; // 单调递增栈, 用于快速找到比某项更小的值

  for (let i = 0; i < arr.length; i++) {
    // 通过单调栈找到比 arr[i] 小(或等于)的项索引
    while (stack.at(-1)[0] > arr[i]) {
      // 出栈
      stack.pop();
    }

    let divideI = stack.at(-1)[1]; // 分界线索引
    dp[i] = (dp[divideI] ?? 0) + (i - divideI) * arr[i];

    // 入栈
    stack.push([arr[i], i]);
    ans = (dp[i] + ans) % mold;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,1,2,4]\n
// @lcpr case=end

// @lcpr case=start
// [11,81,94,43,3]\n
// @lcpr case=end

 */
