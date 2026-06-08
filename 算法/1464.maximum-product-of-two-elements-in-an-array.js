/*
 * @lc app=leetcode.cn id=1464 lang=javascript
 * @lcpr version=30204
 *
 * [1464] 数组中两元素的最大乘积
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
  nums.sort((a, b) => b - a);

  return (nums[0] - 1) * (nums[1] - 1);
};
// @lc code=end

/*
// @lcpr case=start
// [3,4,5,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,5,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [3,7]\n
// @lcpr case=end

 */
