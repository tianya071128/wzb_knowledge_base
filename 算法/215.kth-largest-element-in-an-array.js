/*
 * @lc app=leetcode.cn id=215 lang=javascript
 * @lcpr version=30204
 *
 * [215] 数组中的第K个最大元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  /**
   * 题目描述: 应该是返回排序后倒数第 k 个元素
   *
   *  - 使用快速排序, 但是可以进行改动一下
   *      - 当基数索引正好是目标索引时, 直接返回
   *      - 当目标索引小于基数索引时, 只需执行左边区间, 忽略右边区间
   *      - 当目标索引大于基数索引时, 只需执行左边区间, 忽略右边区间
   */

  const target = nums.length - k;
  function temp(left, right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
  }
  function quickselect(left, right) {
    if (left >= right) return;

    let base = nums[left],
      i = left,
      j = right;

    while (i < j) {
      // 移动右指针, 找到一个比基数base小的值
      while (nums[j] >= base && j > i) {
        j--;
      }
      // 移动左指针, 找到一个比基数base大的值
      while (nums[i] <= base && j > i) {
        i++;
      }

      // 交互位置
      temp(i, j);
    }

    // 交互与基数的位置
    temp(i, left);

    // 递归右区间
    if (target > i) {
      quickselect(i + 1, right);
    }
    // 递归左区间
    else if (target < i) {
      quickselect(left, i - 1);
    }
  }

  quickselect(0, nums.length - 1);

  return nums[target];
};
// @lc code=end

/*
// @lcpr case=start
// [3,2,1,5,6,4]\n2\n
// @lcpr case=end

// @lcpr case=start
// [7,6,5,4,3,2,1]\n2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findKthLargest;
// @lcpr-after-debug-end
