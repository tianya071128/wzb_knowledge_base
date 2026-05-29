/*
 * @lc app=leetcode.cn id=1455 lang=javascript
 * @lcpr version=30204
 *
 * [1455] 检查单词是否为句中其他单词的前缀
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} sentence
 * @param {string} searchWord
 * @return {number}
 */
var isPrefixOfWord = function (sentence, searchWord) {
  let arr = sentence.split(' ');

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].startsWith(searchWord)) return i + 1;
  }

  return -1;
};
// @lc code=end

/*
// @lcpr case=start
// "i love eating burger"\n"burg"\n
// @lcpr case=end

// @lcpr case=start
// "this problem is an easy problem"\n"pro"\n
// @lcpr case=end

// @lcpr case=start
// "i am tired"\n"you"\n
// @lcpr case=end

 */
