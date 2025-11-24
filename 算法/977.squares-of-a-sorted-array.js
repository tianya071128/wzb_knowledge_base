/*
 * @lc app=leetcode.cn id=977 lang=javascript
 * @lcpr version=30204
 *
 * [977] 有序数组的平方
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function (nums) {
  return nums.map((item) => item ** 2).sort((a, b) => a - b);
};
// @lc code=end

/*
// @lcpr case=start
// [-4,-1,0,3,10]\n
// @lcpr case=end

// @lcpr case=start
// [-7,-3,2,3,11]\n
// @lcpr case=end

 */
