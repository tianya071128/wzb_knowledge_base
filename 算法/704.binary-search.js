/*
 * @lc app=leetcode.cn id=704 lang=javascript
 * @lcpr version=30204
 *
 * [704] 二分查找
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  // 二分查找
  let left = 0,
    right = nums.length - 1; //闭区间

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const n = nums[mid];

    if (n === target) {
      return mid;
    } else if (n > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return -1;
};
// @lc code=end

/*
// @lcpr case=start
// [-1,0,3,5,9,12]\n9\n
// @lcpr case=end

// @lcpr case=start
// [-1,0,3,5,9,12]\n2\n
// @lcpr case=end

 */
