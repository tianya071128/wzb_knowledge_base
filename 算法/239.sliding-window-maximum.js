/*
 * @lc app=leetcode.cn id=239 lang=javascript
 * @lcpr version=30204
 *
 * [239] 滑动窗口最大值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
  /**
   * 单调递减栈, 当窗口滑动时:
   *  - 左窗口出列时, 如果出列的是栈中的最大值, 那么就将其栈底删除
   *  - 右窗口入列时, 构建单调递减
   */
  let stack = [],
    ans = [];
  for (let i = 0; i < nums.length; i++) {
    // 右窗口入列
    while (stack.length && nums[i] > stack.at(-1)) {
      stack.pop();
    }
    stack.push(nums[i]);

    // 到达窗口大小时
    if (i >= k - 1) {
      ans.push(stack[0]);

      // 左窗口出列
      if (nums[i + 1 - k] === stack[0]) {
        stack.shift();
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,3,-1,-3,5,3,6,7]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1]\n1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxSlidingWindow;
// @lcpr-after-debug-end