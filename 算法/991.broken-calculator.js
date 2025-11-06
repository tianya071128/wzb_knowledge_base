/*
 * @lc app=leetcode.cn id=991 lang=javascript
 * @lcpr version=30204
 *
 * [991] 坏了的计算器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} startValue
 * @param {number} target
 * @return {number}
 */
var brokenCalc = function (startValue, target) {
  /**
   * 贪心: 逆推
   *  -  当 taget 可以除以2时, 将 taget 除以 2
   *  -  当 taget 小于 startValue 时, 此时只需要通过 startValue - taget 次
   */
  let ans = 0;
  while (target > startValue) {
    // 如果不能整除 2, 则向上添加一下
    if (target % 2 !== 0) {
      target++;
    } else {
      target /= 2;
    }

    ans++;
  }

  return ans + (startValue - target);
};
// @lc code=end

/*
// @lcpr case=start
// 4565424\n453456876\n
// @lcpr case=end

// @lcpr case=start
// 5\n8\n
// @lcpr case=end

// @lcpr case=start
// 3\n10\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = brokenCalc;
// @lcpr-after-debug-end
