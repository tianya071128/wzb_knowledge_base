/*
 * @lc app=leetcode.cn id=1784 lang=javascript
 * @lcpr version=30204
 *
 * [1784] 检查二进制字符串字段
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var checkOnesSegment = function (s) {
  /** @type {number} 次数  */
  let ans = 0;

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '1' && s[i - 1] !== '1') {
      if (++ans > 1) return false;
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// "1001"\n
// @lcpr case=end

// @lcpr case=start
// "110"\n
// @lcpr case=end

 */
