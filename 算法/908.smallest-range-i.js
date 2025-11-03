/*
 * @lc app=leetcode.cn id=908 lang=javascript
 * @lcpr version=30204
 *
 * [908] 最小差值 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var smallestRangeI = function (nums, k) {
  /**
   * 找出最大值和最小值
   *  - 最小值加上 k
   *  - 最大值减去 k
   *  - 结果为: Math.max(0, 差值)
   */
  return Math.max(0, Math.max(...nums) - k - (Math.min(...nums) + k));
};
// @lc code=end

/*
// @lcpr case=start
// [1]\n0\n
// @lcpr case=end

// @lcpr case=start
// [0,10]\n2\n
// @lcpr case=end

// @lcpr case=start
// [1,3,6]\n3\n
// @lcpr case=end

 */
