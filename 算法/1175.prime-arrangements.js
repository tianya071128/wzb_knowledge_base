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
  // 二分搜索找到指数多少个质数
  let left = 0,
    right = primes.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);

    if (primes[mid] === n) {
      right = mid;
      break;
    } else if (primes[mid] > n) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
};
// @lc code=end

/*
// @lcpr case=start
// 5\n
// @lcpr case=end

// @lcpr case=start
// 100\n
// @lcpr case=end

 */
