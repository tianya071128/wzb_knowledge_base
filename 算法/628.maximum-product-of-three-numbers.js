/*
 * @lc app=leetcode.cn id=628 lang=javascript
 * @lcpr version=30204
 *
 * [628] 三个数的最大乘积
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumProduct = function (nums) {
  /**
   * 1. 排序
   * 2. 有两种可能:
   *     2.1 最后两位为负数 * 开头一位
   *     2.1 开头三位
   */
  nums.sort((a, b) => b - a);

  return Math.max(
    nums[0] * nums[1] * nums[2],
    nums[0] * nums.at(-1) * nums.at(-2)
  );
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [-1,-2,-3,0,0,-25]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maximumProduct;
// @lcpr-after-debug-end
