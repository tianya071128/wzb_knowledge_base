/*
 * @lc app=leetcode.cn id=1967 lang=javascript
 * @lcpr version=30204
 *
 * [1967] 作为子字符串出现在单词中的字符串数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} patterns
 * @param {string} word
 * @return {number}
 */
var numOfStrings = function (patterns, word) {
  /** @type {number} 结果 */
  let ans = 0;

  /**
   * @param {string} pattern
   * @return {number}
   */
  function helper(pattern) {
    other: for (let i = 0; i < word.length - pattern.length + 1; i++) {
      for (let j = 0; j < pattern.length; j++) {
        if (pattern[j] !== word[i + j]) continue other;
      }

      return true;
    }

    return false;
  }

  for (const pattern of patterns) {
    if (helper(pattern)) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["a","abc","bc","d"]\n"abc"\n
// @lcpr case=end

// @lcpr case=start
// ["a","b","c"]\n"aaaaabbbbb"\n
// @lcpr case=end

// @lcpr case=start
// ["a","a","a"]\n"ab"\n
// @lcpr case=end

 */
