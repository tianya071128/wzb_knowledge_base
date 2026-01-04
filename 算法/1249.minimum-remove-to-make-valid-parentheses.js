/*
 * @lc app=leetcode.cn id=1249 lang=javascript
 * @lcpr version=30204
 *
 * [1249] 移除无效的括号
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var minRemoveToMakeValid = function (s) {
  /**
   * 使用栈来记录需要被删除的括号
   */
  let ans = '',
    stack = [],
    indexStack = []; // 索引栈
  for (let i = 0; i < s.length; i++) {
    const item = s[i];

    if (item === '(') {
      stack.push('(');
      indexStack.push(i);
    } else if (item === ')') {
      // 配对成功
      if (stack.at(-1) === '(') {
        stack.pop();
        indexStack.pop();
      } else {
        stack.push(')');
        indexStack.push(i);
      }
    }
  }

  // 组成结果: 不包含 indexStack 位置的字符
  for (let i = 0; i < s.length; i++) {
    if (indexStack[0] === i) {
      indexStack.shift();
    } else {
      ans += s[i];
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "lee(t(c)o)de)"\n
// @lcpr case=end

// @lcpr case=start
// "a)b(c)d"\n
// @lcpr case=end

// @lcpr case=start
// "))(("\n
// @lcpr case=end

 */
