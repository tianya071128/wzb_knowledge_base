/*
 * @lc app=leetcode.cn id=1704 lang=javascript
 * @lcpr version=30204
 *
 * [1704] 判断字符串的两半是否相似
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var halvesAreAlike = function (s) {
  /** @type {Set<string>} 元音 */
  let hash = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']),
    /** @type {number} 左边元音的个数 */
    l = 0,
    /** @type {number} 右边元音的个数 */
    r = 0;

  for (let i = 0, j = s.length - 1; i < s.length / 2; i++, j--) {
    if (hash.has(s[i])) l++;
    if (hash.has(s[j])) r++;
  }

  return l === r;
};
// @lc code=end

/*
// @lcpr case=start
// "book"\n
// @lcpr case=end

// @lcpr case=start
// "textbook"\n
// @lcpr case=end

 */
