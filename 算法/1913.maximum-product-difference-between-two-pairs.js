/*
 * @lc app=leetcode.cn id=1913 lang=javascript
 * @lcpr version=30204
 *
 * [1913] 两个数对之间的最大乘积差
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProductDifference = function (nums) {
  /** 最大的两个值 - 最小的两个值 */
  nums.sort((a, b) => a - b);

  return nums.at(-1) * nums.at(-2) - nums[0] * nums[1];
};
// @lc code=end

/*
// @lcpr case=start
// [5,6,2,7,4]\n
// @lcpr case=end

// @lcpr case=start
// [4,2,5,9,7,4,8]\n
// @lcpr case=end

 */
