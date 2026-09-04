/*
 * @lc app=leetcode.cn id=1961 lang=javascript
 * @lcpr version=30204
 *
 * [1961] 检查字符串是否为数组前缀
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string[]} words
 * @return {boolean}
 */
var isPrefixString = function (s, words) {
  /** @type {number} 指针, 指向 s 的 */
  let p = 0;

  for (const word of words) {
    for (const item of word) {
      if (s[p++] !== item) return false;
    }

    if (p === s.length) return true;
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// "a"\n["aa","aaaa","banana"]\n
// @lcpr case=end

// @lcpr case=start
// "iloveleetcode"\n["apples","i","love","leetcode"]\n
// @lcpr case=end

 */
