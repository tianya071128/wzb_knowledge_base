/*
 * @lc app=leetcode.cn id=1283 lang=javascript
 * @lcpr version=30204
 *
 * [1283] 使结果不超过阈值的最小除数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} threshold
 * @return {number}
 */
var smallestDivisor = function (nums, threshold) {
  /**
   * 二分搜索:
   *  上边界: MIN(nums)
   *  下边界: MAX(nums)
   */
  let left = 1,
    right = Math.max(...nums);

  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);

    // 在左区间
    if (check(nums, threshold, mid)) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return left;
};
// 检查是否符合条件
var check = function (nums, threshold, n) {
  let total = 0;
  for (const item of nums) {
    total += Math.ceil(item / n);
  }

  return total <= threshold;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=smallestDivisor
// paramTypes= ["number[]","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,2,5,9]\n6\n
// @lcpr case=end

// @lcpr case=start
// [2,3,5,7,11]\n11\n
// @lcpr case=end

// @lcpr case=start
// [19]\n5\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = smallestDivisor;
// @lcpr-after-debug-end
