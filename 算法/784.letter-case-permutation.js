/*
 * @lc app=leetcode.cn id=784 lang=javascript
 * @lcpr version=30204
 *
 * [784] 字母大小写全排列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string[]}
 */
var letterCasePermutation = function (s) {
  /**
   * 回溯
   */
  function dfs(start, str) {
    // 到终点
    if (start >= s.length) {
      return [str];
    }

    // 如果是数字, 继续下一个
    if (s[start].charCodeAt() >= 48 && s[start].charCodeAt() <= 57) {
      return dfs(start + 1, str + s[start]);
    }

    // 其他情况, 分为两种情况
    return [
      ...dfs(start + 1, str + s[start].toLocaleLowerCase()),
      ...dfs(start + 1, str + s[start].toLocaleUpperCase()),
    ];
  }

  return dfs(0, '');
};
// @lc code=end

/*
// @lcpr case=start
// "a1b2"\n
// @lcpr case=end

// @lcpr case=start
// "3z4"\n
// @lcpr case=end

 */
