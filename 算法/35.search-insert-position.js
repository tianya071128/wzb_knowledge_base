/*
 * @lc app=leetcode.cn id=35 lang=javascript
 * @lcpr version=30204
 *
 * [35] 搜索插入位置
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
  /**
   * 优化: 根据题解 https://leetcode.cn/problems/search-insert-position/solutions/2023391/er-fen-cha-zhao-zong-shi-xie-bu-dui-yi-g-nq23/
   */
  let left = 0,
    right = nums.length - 1; // 闭区间 [left, right]
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] < target) {
      left = mid + 1; // 范围缩小到 [mid+1, right]
    } else {
      right = mid - 1; // 范围缩小到 [left, mid-1]
    }
  }
  return left;

  /**
   * 二分法: 因为是已经排序好的数组
   */
  // let left = 0,
  //   right = nums.length - 1,
  //   i = 0,
  //   item;
  // while (left <= right) {
  //   // 比较的索引
  //   i = Math.floor((right - left) / 2) + left;
  //   item = nums[i];
  //   // 匹配到了, 那么直接返回
  //   if (item === target) return i;
  //   // 处理情况1: 当左指针等于比较的索引时, 并且目标值小于于比较索引
  //   // 此时表示没有匹配到, 直接返回应该插入的位置
  //   if (left === i && target < item) return i;
  //   // 处理情况2: 当右指针等于比较的索引时, 并且目标值大于比较索引
  //   // 此时表示没有匹配到, 直接返回应该插入的位置
  //   if (right === i && target > item) return i + 1;
  //   // 特殊情况移动指针：如果左指针等于比较索引，那么左右指针都等于右指针
  //   if (left === i) {
  //     left = right;
  //   }
  //   // 如果目标大于比较索引, 那么移动左指针, 反之移动右指针
  //   else {
  //     if (target > nums[i]) {
  //       left = i;
  //     } else {
  //       right = i;
  //     }
  //   }
  // }
};
// @lc code=end

/*
// @lcpr case=start
// [1,3,5,6]\n5\n
// @lcpr case=end

// @lcpr case=start
// [1,3,5,6]\n2\n
// @lcpr case=end

// @lcpr case=start
// [1,3,5,6]\n7\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = searchInsert;
// @lcpr-after-debug-end
