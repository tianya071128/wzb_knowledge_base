/*
 * @lc app=leetcode.cn id=394 lang=javascript
 * @lcpr version=30204
 *
 * [394] 字符串解码
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function (s) {
  /**
   * 递归
   */
  let ans = '',
    cur = 0;
  while (cur < s.length) {
    /** 数字时, 找出 [] 之间的字符 */
    if (s[cur].charCodeAt() >= 48 && s[cur].charCodeAt() <= 57) {
    }
  }
};
// @lc code=end

/*
// @lcpr case=start
// "3[a]2[bc]"\n
// @lcpr case=end

// @lcpr case=start
// "3[a2[c]]"\n
// @lcpr case=end

// @lcpr case=start
// "2[abc]3[cd]ef"\n
// @lcpr case=end

// @lcpr case=start
// "abc3[cd]xyz"\n
// @lcpr case=end

 */
