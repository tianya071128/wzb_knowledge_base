/*
 * @lc app=leetcode.cn id=896 lang=javascript
 * @lcpr version=30204
 *
 * [896] 单调数列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isMonotonic = function (nums) {
  let prev; // 1 递增 | -1 递减
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) continue;

    let cur = nums[i] > nums[i - 1] ? 1 : -1;

    if (prev && cur !== prev) return false;
    prev = cur;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [6,5,4,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,3,2]\n
// @lcpr case=end

 */
