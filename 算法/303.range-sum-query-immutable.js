/*
 * @lc app=leetcode.cn id=303 lang=javascript
 * @lcpr version=30204
 *
 * [303] 区域和检索 - 数组不可变
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 前缀和
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  const prefixSum = [];

  for (const n of nums) {
    prefixSum.push((prefixSum.at(-1) ?? 0) + n);
  }

  this.prefixSum = prefixSum;
  this.nums = nums;
};

/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
NumArray.prototype.sumRange = function (left, right) {
  return this.prefixSum[right] - this.prefixSum[left] + this.nums[left];
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * var param_1 = obj.sumRange(left,right)
 */
// @lc code=end

/*
// @lcpr case=start
// ["NumArray", "sumRange", "sumRange", "sumRange"][[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]]\n
// @lcpr case=end

 */
