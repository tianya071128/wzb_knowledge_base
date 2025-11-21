/*
 * @lc app=leetcode.cn id=942 lang=javascript
 * @lcpr version=30204
 *
 * [942] 增减字符串匹配
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number[]}
 */
var diStringMatch = function (s) {
  /**
   * 找到最大值和最小值, 从最大值和最小值开始填充
   *  - 碰到 I, 填充为最小值
   *  - 碰到 D, 填充为最大值
   */
  let ans = [],
    max = s.length,
    min = 0;

  for (const item of s) {
    if (item === 'I') {
      ans.push(min);
      min++;
    } else {
      ans.push(max);
      max--;
    }
  }

  ans.push(max);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "IDIDIDIDIDIDIDIDIDIDIDIDIDID"\n
// @lcpr case=end

// @lcpr case=start
// "III"\n
// @lcpr case=end

// @lcpr case=start
// "DDI"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = diStringMatch;
// @lcpr-after-debug-end
