/*
 * @lc app=leetcode.cn id=50 lang=javascript
 * @lcpr version=30204
 *
 * [50] Pow(x, n)
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function (x, n) {
  // 递归
  if (n === 0) return 1;

  if (n === 1) return x;

  let abs = Math.abs(n);
  let res = myPow(x * x, Math.floor(abs / 2)) * (abs % 2 === 1 ? x : 1);

  return n > 0 ? res : 1 / res;
};
// @lc code=end

/*
// @lcpr case=start
// 2.00000\n10\n
// @lcpr case=end

// @lcpr case=start
// 2.10000\n3\n
// @lcpr case=end

// @lcpr case=start
// 2.00000\n-2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = myPow;
// @lcpr-after-debug-end
