/*
 * @lc app=leetcode.cn id=2099 lang=javascript
 * @lcpr version=30204
 *
 * [2099] 找到和最大的长度为 K 的子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSubsequence = function (nums, k) {
  return nums
    .map((item, index) => [item, index])
    .sort((a, b) => b[0] - a[0])
    .slice(0, k)
    .sort((a, b) => a[1] - b[1])
    .map((item) => item[0]);
};
// @lc code=end

/*
// @lcpr case=start
// [50,-75]\n2\n
// @lcpr case=end

// @lcpr case=start
// [-1,-2,3,4]\n3\n
// @lcpr case=end

// @lcpr case=start
// [3,4,3,3]\n2\n
// @lcpr case=end

 */
