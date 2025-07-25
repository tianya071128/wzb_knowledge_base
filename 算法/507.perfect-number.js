/*
 * @lc app=leetcode.cn id=507 lang=javascript
 * @lcpr version=30204
 *
 * [507] 完美数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} num
 * @return {boolean}
 */
var checkPerfectNumber = function (num) {
  if (num === 1) return false;

  let ans = 1,
    max = Math.sqrt(num);

  for (let i = 2; i <= max; i++) {
    if (num % i === 0) {
      ans += i === max ? i : i + num / i;
    }
  }

  return num === ans;
};
// @lc code=end

/*
// @lcpr case=start
// 1\n
// @lcpr case=end

// @lcpr case=start
// 7\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = checkPerfectNumber;
// @lcpr-after-debug-end
