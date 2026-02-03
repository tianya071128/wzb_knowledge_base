/*
 * @lc app=leetcode.cn id=1185 lang=javascript
 * @lcpr version=30204
 *
 * [1185] 一周中的第几天
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @return {string}
 */
var dayOfTheWeek = function (day, month, year) {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][new Date(year, month - 1, day).getDay()];
};
// @lc code=end

/*
// @lcpr case=start
// 31\n8\n2019\n
// @lcpr case=end

// @lcpr case=start
// 18\n7\n1999\n
// @lcpr case=end

// @lcpr case=start
// 15\n8\n1993\n
// @lcpr case=end

 */
