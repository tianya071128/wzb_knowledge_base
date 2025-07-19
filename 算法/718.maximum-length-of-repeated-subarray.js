/*
 * @lc app=leetcode.cn id=718 lang=javascript
 * @lcpr version=30204
 *
 * [718] 最长重复子数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function (nums1, nums2) {
  /**
   * 动态规划
   */

  // 初始 dp 表 和 初始 dp 状态
  const dp = new Array(nums1.length + 1)
    .fill(0)
    .map((item) => new Array(nums2.length + 1).fill(0));

  // 状态转移方程: f[i][j] = Math.max(f[i - 1][j], f[i][j - 1], 以该元素结尾的最长数组元素)
  for (let i = 1; i < dp.length; i++) {
    for (let j = 1; j < dp[i].length; j++) {
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], helper(i - 1, j - 1));
    }
  }

  // 查找以指定元素为结尾的长度
  function helper(nums1End, nums2End) {
    let ans = 0;
    while (
      nums1End >= 0 &&
      nums2End >= 0 &&
      nums1[nums1End] === nums2[nums2End]
    ) {
      ans++;
      nums1End--;
      nums2End--;
    }

    return ans;
  }

  return dp[nums1.length][nums2.length];
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,2,1]\n[3,2,1,4,7]\n
// @lcpr case=end

// @lcpr case=start
// [0,0,0,0,0]\n[0,0,0,0,0]\n
// @lcpr case=end

 */
