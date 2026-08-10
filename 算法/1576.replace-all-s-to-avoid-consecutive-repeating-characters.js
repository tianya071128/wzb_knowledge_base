/*
 * @lc app=leetcode.cn id=1576 lang=javascript
 * @lcpr version=30204
 *
 * [1576] 替换所有的问号
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var modifyString = function (s) {
  let ans = '',
    allow = new Array(26)
      .fill(0)
      .map((item, index) => String.fromCharCode(97 + index));

  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '?') {
      ans += s[i];
    } else {
      let l = ans[ans.length - 1],
        r = s[i + 1];

      for (const item of allow) {
        if (item !== l && item !== r) {
          ans += item;
          break;
        }
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "?zs"\n
// @lcpr case=end

// @lcpr case=start
// "ubv?w"\n
// @lcpr case=end

 */
