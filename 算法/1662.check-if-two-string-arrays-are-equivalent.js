/*
 * @lc app=leetcode.cn id=1662 lang=javascript
 * @lcpr version=30204
 *
 * [1662] 检查两个字符串数组是否相等
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} word1
 * @param {string[]} word2
 * @return {boolean}
 */
var arrayStringsAreEqual = function (word1, word2) {
  return word1.join('') === word2.join('');
};
// @lc code=end

/*
// @lcpr case=start
// ["ab", "c"]\n["a", "bc"]\n
// @lcpr case=end

// @lcpr case=start
// ["a", "cb"]\n["ab", "c"]\n
// @lcpr case=end

// @lcpr case=start
// ["abc", "d", "defg"]\n["abcddefg"]\n
// @lcpr case=end

 */
