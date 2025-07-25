/*
 * @lc app=leetcode.cn id=504 lang=javascript
 * @lcpr version=30204
 *
 * [504] 七进制数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} num
 * @return {string}
 */
var convertToBase7 = function (num) {
  /**
   * 进制转换
   */
  if (num === 0) return '0';

  let ans = '',
    flag = num > 0;
  num = Math.abs(num);

  while (num > 0) {
    ans = (num % 7) + ans;

    num = Math.floor(num / 7);
  }

  return flag ? ans : '-' + ans;
};
// @lc code=end

/*
// @lcpr case=start
// 12312\n
// @lcpr case=end

// @lcpr case=start
// -324234\n
// @lcpr case=end

 */
