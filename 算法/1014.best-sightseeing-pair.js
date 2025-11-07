/*
 * @lc app=leetcode.cn id=1014 lang=javascript
 * @lcpr version=30204
 *
 * [1014] 最佳观光组合
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} values
 * @return {number}
 */
var maxScoreSightseeingPair = function (values) {
  /**
   * 维护一个指针 prevMax, 表示之前的数中的最大值
   * 只要往右移动指针时, 指针的数就需要减一, 并且与当前项取最大项
   * --> 如此就可以表示之前的数哪个作为权重最大的值
   */
  let prevMax = values[0],
    ans = -Infinity;

  for (let i = 1; i < values.length; i++) {
    prevMax--;
    ans = Math.max(values[i] + prevMax, ans);
    prevMax = Math.max(prevMax, values[i]);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [8,1,5,2,6]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxScoreSightseeingPair;
// @lcpr-after-debug-end
