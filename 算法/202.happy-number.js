/*
 * @lc app=leetcode.cn id=202 lang=javascript
 * @lcpr version=30204
 *
 * [202] 快乐数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function (n) {
  // 最终都会规整为 10 以下的值
  while (n >= 10) {
    let ans = 0;
    while (n > 0) {
      const cur = n % 10;
      ans += cur ** 2;

      n = Math.floor(n / 10);
    }

    n = ans;
  }

  return n === 1 || n === 7;
};
// @lc code=end

/*
// @lcpr case=start
// 1915423421\n
// @lcpr case=end

// @lcpr case=start
// 2\n
// @lcpr case=end

 */
