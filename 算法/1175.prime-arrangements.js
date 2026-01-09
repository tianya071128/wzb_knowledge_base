/*
 * @lc app=leetcode.cn id=1175 lang=javascript
 * @lcpr version=30204
 *
 * [1175] 质数排列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var numPrimeArrangements = function (n) {
  /**
   * 计算出 1 ~ n 的质数
   * 判断质数和非质数的数量
   * 质数排列可能性 * 非质数排列的可能性
   */
  let primes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97,
  ];
  // 质数个数
  let primeCount = primes.filter((item) => item <= n).length,
    ans = 1,
    MOE = 10 ** 9 + 7;

  for (let i = 2; i <= primeCount; i++) {
    ans = (ans * i) % MOE;
  }

  for (let i = 2; i <= n - primeCount; i++) {
    ans = (ans * i) % MOE;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 2\n
// @lcpr case=end

// @lcpr case=start
// 100\n
// @lcpr case=end

 */
