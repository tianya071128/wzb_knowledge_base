/*
 * @lc app=leetcode.cn id=806 lang=javascript
 * @lcpr version=30204
 *
 * [806] 写字符串需要的行数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} widths
 * @param {string} s
 * @return {number[]}
 */
var numberOfLines = function (widths, s) {
  let line = 1,
    lineW = 0;
  for (const item of s) {
    const curW = widths[item.charCodeAt() - 'a'.charCodeAt()];

    lineW += widths[item.charCodeAt() - 'a'.charCodeAt()];
    // 换行
    if (lineW > 100) {
      line++;
      lineW = curW;
    }
  }

  return [line, lineW];
};
// @lc code=end

/*
// @lcpr case=start
// [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,6]\n"abcdefghijklmnopqrstuvwxyz"\n
// @lcpr case=end

// @lcpr case=start
// [4,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,8]\n"bbbcccdddaaa"\n
// @lcpr case=end

 */
