/*
 * @lc app=leetcode.cn id=1043 lang=javascript
 * @lcpr version=30204
 *
 * [1043] 分隔数组以得到最大和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var maxSumAfterPartitioning = function (arr, k) {
  /**
   * 动态规划
   */
  const dp = new Array(arr.length).fill(0);
  dp[0] = arr[0];
  for (let i = 1; i < arr.length; i++) {
    // 以该项为结尾, 倒推前 k 项
    let max = arr[i];
    for (let j = i; j >= Math.max(0, i - k + 1); j--) {
      max = Math.max(max, arr[j]);
      dp[i] = Math.max(dp[i], (dp[j - 1] ?? 0) + max * (i - j + 1));
    }
  }

  return dp.at(-1);
};
// @lc code=end

/*
// @lcpr case=start
// [1,15,7,9,2,5,10]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,4,1,5,7,3,6,1,9,9,3]\n4\n
// @lcpr case=end

// @lcpr case=start
// [1]\n1\n
// @lcpr case=end

 */
