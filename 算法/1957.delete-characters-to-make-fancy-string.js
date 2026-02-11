/*
 * @lc app=leetcode.cn id=1957 lang=javascript
 * @lcpr version=30204
 *
 * [1957] 删除字符使字符串变好
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var makeFancyString = function (s) {
  let ans = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === s[i + 1] && s[i] === s[i + 2]) continue;
    ans += s[i];
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "leeetcode"\n
// @lcpr case=end

// @lcpr case=start
// "aaabaaaa"\n
// @lcpr case=end

// @lcpr case=start
// "aab"\n
// @lcpr case=end

 */
