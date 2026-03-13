/*
 * @lc app=leetcode.cn id=32 lang=javascript
 * @lcpr version=30204
 *
 * [32] 最长有效括号
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function (s) {
  /**
   * 栈: 只要记录下不匹配的括号的索引, 就知道最长有效括号
   */

  /** @type {index[]} */
  let stack = [];

  for (let i = 0; i < s.length; i++) {
    if (s[i] === ')' && s[stack.at(-1)] === '(') {
      // 匹配
      stack.pop();
    } else {
      stack.push(i);
    }
  }

  let ans = 0;
  // 在 stack 头尾增加标识, 方便计算
  stack.unshift(-1);
  stack.push(s.length);

  for (let i = 1; i < stack.length; i++) {
    ans = Math.max(ans, stack[i] - stack[i - 1] - 1);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ")(()((()))())"\n
// @lcpr case=end

// @lcpr case=start
// ")()())"\n
// @lcpr case=end

// @lcpr case=start
// ""\n
// @lcpr case=end

 */
