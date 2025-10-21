/*
 * @lc app=leetcode.cn id=819 lang=javascript
 * @lcpr version=30204
 *
 * [819] 最常见的单词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} paragraph
 * @param {string[]} banned
 * @return {string}
 */
var mostCommonWord = function (paragraph, banned) {
  let words = paragraph.toLocaleLowerCase().split(/[ !?',;.]/),
    wordMap = new Map(),
    bannedMap = new Set(banned),
    ans = '',
    max = 0;

  for (const word of words) {
    if (word && !bannedMap.has(word))
      wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
  }

  for (const [s, n] of wordMap) {
    if (n > max) {
      ans = s;
      max = n;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "Bob hit a ball, the hit BALL flew far after it was hit."\n["hit"]\n
// @lcpr case=end

// @lcpr case=start
// "a."\n[]\n
// @lcpr case=end

 */
