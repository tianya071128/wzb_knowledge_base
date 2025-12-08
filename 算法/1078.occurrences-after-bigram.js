/*
 * @lc app=leetcode.cn id=1078 lang=javascript
 * @lcpr version=30204
 *
 * [1078] Bigram 分词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} text
 * @param {string} first
 * @param {string} second
 * @return {string[]}
 */
var findOcurrences = function (text, first, second) {
  let arr = text.split(' '),
    ans = [];

  for (let i = 0; i < arr.length - 2; i++) {
    if (arr[i] === first && arr[i + 1] === second) ans.push(arr[i + 2]);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "alice is a good girl she is a good student"\n"a"\n"good"\n
// @lcpr case=end

// @lcpr case=start
// "we will we will rock you"\n"we"\n"will"\n
// @lcpr case=end

 */
