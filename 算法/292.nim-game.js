/*
 * @lc app=leetcode.cn id=292 lang=javascript
 * @lcpr version=30204
 *
 * [292] Nim 游戏
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var canWinNim = function (n) {
  /**
   * 1 -> 赢
   * 2 -> 赢
   * 3 -> 赢
   * 4 -> 输
   * 5 -> 赢
   * 6 -> 赢
   * 7 -> 赢
   * 8 -> 输
   * 9 -> 赢
   * 10 -> 赢
   * 11 -> 赢
   * 12 -> 输
   *
   * 观察可知: 4 的倍数即为输
   */
  return n % 4 !== 0;
};
// @lc code=end

/*
// @lcpr case=start
// 4\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

// @lcpr case=start
// 2\n
// @lcpr case=end

 */
