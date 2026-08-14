/*
 * @lc app=leetcode.cn id=1614 lang=javascript
 * @lcpr version=30204
 *
 * [1614] 括号的最大嵌套深度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var maxDepth = function (s) {
  /** @type {number} 层级 */
  let level = 0,
    /** @type {number} 层级 */
    ans = 0;

  for (const item of s) {
    if (item === '(') {
      ans = Math.max(ans, ++level);
    } else if (item === ')') {
      level--;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "(1+(2*3)+((8)/4))+1"\n
// @lcpr case=end

// @lcpr case=start
// "(1)+((2))+(((3)))"\n
// @lcpr case=end

// @lcpr case=start
// "()(())((()()))"\n
// @lcpr case=end

 */
