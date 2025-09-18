/*
 * @lc app=leetcode.cn id=890 lang=javascript
 * @lcpr version=30204
 *
 * [890] 查找和替换模式
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @param {string} pattern
 * @return {string[]}
 */
var findAndReplacePattern = function (words, pattern) {
  /**
   * 哈希表 --> 双向映射
   */
  let ans = [];

  other: for (const word of words) {
    let wordHashPattern = new Map(),
      patternHashWord = new Map();
    for (let i = 0; i < word.length; i++) {
      // 如果 word --> pattern 存在映射, 则比较映射字母是否相同
      if (
        wordHashPattern.has(word[i]) &&
        wordHashPattern.get(word[i]) !== pattern[i]
      ) {
        continue other;
      }
      // 如果 word --> pattern 不存在映射, 但是 pattern --> word 存在映射
      else if (
        !wordHashPattern.has(word[i]) &&
        patternHashWord.has(pattern[i])
      ) {
        continue other;
      }
      // 增加映射关系
      else {
        wordHashPattern.set(word[i], pattern[i]);
        patternHashWord.set(pattern[i], word[i]);
      }
    }

    ans.push(word);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["abc","deq","mee","aqq","dkd","ccc"]\n"abb"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findAndReplacePattern;
// @lcpr-after-debug-end
