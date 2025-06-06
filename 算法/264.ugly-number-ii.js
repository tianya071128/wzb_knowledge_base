/*
 * @lc app=leetcode.cn id=264 lang=javascript
 * @lcpr version=30204
 *
 * [264] 丑数 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var nthUglyNumber = function (n) {
  // 照抄至: https://leetcode.cn/problems/ugly-number-ii/solutions/712102/chou-shu-ii-by-leetcode-solution-uoqd/
  // 稍做修改
  let primes = [2, 3, 5],
    p = [0, 0, 0], // 对应的指数
    ans = [1];

  for (let i = 1; i <= n; i++) {
    // 找到最小值
    let res = p.map((item, index) => ans[item] * primes[index]);
    let min = Math.min(...res);

    res.forEach((item, index) => {
      if (item === min) {
        p[index]++;
      }
    });
    ans.push(min);
  }

  return ans[n - 1];
};
// @lc code=end

/*
// @lcpr case=start
// 15\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = nthUglyNumber;
// @lcpr-after-debug-end
