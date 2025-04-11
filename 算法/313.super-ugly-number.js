/*
 * @lc app=leetcode.cn id=313 lang=javascript
 * @lcpr version=30204
 *
 * [313] 超级丑数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[]} primes
 * @return {number}
 */
var nthSuperUglyNumber = function (n, primes) {
  // 照抄至: https://leetcode.cn/problems/ugly-number-ii/solutions/712102/chou-shu-ii-by-leetcode-solution-uoqd/
  // 稍做修改
  let p = primes.map((item) => 0), // 对应的指数
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
// 12\n[2,7,13,19]\n
// @lcpr case=end

// @lcpr case=start
// 1\n[2,3,5]\n
// @lcpr case=end

 */
