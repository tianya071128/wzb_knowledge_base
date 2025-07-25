/*
 * @lc app=leetcode.cn id=561 lang=javascript
 * @lcpr version=30204
 *
 * [561] 数组拆分
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var arrayPairSum = function (nums) {
  /**
   * [6,2,6,5,1,2]
   *
   *  如果两两分组, 选择最小的数, 那么另一个数就会被抛弃。
   *  此时另一个数应该越小越好
   *
   *  所以排序后的值两两分组即可
   */
  return nums
    .sort((a, b) => a - b)
    .reduce((total, item, index) => total + (index % 2 === 0 ? item : 0));
};
// @lc code=end

/*
// @lcpr case=start
// [1,4,3,2]\n
// @lcpr case=end

// @lcpr case=start
// [6,2,6,5,1,2]\n
// @lcpr case=end

 */
