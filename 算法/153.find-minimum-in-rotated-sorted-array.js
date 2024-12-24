/*
 * @lc app=leetcode.cn id=153 lang=javascript
 * @lcpr version=30204
 *
 * [153] 寻找旋转排序数组中的最小值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  // 二分查找
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2),
      n1 = nums[left],
      n2 = nums[mid],
      n3 = nums[right];

    if (n1 <= n3) {
      return n1;
    }
    // 中间指针正好为最小值
    else if (n2 < nums[mid - 1]) {
      return n2;
    }
    // 移动右指针
    else if (n2 < n3) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return nums[left];
};
// @lc code=end

/*
// @lcpr case=start
// [3,4,5,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [4,5,6,7,0,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [11,13,15,17]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findMin;
// @lcpr-after-debug-end
