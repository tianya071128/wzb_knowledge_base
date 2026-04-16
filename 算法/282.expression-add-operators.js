/*
 * @lc app=leetcode.cn id=282 lang=javascript
 * @lcpr version=30204
 *
 * [282] 给表达式添加运算符
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} num
 * @param {number} target
 * @return {string[]}
 */
var addOperators = function (num, target) {
  /**
   * 回溯
   */
  let ans = [];
  function dfs(i, str) {
    str += num[i];
    // 终点
    if (i === num.length - 1) {
      // 计算结果, 最快方式就是 eval, 但似乎有作弊的嫌疑...
      let stack = [];

      for (const item of str) {
        stack.push(item);

        // 直接处理掉
        if (stack.at(-2) === '*') {
          stack.push(stack.pop() * (stack.pop(), stack.pop()));
        }
      }

      let total = Number(stack[0]);
      for (let i = 2; i < stack.length; i += 2) {
        total += stack[i] * (stack[i - 1] === '+' ? 1 : -1);
      }

      if (total === target) ans.push(str);

      return;
    }

    // 拼接
    for (const item of ['+', '-', '*']) {
      dfs(i + 1, str + item);
    }
  }
  dfs(0, '');

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "123"\n6\n
// @lcpr case=end

// @lcpr case=start
// "232"\n8\n
// @lcpr case=end

// @lcpr case=start
// "3456237490"\n9191\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = addOperators;
// @lcpr-after-debug-end
