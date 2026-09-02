/*
 * @lc app=leetcode.cn id=1880 lang=javascript
 * @lcpr version=30204
 *
 * [1880] 检查某单词是否等于两单词之和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} firstWord
 * @param {string} secondWord
 * @param {string} targetWord
 * @return {boolean}
 */
var isSumEqual = function (firstWord, secondWord, targetWord) {
  return sum(firstWord) + sum(secondWord) === sum(targetWord);
};

/**
 * @param {string} word
 * @return {boolean}
 */
var sum = function (word) {
  let ans = 0;
  for (const s of word) {
    ans = ans * 10 + s.charCodeAt() - 97;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "acb"\n"cba"\n"cdb"\n
// @lcpr case=end

// @lcpr case=start
// "aaa"\n"a"\n"aab"\n
// @lcpr case=end

// @lcpr case=start
// "aaa"\n"a"\n"aaaa"\n
// @lcpr case=end

 */
