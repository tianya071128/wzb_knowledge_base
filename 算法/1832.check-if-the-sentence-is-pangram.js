/*
 * @lc app=leetcode.cn id=1832 lang=javascript
 * @lcpr version=30204
 *
 * [1832] 判断句子是否为全字母句
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} sentence
 * @return {boolean}
 */
var checkIfPangram = function (sentence) {
  /** @type {Set<string>} 使用 Hash 存储字符 */
  let h = new Set();

  for (const s of sentence) {
    h.add(s);

    if (h.size === 26) return true;
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// "thequickbrownfoxjumpsoverthelazydog"\n
// @lcpr case=end

// @lcpr case=start
// "leetcode"\n
// @lcpr case=end

 */
