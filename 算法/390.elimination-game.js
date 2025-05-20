/*
 * @lc app=leetcode.cn id=390 lang=javascript
 * @lcpr version=30204
 *
 * [390] 消除游戏
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var lastRemaining = function (n) {
  let cur = 1, // 当前第一个数
    diff = 1, // 两个数之间的取值
    direction = false; // 方向 false 右 | true 左

  while (n > 1) {
    /**
     * 在如下两种情况下, cur 指针需要右移
     *  1. 方向为右
     *  2. 方向为左, 并且 n 为奇数 n % 2 === 1
     */
    if (!direction || n % 2 === 1) {
      cur += diff;
    }

    diff *= 2;
    direction = !direction;
    n = Math.floor(n / 2);
  }
  return cur;

  /**
   * 暴力 - 超时
   */
  // let arr = Array(n)
  //     .fill(0)
  //     .map((item, n) => n + 1),
  //   direction = false;
  // while (arr.length > 1) {
  //   arr = arr.filter((item, index) =>
  //     direction ? index % 2 === 0 : index % 2 === 1
  //   );

  //   direction = !direction;
  // }

  // return arr[0];
};
// @lc code=end

/*
// @lcpr case=start
// 1000000000\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = lastRemaining;
// @lcpr-after-debug-end
