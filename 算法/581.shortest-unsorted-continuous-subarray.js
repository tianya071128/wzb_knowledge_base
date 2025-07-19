/*
 * @lc app=leetcode.cn id=581 lang=javascript
 * @lcpr version=30204
 *
 * [581] 最短无序连续子数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 *  使用了 三次 循环，而且空间复杂度比较高
 *
 *  优化：
 *    1. 右边界 --> 从左到右循环，记录最大值为 max，若 nums[i] < max, 则表明位置 i 需要调整, 完整循环结束，记录需要调整的最大位置 i 为右边界;
 *    2. 左边界 --> 同理，从右到左循环，记录最小值为 min, 若 nums[i] > min, 则表明位置 i 需要调整，循环结束，记录需要调整的最小位置 i 为左边界.
 *    3. 两次循环合并为一次处理
 *
 * @param {number[]} nums
 * @return {number}
 */
var findUnsortedSubarray = function (nums) {
  /**
   * 1. 从右往左迭代, 遍历到某一项时, 找出遍历过的最小值  -->  可以确定左边界
   * 2. 从左往右迭代, 遍历到某一项时, 找出遍历过的最大值  -->  可以确定右边界
   *
   * 3. 从左往右迭代, 确定左边界
   * 4. 从右往左迭代, 确定右边界
   */
  let maxList = new Array(nums.length).fill(0),
    minList = new Array(nums.length).fill(0),
    max = -Infinity, // 遍历过程中的最大值
    min = Infinity; // 遍历过程中的最小值
  for (let i = 0; i < nums.length; i++) {
    max = Math.max(max, nums[i]);
    min = Math.min(min, nums[nums.length - 1 - i]);

    maxList[i] = max;
    minList[nums.length - 1 - i] = min;
  }

  // 确定左边界
  let left = nums.length;
  for (let i = 0; i < nums.length; i++) {
    if (minList[i] !== nums[i]) {
      left = i;
      break;
    }
  }

  if (left === nums.length) return 0;

  // 确定右边界
  let right = nums.length;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (maxList[i] !== nums[i]) {
      right = i;
      break;
    }
  }

  return right - left + 1;
};
// @lc code=end

/*
// @lcpr case=start
// [2,6,4,8,10,9,15]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findUnsortedSubarray;
// @lcpr-after-debug-end
