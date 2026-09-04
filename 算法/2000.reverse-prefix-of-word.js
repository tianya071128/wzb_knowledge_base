/*
 * @lc app=leetcode.cn id=2000 lang=javascript
 * @lcpr version=30204
 *
 * [2000] 反转单词前缀
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} word
 * @param {character} ch
 * @return {string}
 */
var reversePrefix = function (word, ch) {
  /** @type {number} ch 在 word 的索引 */
  let p = -1,
    /** @type {string} 结果 */
    ans = '';

  for (let i = 0; i < word.length; i++) {
    if (word[i] === ch) {
      p = i;
      break;
    }
  }

  if (p === -1) return word;

  for (let i = 0; i < word.length; i++) {
    if (i <= p) {
      ans = word[i] + ans;
    } else {
      ans += word[i];
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "abcdefd"\n'd'\n
// @lcpr case=end

// @lcpr case=start
// "xyxzxe"\n'z'\n
// @lcpr case=end

// @lcpr case=start
// "abcd"\n'z'\n
// @lcpr case=end

 */
