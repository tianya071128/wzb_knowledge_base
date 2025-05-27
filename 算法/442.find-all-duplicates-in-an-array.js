/*
 * @lc app=leetcode.cn id=442 lang=javascript
 * @lcpr version=30204
 *
 * [442] 数组中重复的数据
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDuplicates = function (nums) {
  /**
   * 难点在于空间复杂度 O(1), 输入输出空间不算 --> 那么就需要复用输入空间
   *
   *  1. 遍历输入数组
   *      1.1 找到该项数字对应的位置
   *            --> 1.2 如果位置对应的数字小于 0, 说明重复
   *            --> 1.3 如果不小于 0, 那么就将其变成负数
   *                      重点在这里, 只是将其变成负数, 这样下次遍历到该该位置时, 只需取绝对值即可获取之前的值
   */
  let ans = [];

  for (const n of nums) {
    const i = Math.abs(n) - 1;
    if (nums[i] < 0) {
      // 重复值
      ans.push(i + 1);
    } else {
      // 将其标记为负数, 表示该位置已经存在数字
      nums[i] *= -1;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [4,3,2,7,8,2,3,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */
