/*
 * @lc app=leetcode.cn id=1556 lang=javascript
 * @lcpr version=30204
 *
 * [1556] 千位分隔数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {string}
 */
var thousandSeparator = function (n) {
  if (n === 0) return '0';

  let i = 3,
    ans = '';
  while (n > 0) {
    let cur = n % 10;
    n = Math.floor(n / 10);

    if (i === 0) {
      ans = '.' + ans;
      i = 3;
    }

    i--;
    ans = cur + ans;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 987\n
// @lcpr case=end

// @lcpr case=start
// 1234\n
// @lcpr case=end

// @lcpr case=start
// 123456789\n
// @lcpr case=end

// @lcpr case=start
// 0\n
// @lcpr case=end

 */
