/*
 * @lc app=leetcode.cn id=946 lang=javascript
 * @lcpr version=30204
 *
 * [946] 验证栈序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} pushed
 * @param {number[]} popped
 * @return {boolean}
 */
var validateStackSequences = function (pushed, popped) {
  /**
   * 模拟
   */
  let stack = [],
    i = 0;

  for (const item of popped) {
    // 模拟入栈
    while (i < pushed.length && stack.at(-1) !== item) {
      stack.push(pushed[i]);
      i++;
    }

    if (stack.at(-1) !== item) {
      return false;
    }

    // 出栈
    stack.pop();
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n[4,5,3,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5]\n[4,3,5,1,2]\n
// @lcpr case=end

 */
