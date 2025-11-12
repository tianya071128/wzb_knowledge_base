/*
 * @lc app=leetcode.cn id=1035 lang=javascript
 * @lcpr version=30204
 *
 * [1035] 不相交的线
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var maxUncrossedLines = function (nums1, nums2) {
  /**
   * 动态规划:
   *    - i 和 j 相同的话 dp[i][j] = dp[i - 1][j - 1] + 1
   *    - i 和 j 不相同的话 dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
   */
  let dp = Array.from({ length: nums1.length + 1 }, () =>
    Array(nums2.length + 1).fill(0)
  );

  for (let i = 0; i < nums1.length; i++) {
    for (let j = 0; j < nums2.length; j++) {
      if (nums1[i] === nums2[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  return dp[nums1.length][nums2.length];
};
// @lc code=end

/*
// @lcpr case=start
// [1]\n[3]\n
// @lcpr case=end

// @lcpr case=start
// [2,5,1,2,5]\n[10,5,2,1,5,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,3,7,1,7,5]\n[1,9,2,5,1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxUncrossedLines;
// @lcpr-after-debug-end
