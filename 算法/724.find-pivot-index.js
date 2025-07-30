/*
 * @lc app=leetcode.cn id=724 lang=javascript
 * @lcpr version=30204
 *
 * [724] 寻找数组的中心下标
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function (nums) {
  /**
   * 前缀和
   *  - 计算出数组的前缀和
   *  - 遍历数组, 计算元素前后的总和是否相同
   */
  let prefixSum = [nums[0]];
  for (let i = 1; i < nums.length; i++) {
    prefixSum[i] = prefixSum.at(-1) + nums[i];
  }

  for (let i = 0; i < nums.length; i++) {
    if (prefixSum.at(-1) - prefixSum[i] === (prefixSum[i - 1] ?? 0)) return i;
  }

  return -1;
};
// @lc code=end

/*
// @lcpr case=start
// [1, 7, 3, 6, 5, 6]\n
// @lcpr case=end

// @lcpr case=start
// [1, 2, 3]\n
// @lcpr case=end

// @lcpr case=start
// [2, 1, -1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = pivotIndex;
// @lcpr-after-debug-end
