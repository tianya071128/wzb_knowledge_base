/*
 * @lc app=leetcode.cn id=1003 lang=javascript
 * @lcpr version=30204
 *
 * [1003] 检查替换后的词是否有效
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  /**
   * 栈: 当连接三个组合起来为 abc 时, 执行出栈
   */
  let stack = [];
  for (const item of s) {
    if (item === 'c' && stack.at(-1) === 'b' && stack.at(-2) === 'a') {
      // 出栈
      stack.pop();
      stack.pop();
    } else {
      // 入栈
      stack.push(item);
    }
  }

  return !stack.length;
};
// @lc code=end

/*
// @lcpr case=start
// "aabcbc"\n
// @lcpr case=end

// @lcpr case=start
// "abcabcababcc"\n
// @lcpr case=end

// @lcpr case=start
// "abccba"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isValid;
// @lcpr-after-debug-end
