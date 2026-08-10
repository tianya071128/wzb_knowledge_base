/*
 * @lc app=leetcode.cn id=1592 lang=javascript
 * @lcpr version=30204
 *
 * [1592] 重新排列单词间的空格
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} text
 * @return {string}
 */
var reorderSpaces = function (text) {
  /** @type {number} 空格个数 */
  let sum = 0,
    /** @type {string[]} 单词 */
    words = [];

  for (let i = 0; i < text.length; i++) {
    const s = text[i];

    if (s === ' ') {
      sum++;
    } else {
      // 单词边界
      if (!text[i - 1] || text[i - 1] === ' ') {
        words.push('');
      }
      words[words.length - 1] += s;
    }
  }

  if (words.length <= 1) {
    return `${words[0] ?? ''}${' '.repeat(sum)}`;
  }

  return (
    words.join(' '.repeat(Math.floor(sum / (words.length - 1)))) +
    ' '.repeat(sum % (words.length - 1))
  );
};
// @lc code=end

/*
// @lcpr case=start
// "  this   is  a sentence "\n
// @lcpr case=end

// @lcpr case=start
// " practice   makes   perfect"\n
// @lcpr case=end

// @lcpr case=start
// "hello   world"\n
// @lcpr case=end

// @lcpr case=start
// "  walks  udp package   into  bar a"\n
// @lcpr case=end

// @lcpr case=start
// "    a    "\n
// @lcpr case=end

 */
