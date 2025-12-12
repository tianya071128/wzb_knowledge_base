/*
 * @lc app=leetcode.cn id=1360 lang=javascript
 * @lcpr version=30204
 *
 * [1360] 日期之间隔几天
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} date1
 * @param {string} date2
 * @return {number}
 */
var daysBetweenDates = function (date1, date2) {
  return Math.floor(
    Math.abs(new Date(date1).getTime() - new Date(date2).getTime()) /
      (24 * 60 * 60 * 1000)
  );
};
// @lc code=end

/*
// @lcpr case=start
// "2019-06-29"\n"2019-06-30"\n
// @lcpr case=end

// @lcpr case=start
// "2020-01-15"\n"2019-12-31"\n
// @lcpr case=end

 */
