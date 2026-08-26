/*
 * @lc app=leetcode.cn id=1827 lang=javascript
 * @lcpr version=30204
 *
 * [1827] 最少操作使数组递增
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var minOperations = function (nums) {
  /** @type {number} 结果 */
  let ans = 0;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] <= nums[i - 1]) {
      ans += nums[i - 1] - nums[i] + 1;
      nums[i] = nums[i - 1] + 1;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,5,2,4,1]\n
// @lcpr case=end

// @lcpr case=start
// [8]\n
// @lcpr case=end

 */
