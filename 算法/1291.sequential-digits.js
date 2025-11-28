/*
 * @lc app=leetcode.cn id=1291 lang=javascript
 * @lcpr version=30204
 *
 * [1291] 顺次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} low
 * @param {number} high
 * @return {number[]}
 */
var sequentialDigits = function (low, high) {
  /**
   * 滑动窗口:
   *  窗口的最小数量为 Math.ceil(Math.log10(low))
   *  窗口的最大数量为 Math.ceil(Math.log10(high))
   */
  let l = Math.log10(low),
    r = Math.log10(high),
    s = '123456789',
    ans = [];

  // 如果正好是整数的话, 想上取整
  l = Number.isInteger(l) ? l + 1 : Math.ceil(l);
  r = Number.isInteger(r) ? r + 1 : Math.ceil(r);

  for (; l <= r; l++) {
    // 区间
    for (let p = 0; p <= s.length - l; p++) {
      let n = Number(s.slice(p, p + l));

      if (n > high) break;

      if (n >= low) ans.push(n);
    }
  }

  return ans;
};
// @lc code=end
