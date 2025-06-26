/*
 * @lc app=leetcode.cn id=540 lang=javascript
 * @lcpr version=30204
 *
 * [540] 有序数组中的单一元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNonDuplicate = function (nums) {
  /**
   * 二分搜索 --> 元素个数肯定是奇数
   *  - , 说明右区间是双数, 此时右指针移动到中间指针往左移动两位
   *  - , 说明左区间是双数, 此时左指针移动到中间指针往右移动两位
   *  - 其他情况, 找到数据返回
   */
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((right - left) / 2) + left;

    // 当中间指针对应的值与左边是一对
    if (nums[mid] === nums[mid - 1]) {
      // 继续判断, 区间数量
      if (Math.floor((right - left + 1) / 2) % 2 === 0) {
        right = mid - 2;
      } else {
        left = mid + 1;
      }
    }
    // 当中间指针对应的值与右边是一对
    else if (nums[mid] === nums[mid + 1]) {
      // 继续判断, 区间数量
      if (Math.floor((right - left + 1) / 2) % 2 === 0) {
        left = mid + 2;
      } else {
        right = mid - 1;
      }
    } else {
      return nums[mid];
    }
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,2,3,3,4,4,8,8]\n
// @lcpr case=end

// @lcpr case=start
// [3,3,7,7,10,11,11]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = singleNonDuplicate;
// @lcpr-after-debug-end
