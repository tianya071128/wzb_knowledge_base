/*
 * @lc app=leetcode.cn id=1047 lang=javascript
 * @lcpr version=30204
 *
 * [1047] 删除字符串中的所有相邻重复项
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var removeDuplicates = function (s) {
  // 栈
  let stack = [];
  for (const item of s) {
    if (item === stack.at(-1)) {
      stack.pop();
    } else {
      stack.push(item);
    }
  }

  return stack.join('');
};
// @lc code=end

/*
// @lcpr case=start
// "abbaca"\n
// @lcpr case=end

 */
