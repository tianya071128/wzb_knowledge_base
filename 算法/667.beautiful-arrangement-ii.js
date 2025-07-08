/*
 * @lc app=leetcode.cn id=667 lang=javascript
 * @lcpr version=30204
 *
 * [667] 优美的排列 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 优化: 当 k 为 25 时, 可由 1 - 26 的值交替组成, 剩下的递增即可
 *
 * @param {number} n
 * @param {number} k
 * @return {number[]}
 */
var constructArray = function (n, k) {
  /**
   * 假设 n = 8

   *   1, 2, 3, 4, 5, ...  --> k = 1
   *   
   *   1, 8, 7, ...  --> k = 2
   *   
   *   1, 8, 2, 3, 4, ...  --> k = 3
   *   
   *   1, 8, 2, 7, 6, ...  --> k = 4
   * 
   * 
   * 观察可得, 当从起始和尾部取数时, 差值最大, 之后循环从头部和尾数取数, 直到:
   *   k === 1 时, 直接从当前数递增(或递减)取数
   */
  let ans = [1],
    direction = 1;

  for (let i = 2; i <= n; i++) {
    if (k === 1) {
      ans.push(ans.at(-1) + direction);
    } else {
      ans.push((ans.at(-2) ?? n + 1) + direction * -1);

      direction *= -1;
      k--;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 102\n26\n
// @lcpr case=end

// @lcpr case=start
// 3\n2\n
// @lcpr case=end

 */
