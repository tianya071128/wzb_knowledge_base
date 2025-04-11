/*
 * @lc app=leetcode.cn id=319 lang=javascript
 * @lcpr version=30204
 *
 * [319] 灯泡开关
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var bulbSwitch = function (n) {
  /**
   * 观察规律可知
   *  最后会亮起的是 1 ** 2、2 ** 2、3 ** 2 ...
   *
   *  以 36 举例:
   *    在 n 为 1 的时候是
   *    36 可以分解为 2 * 8    --> 所以在 2 的时候会切换一次，8 的时候会切换一次，会被抵消
   *    36 还可以分解为 4 * 9  --> 同样的道理, 会被抵消
   *
   *    当为不同数字
   *    36 还会在 6 * 6 --> 这里只会切换一次, 从 开启 状态切换为 关闭
   *    36 还会在 36 * 1 --> 这里只会切换一次, 从 关闭 状态切换为 开启
   */

  return Math.floor(Math.sqrt(n));

  /** 暴力法会超时 */
  // if (n === 0) return 0;
  // /** 暴力求解试试 */
  // let ans = Array(n).fill(true),
  //   cur = 2;
  // while (cur <= n) {
  //   let switchCur = cur,
  //     exponent = 1;
  //   while (switchCur <= ans.length) {
  //     ans[switchCur - 1] = !ans[switchCur - 1];
  //     exponent++;
  //     switchCur = cur * exponent;
  //   }
  //   cur++;
  // }
  // return ans.filter((item) => item).length;
};
// @lc code=end

/*
// @lcpr case=start
// 9\n
// @lcpr case=end

// @lcpr case=start
// 10\n
// @lcpr case=end

// @lcpr case=start
// 1000000000\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = bulbSwitch;
// @lcpr-after-debug-end
