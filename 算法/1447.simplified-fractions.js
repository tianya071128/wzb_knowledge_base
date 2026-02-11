/*
 * @lc app=leetcode.cn id=1447 lang=javascript
 * @lcpr version=30204
 *
 * [1447] 最简分数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var simplifiedFractions = function (n) {
  /**
   * 1. 判断 n 能够分解成的质数集合
   * 2. 从 1 开始遍历分子, 判断是否与上面的质数集合存在交集
   */
  let primes = new Set([
      2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
    ]),
    refers = Array.from({ length: n + 1 }, () => new Set()),
    ans = [];

  // 初始化参照表: 索引对应的数字能够拆成的质数集合
  for (let i = 2; i <= n; i++) {
    let map = refers[i];

    for (const prime of primes) {
      if (prime > i) break;

      let n = i / prime;
      if (Number.isInteger(n)) {
        map.add(prime);
        if (primes.has(n)) map.add(n);
      }
    }
  }

  // 遍历分母分子
  for (let i = 2; i <= n; i++) {
    for (let j = 1; j <= i - 1; j++) {
      // 检测分子分母是否存在相关因子质数
      let hash1 = refers[i],
        hash2 = [...refers[j]];

      if (!hash2.some((item) => hash1.has(item))) {
        ans.push(`${j}/${i}`);
      }
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=simplifiedFractions
// paramTypes= ["number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 26\n
// @lcpr case=end

// @lcpr case=start
// 3\n
// @lcpr case=end

// @lcpr case=start
// 4\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = simplifiedFractions;
// @lcpr-after-debug-end
