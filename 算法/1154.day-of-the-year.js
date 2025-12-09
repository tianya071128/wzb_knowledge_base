/*
 * @lc app=leetcode.cn id=1154 lang=javascript
 * @lcpr version=30204
 *
 * [1154] 一年中的第几天
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} date
 * @return {number}
 */
var dayOfYear = function (date) {
  let arr = date.split('-'),
    year = Number(arr[0]),
    leapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0,
    mPrefixSum = leapYear
      ? [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
      : [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

  return mPrefixSum[Number(arr[1]) - 1] + Number(arr[2]);
};
// @lc code=end

/*
// @lcpr case=start
// "2000-04-09"\n
// @lcpr case=end

// @lcpr case=start
// "2019-02-10"\n
// @lcpr case=end

 */
