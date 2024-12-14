/*
 * @lc app=leetcode.cn id=53 lang=javascript
 * @lcpr version=30204
 *
 * [53] 最大子数组和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  // 滑动窗口
  let left = 0,
    right = 1,
    num = nums[0], // 窗口区间内的总和
    max = nums[0]; // 最大值

  // 滑动右窗口
  while (right < nums.length) {
    num += nums[right];

    if (num > max) max = num;

    if (right < nums.length - 1 && nums[right + 1] < 0) {
      // 滑动左窗口
      do {
        left++;
        num -= nums[left];
        if (num > max) max = num;
      } while (left < right && nums[left + 1] >= nums[left]);
    }

    right++;
  }

  return max;
};
// @lc code=end

/*
// @lcpr case=start
// [-2,1,-3,4,-1,2,1,-5,4]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

// @lcpr case=start
// [5,4,-1,7,8]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxSubArray;
// @lcpr-after-debug-end
