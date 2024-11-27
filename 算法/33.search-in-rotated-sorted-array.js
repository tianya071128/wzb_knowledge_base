/*
 * @lc app=leetcode.cn id=33 lang=javascript
 * @lcpr version=30204
 *
 * [33] 搜索旋转排序数组
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
  /**
   * 要求时间复杂度为 O(log n) 的算法, 那么可以使用二分搜索法
   * 但问题在于这是一个升序排列后旋转了一次的数组, 所以指针移动时有一些细小的差异
   *
   * 可以将这个数组分为两个数组看, 两个数组之间就是排序的, 并且左边的数组最小值比右边的数组的最大值都要大
   */
  let left = 0,
    right = nums.length - 1,
    n1 = nums[left],
    n2,
    n3 = nums[right],
    c;
  while (right - left > 1) {
    c = left + Math.floor((right - left) / 2);
    n1 = nums[left];
    n2 = nums[c];
    n3 = nums[right];

    if (n2 === target) {
      return c;
    }
    // 移动左指针
    // 1. 当 target 大于 n2 时
    //     --> 只有当 target 的值比右指针的值(n3) 大, 并且 中间指针(变量c) 的值在右边区域的数组, 才需要移动右指针
    //     --> 其余情况, 都是移动左指针
    // 2. 当  target 小于 n2 时, 与上述情况相反
    //     --> 当 target 的值比左指针的值(n1)小, 并且 中间指针(变量c) 的值在左边区域的数组, 此时移动左指针
    //     --> 其余情况, 都是移动右指针
    else if (
      (target > n2 && !(target > n3 && n2 < n3)) ||
      (target < n2 && target < n1 && n2 > n1)
    ) {
      left = c;
    } else {
      right = c;
    }
  }

  // 处理边界
  if (target === n1) return left;
  if (target === n3) return right;

  return -1;
};
// @lc code=end

/*
// @lcpr case=start
// [4,5,6,7,0,1,2]\n0\n
// @lcpr case=end

// @lcpr case=start
// [4,5,6,7,0,1,2]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1]\n0\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = search;
// @lcpr-after-debug-end
