/*
 * @lc app=leetcode.cn id=1507 lang=javascript
 * @lcpr version=30204
 *
 * [1507] 转变日期格式
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} date
 * @return {string}
 */
var reformatDate = function (date) {
  let arr = date.split(' '),
    ans = arr[2];

  // 处理月份
  let m = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  };
  ans += `-${m[arr[1]]}`;

  // 处理日期
  let d = Number.parseInt(arr[0]);
  ans += `-${d < 10 ? '0' + d : d}`;

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "20th Oct 2052"\n
// @lcpr case=end

// @lcpr case=start
// "6th Jun 1933"\n
// @lcpr case=end

// @lcpr case=start
// "26th May 1960"\n
// @lcpr case=end

 */
