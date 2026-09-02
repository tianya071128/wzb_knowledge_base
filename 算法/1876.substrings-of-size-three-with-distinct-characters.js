/*
 * @lc app=leetcode.cn id=1876 lang=javascript
 * @lcpr version=30204
 *
 * [1876] 长度为三且各字符不同的子字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var countGoodSubstrings = function (s) {
  /** @type {number} 结果 */
  let ans = 0;

  for (let i = 2; i < s.length; i++) {
    if (s[i] !== s[i - 1] && s[i] !== s[i - 2] && s[i - 1] !== s[i - 2]) ans++;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=countGoodSubstrings
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "xyzzaz"\n
// @lcpr case=end

// @lcpr case=start
// "aababcabc"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = countGoodSubstrings;
// @lcpr-after-debug-end
