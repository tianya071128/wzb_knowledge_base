/*
 * @lc app=leetcode.cn id=1859 lang=javascript
 * @lcpr version=30204
 *
 * [1859] 将句子排序
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var sortSentence = function (s) {
  return s
    .split(' ')
    .sort((a, b) => Number(a[a.length - 1]) - Number(b[b.length - 1]))
    .map((item) => item.slice(0, -1))
    .join(' ');
};
// @lc code=end

/*
// @lcpr case=start
// "is2 sentence4 This1 a3"\n
// @lcpr case=end

// @lcpr case=start
// "Myself2 Me1 I4 and3"\n
// @lcpr case=end

 */
