/*
 * @lc app=leetcode.cn id=824 lang=javascript
 * @lcpr version=30204
 *
 * [824] 山羊拉丁文
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} sentence
 * @return {string}
 */
var toGoatLatin = function (sentence) {
  let words = sentence.split(' '),
    map = new Set(['a', 'e', 'i', 'o', 'u']);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // 元音
    if (map.has(word[0].toLocaleLowerCase())) {
      words[i] = `${word}ma${'a'.repeat(i + 1)}`;
    } else {
      words[i] = `${word.slice(1)}${word[0]}ma${'a'.repeat(i + 1)}`;
    }
  }

  return words.join(' ');
};
// @lc code=end

/*
// @lcpr case=start
// "I speak Goat Latin"\n
// @lcpr case=end

// @lcpr case=start
// "The quick brown fox jumped over the lazy dog"\n
// @lcpr case=end

 */
