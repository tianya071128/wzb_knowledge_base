/*
 * @lc app=leetcode.cn id=面试题 08.06 lang=javascript
 * @lcpr version=30204
 *
 * [面试题 08.06] 汉诺塔问题
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} A
 * @param {number[]} B
 * @param {number[]} C
 * @return {void} Do not return anything, modify C in-place instead.
 */
var hanota = function (A, B, C) {
  /**
   * 分治
   *  将 f(n) 从 A -> C 分解为三个子问题
   *
   *   1. 将 f(n-1) 个圆盘移动 A -> B。
   *   2. 将 f(1) 个圆盘移动 A -> C
   *   3. 将 f(n-1) 个圆盘移动 B -> C。
   *
   * 分治到最后两个时
   *  f(1) 直接从开始地移动到目标地
   *  f(2) 将顶部(较小的)的放在缓存区, 下面的放在目标地, 缓存区的放在目标地
   */

  /**
   * 分治处理
   * @param {number[]} src 移动的柱子
   * @param {number[]} target 目的地柱子
   * @param {number[]} buf 缓冲区柱子
   * @param {number} num  移动圆盘个数
   */
  function dfs(src, target, buf, num) {
    // 处理 f(1) -> 直接从开始地移动到目标地
    if (num === 1) {
      target.push(src.pop());
      return;
    }

    // f(2) 将顶部(较小的)的放在缓存区, 下面的放在目标地, 缓存区的放在目标地 --> 注意: 无需此步, 继续分解即可
    if (num === 2) {
      buf.push(src.pop());
      target.push(src.pop());
      target.push(buf.pop());
      return;
    }

    // 1. 将 f(n-1) 个圆盘移动 A -> B。
    dfs(src, buf, target, num - 1);
    // 2. 将 f(1) 个圆盘移动 A -> C
    dfs(src, target, buf, 1);
    // 3. 将 f(n-1) 个圆盘移动 B -> C。
    dfs(buf, target, src, num - 1);
  }

  dfs(A, C, B, A.length);
};
// @lc code=end

/*
// @lcpr case=start
// [8, 7, 6, 5, 4, 3, 2, 1, 0]\n[]\n[]\n
// @lcpr case=end

// @lcpr case=start
// [1, 0]\n[]\n[]\n
// @lcpr case=end

 */
