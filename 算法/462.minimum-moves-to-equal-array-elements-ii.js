/*
 * @lc app=leetcode.cn id=462 lang=javascript
 * @lcpr version=30204
 *
 * [462] 最小操作次数使数组元素相等 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var minMoves2 = function (nums) {
  /**
   * 正确的
   *
   *  1. 应该是中位数 --> 中位数可以先排序, 取到中间的数即可
   *
   *  2. 排序后，双指针, 从左右两边 --> 只要选择的相等数x ∈ [nums[i], nums[j]]，对于左右指针所指向的数，其操作数是固定的。即，nums[j] - nums[i]，指针所指向数的差值；
   *
   *
   * 本质上两个都是同一原理: 对于任一两个数, 例如 5 和 10，只要选择的数在这两者之间，他们的操作数都是相同的，所以要取到中位数
   */
  /**
   * 错误的
   * 求出平均数 --> 平均数需要四舍五入
   * 计算出每项与平均数的差值
   */
  // const average = Math.round(
  //   nums.reduce((total, item) => total + item, 0) / nums.length
  // );
  // return nums.reduce((total, item) => total + Math.abs(average - item), 0);
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,1,8,6]\n
// @lcpr case=end

// @lcpr case=start
// [1,10,2,9]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minMoves2;
// @lcpr-after-debug-end
