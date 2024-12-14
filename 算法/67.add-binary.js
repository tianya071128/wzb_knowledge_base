/*
 * @lc app=leetcode.cn id=67 lang=javascript
 * @lcpr version=30204
 *
 * [67] 二进制求和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function (a, b) {
  let len = Math.max(a.length, b.length),
    res = '',
    carry = 0, // 进位
    current = 0; // 当前位
  for (let i = 0; i < len; i++) {
    current =
      Number(a[a.length - 1 - i] ?? 0) +
      Number(b[b.length - 1 - i] ?? 0) +
      carry;
    if (current >= 2) {
      carry = 1;
      current -= 2;
    } else {
      carry = 0;
    }
    res = String(current) + res;
  }

  if (carry) res = '1' + res;

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// "11"\n"1"\n
// @lcpr case=end

// @lcpr case=start
// "1010"\n"1011"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = addBinary;
// @lcpr-after-debug-end
