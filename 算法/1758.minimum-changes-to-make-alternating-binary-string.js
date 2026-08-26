/*
 * @lc app=leetcode.cn id=1758 lang=javascript
 * @lcpr version=30204
 *
 * [1758] 生成交替二进制字符串的最少操作数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var minOperations = function (s) {
  /** @type {number} 两种可能, 开头字符为 0, 偶数索引为 0 */
  let p1 = 0,
    /** @type {number} 两种可能, 开头字符为 1, 偶数索引为 1 */
    p2 = 0;

  for (let i = 0; i < s.length; i++) {
    let cur = s[i];

    if (i % 2 === 0) {
      if (cur === '0') {
        p2++;
      } else {
        p1++;
      }
    } else {
      if (cur === '0') {
        p1++;
      } else {
        p2++;
      }
    }
  }

  return Math.min(p1, p2);
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=minOperations
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "0100"\n
// @lcpr case=end

// @lcpr case=start
// "10"\n
// @lcpr case=end

// @lcpr case=start
// "1111"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minOperations;
// @lcpr-after-debug-end
