/*
 * @lc app=leetcode.cn id=1684 lang=javascript
 * @lcpr version=30204
 *
 * [1684] 统计一致字符串的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} allowed
 * @param {string[]} words
 * @return {number}
 */
var countConsistentStrings = function (allowed, words) {
  /** @type {Set<string>} allowed 中的字符hash */
  let hash = new Set();

  for (const item of allowed) {
    hash.add(item);
  }

  /** @type {number} 结果 */
  let ans = 0;
  other: for (const word of words) {
    for (const item of word) {
      if (!hash.has(item)) continue other;
    }

    ans++;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=countConsistentStrings
// paramTypes= ["string","string[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "ab"\n["ad","bd","aaab","baa","badab"]\n
// @lcpr case=end

// @lcpr case=start
// "abc"\n["a","b","c","ab","ac","bc","abc"]\n
// @lcpr case=end

// @lcpr case=start
// "cad"\n["cc","acd","b","ba","bac","bad","ac","d"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = countConsistentStrings;
// @lcpr-after-debug-end
