/*
 * @lc app=leetcode.cn id=1929 lang=javascript
 * @lcpr version=30204
 *
 * [1929] 数组串联
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var getConcatenation = function (nums) {
  nums.push(...nums);
  return nums;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,3,2,1]\n
// @lcpr case=end

 */
