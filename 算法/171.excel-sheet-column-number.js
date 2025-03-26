/*
 * @lc app=leetcode.cn id=171 lang=javascript
 * @lcpr version=30204
 *
 * [171] Excel 表列序号
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} columnTitle
 * @return {number}
 */
var titleToNumber = function (columnTitle) {
  let base = 0,
    ans = 0;
  for (let i = columnTitle.length - 1; i >= 0; i--) {
    ans += (columnTitle[i].charCodeAt(0) - 64) * 26 ** base;
    base++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "A"\n
// @lcpr case=end

// @lcpr case=start
// "AB"\n
// @lcpr case=end

// @lcpr case=start
// "ZY"\n
// @lcpr case=end

 */
