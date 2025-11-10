/*
 * @lc app=leetcode.cn id=1027 lang=javascript
 * @lcpr version=30204
 *
 * [1027] 最长等差数列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestArithSeqLength = function (nums) {
  /**
   * 动态规划
   */
  let dp = Array.from({ length: nums.length }, () => new Map()),
    ans = 0;

  for (let i = 1; i < nums.length; i++) {
    /** 以该项为结尾 */
    for (let j = i - 1; j >= 0; j--) {
      let diff = nums[i] - nums[j];
      // 已经添加过
      if (dp[i].has(diff)) continue;

      let len = (dp[j].get(diff) ?? 1) + 1;
      dp[i].set(diff, len);

      ans = Math.max(ans, len);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,6,9,12]\n
// @lcpr case=end

// @lcpr case=start
// [9,4,7,2,10]\n
// @lcpr case=end

// @lcpr case=start
// [20,1,15,3,10,5,8]\n
// @lcpr case=end

 */
