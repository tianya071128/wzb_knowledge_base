/*
 * @lc app=leetcode.cn id=34 lang=javascript
 * @lcpr version=30204
 *
 * [34] 在排序数组中查找元素的第一个和最后一个位置
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
  // 二分法, 但主要注意左右边界
  let left = 0,
    right = nums.length - 1;
  // 外迭代通过二分查找, 确定目标值的索引
  while (right >= left) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      left = right = mid;
      // 找到目标值的索引, 向左右分散,找到最终索引
      while (nums[left - 1] === target) {
        left--;
      }
      while (nums[right + 1] === target) {
        right++;
      }
      return [left, right];
    }
    // 移动右指针
    else if (nums[mid] > target) {
      right = mid - 1;
    }
    // 移动左指针
    else {
      left = mid + 1;
    }
  }

  return [-1, -1];
};
// @lc code=end

/*
// @lcpr case=start
// [5,7,7,8,8,10]\n8\n
// @lcpr case=end

// @lcpr case=start
// [5,7,7,8,8,10]\n6\n
// @lcpr case=end

// @lcpr case=start
// []\n0\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = searchRange;
// @lcpr-after-debug-end
