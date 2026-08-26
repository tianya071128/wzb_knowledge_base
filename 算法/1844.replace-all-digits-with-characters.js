/*
 * @lc app=leetcode.cn id=1844 lang=javascript
 * @lcpr version=30204
 *
 * [1844] 将所有数字用字符替换
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var replaceDigits = function (s) {
  /** @type {string} 结果 */
  let ans = '';

  for (let i = 0; i < s.length; i++) {
    if (i % 2 === 1) {
      ans += String.fromCharCode(
        ans[ans.length - 1].charCodeAt() + Number(s[i])
      );
    } else {
      ans += s[i];
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "a1c1e1"\n
// @lcpr case=end

// @lcpr case=start
// "a1b2c3d4e"\n
// @lcpr case=end

 */
