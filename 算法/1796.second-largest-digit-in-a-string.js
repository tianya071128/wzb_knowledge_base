/*
 * @lc app=leetcode.cn id=1796 lang=javascript
 * @lcpr version=30204
 *
 * [1796] 字符串中第二大的数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var secondHighest = function (s) {
  /** @type {number} 最大值 */
  let max = -1,
    /** @type {number} 最二大值 */
    ans = -1;

  for (const item of s) {
    let cur = Number(item);
    if (!Number.isNaN(cur)) {
      if (cur > max) {
        ans = max;
        max = cur;
      } else if (cur < max && cur > ans) {
        ans = cur;
      }
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=secondHighest
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "dfa12321afd"\n
// @lcpr case=end

// @lcpr case=start
// "abc1111"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = secondHighest;
// @lcpr-after-debug-end
