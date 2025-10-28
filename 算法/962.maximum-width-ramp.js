/*
 * @lc app=leetcode.cn id=962 lang=javascript
 * @lcpr version=30204
 *
 * [962] 最大宽度坡
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxWidthRamp = function (nums) {
  /**
   * 单调递增栈:
   *  从右往左遍历
   *   - 碰到可以入栈的项直接入栈
   *   - 如果不可入栈的值(没有必要入栈, 说明肯定没有上一个入栈的值的坡度大), 在栈中比较坡度
   */
  let stack = [], // 索引入栈
    ans = 0;
  for (let i = nums.length - 1; i >= 0; i--) {
    // 入栈
    if (!stack.length || nums[i] > nums[stack.at(-1)]) {
      stack.push(i);
    }
    // 比较坡度结果
    else {
      for (let j = stack.length - 1; j >= 0; j--) {
        if (nums[i] <= nums[stack[j]]) {
          ans = Math.max(stack[j] - i, ans);
        } else {
          break;
        }
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [2,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [9,8,1,0,1,9,4,0,4,1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxWidthRamp;
// @lcpr-after-debug-end
