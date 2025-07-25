/*
 * @lc app=leetcode.cn id=541 lang=javascript
 * @lcpr version=30204
 *
 * [541] 反转字符串 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var reverseStr = function (s, k) {
  if (k === 1 || s.length === 1) return s;

  let p = 0,
    ans = '';
  while (p < s.length) {
    // 反转 k 个字符
    for (let i = Math.min(s.length - 1, p + k - 1); i >= p; i--) {
      ans += s[i];
    }

    p += k;

    // 不反转 k 个字符
    for (let i = p; i < Math.min(s.length, p + k); i++) {
      ans += s[i];
    }

    p += k;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "abcdefg"\n2\n
// @lcpr case=end

// @lcpr case=start
// "abcd"\n2\n
// @lcpr case=end

 */
