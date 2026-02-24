/*
 * @lc app=leetcode.cn id=1451 lang=javascript
 * @lcpr version=30204
 *
 * [1451] 重新排列句子中的单词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} text
 * @return {string}
 */
var arrangeWords = function (text) {
  let ans = text
    .toLocaleLowerCase()
    .split(' ')
    .sort((a, b) => a.length - b.length);

  ans[0] = ans[0][0].toLocaleUpperCase() + ans[0].slice(1);

  return ans.join(' ');
};
// @lc code=end

/*
// @lcpr case=start
// "Leetcode is cool"\n
// @lcpr case=end

// @lcpr case=start
// "Keep calm and code on"\n
// @lcpr case=end

// @lcpr case=start
// "To be or not to be"\n
// @lcpr case=end

 */
