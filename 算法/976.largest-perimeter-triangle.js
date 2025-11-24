/*
 * @lc app=leetcode.cn id=976 lang=javascript
 * @lcpr version=30204
 *
 * [976] 三角形的最大周长
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var largestPerimeter = function (nums) {
  /**
   * 三角形: 任意两条边大于第三条
   *
   *  所以对于三个降序的数字:
   *    10 9 8
   *
   * 只要后面两位数相加大于第一位即可。因为最大的数相加其他任意一个肯定比另一个大
   */
  nums.sort((a, b) => b - a);

  for (let i = 1; i < nums.length - 1; i++) {
    if (nums[i] + nums[i + 1] > nums[i - 1])
      return nums[i - 1] + nums[i] + nums[i + 1];
  }
  return 0;
};
// @lc code=end

/*
// @lcpr case=start
// [2,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,1,10]\n
// @lcpr case=end

 */
