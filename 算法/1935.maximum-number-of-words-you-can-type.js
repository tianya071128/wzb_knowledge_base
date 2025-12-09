/*
 * @lc app=leetcode.cn id=1935 lang=javascript
 * @lcpr version=30204
 *
 * [1935] 可以输入的最大单词数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} text
 * @param {string} brokenLetters
 * @return {number}
 */
var canBeTypedWords = function (text, brokenLetters) {
  let hash = new Set(brokenLetters.split('')),
    arr = text.split(' '),
    ans = 0;

  for (const str of arr) {
    let flag = true;
    for (let i = 0; i < str.length; i++) {
      if (hash.has(str[i])) {
        flag = false;
        break;
      }
    }

    if (flag) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "hello world"\n"ad"\n
// @lcpr case=end

// @lcpr case=start
// "leet code"\n"lt"\n
// @lcpr case=end

// @lcpr case=start
// "leet code"\n"e"\n
// @lcpr case=end

 */
