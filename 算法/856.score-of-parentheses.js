/*
 * @lc app=leetcode.cn id=856 lang=javascript
 * @lcpr version=30204
 *
 * [856] 括号的分数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var scoreOfParentheses = function (s) {
  /**
   * 栈
   *  1. 栈1: 存储括号对
   *  2. 栈2: 存储得分, 当碰到 ( 时, 往得分栈中添加0标识
   */
  let stack1 = [],
    stack2 = [];

  for (const item of s) {
    // 入栈
    if (item === '(') {
      stack1.push('(');
      stack2.push(0);
    }
    // 出栈
    else {
      stack1.pop();

      let total = 0,
        cur = 0;
      while ((cur = stack2.pop())) {
        total += cur;
      }

      // 再将该次得分入栈
      stack2.push(Math.max(1, total * 2));
    }
  }

  return stack2.reduce((total, item) => item + total);
};
// @lc code=end

/*
// @lcpr case=start
// "()"\n
// @lcpr case=end

// @lcpr case=start
// "(()(((()(())))(())(())))"\n
// @lcpr case=end

// @lcpr case=start
// "()()"\n
// @lcpr case=end

// @lcpr case=start
// "(()(()))"\n
// @lcpr case=end

 */
