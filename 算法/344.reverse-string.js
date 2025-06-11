/*
 * @lc app=leetcode.cn id=344 lang=javascript
 * @lcpr version=30204
 *
 * [344] 反转字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function (s) {
  let i = 0,
    mid = Math.floor(s.length / 2) - 1;

  while (i <= mid) {
    [s[i], s[s.length - 1 - i]] = [s[s.length - 1 - i], s[i]];
    i++;
  }
};
// @lc code=end

/*
// @lcpr case=start
// ["h","e"]\n
// @lcpr case=end

// @lcpr case=start
// ["H","a","n","n","a","h"]\n
// @lcpr case=end

 */
