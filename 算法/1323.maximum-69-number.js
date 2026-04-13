/*
 * @lc app=leetcode.cn id=1323 lang=javascript
 * @lcpr version=30204
 *
 * [1323] 6 和 9 组成的最大数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} num
 * @return {number}
 */
var maximum69Number = function (num) {
  /**
   * 贪心: 将第一位 6 转为 9
   */
  let ans = '',
    flag = false;
  for (const n of String(num)) {
    if (!flag && n === '6') {
      ans += '9';
      flag = true;
    } else {
      ans += n;
    }
  }

  return Number(ans);
};
// @lc code=end

/*
// @lcpr case=start
// 9669\n
// @lcpr case=end

// @lcpr case=start
// 9996\n
// @lcpr case=end

// @lcpr case=start
// 9999\n
// @lcpr case=end

 */
