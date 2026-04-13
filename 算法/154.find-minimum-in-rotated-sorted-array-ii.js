/*
 * @lc app=leetcode.cn id=154 lang=javascript
 * @lcpr version=30204
 *
 * [154] 寻找旋转排序数组中的最小值 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  /**
   * 二分搜索
   */
  let l = 0,
    r = nums.length - 1;
  while (l < r) {
    // 如果左指针的值比右
    let mid = l + Math.floor((r - l) / 2);

    // 如果左指针的值比右指针的值要小, 说明已经是排序好的数组
    if (nums[l] < nums[r]) {
      break;
    }
    // 如果 mid 比右端的值要大, 说明在右区间
    else if (nums[mid] > nums[r]) {
      l = mid + 1;
    }
    // 如果 mid 比右端的值要小, 说明在左区间
    else if (nums[mid] > nums[r]) {
      r = mid;
    }
    // 相同的话, 丢弃右边界
    else {
      r--;
    }
  }

  return nums[l];
};
// @lc code=end

/*
// @lcpr case=start
// [10,1,10,10,10]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,2,0,1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findMin;
// @lcpr-after-debug-end
