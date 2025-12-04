/*
 * @lc app=leetcode.cn id=1390 lang=javascript
 * @lcpr version=30204
 *
 * [1390] 四因数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var sumFourDivisors = function (nums) {
  /**
   * 如果该数可分解成两个质数的话, 说明是四因数
   */

  // 收集 nums 中 Max(nums) / 2 区间的质数
  let n = Math.floor(Math.max(...nums) / 2),
    isPrimes = new Array(n + 1).fill(true);

  // 将 0 和 1 置为 false, 因为这两个数不是质数
  isPrimes[0] = isPrimes[1] = false;

  for (let i = 2; i < Math.sqrt(n); i++) {
    // 该数为质数, 将其倍数置为 false
    if (isPrimes[i]) {
      for (let j = 2; j <= n; j++) {
        isPrimes[i * j] = false;
      }
    }
  }

  // 提取质数
  let primes = new Set();
  for (let i = 2; i < isPrimes.length; i++) {
    if (isPrimes[i]) primes.add(i);
  }

  // 找到四因数
  let ans = 0;
  for (const n of nums) {
    for (let i = 2; i < Math.sqrt(n); i++) {
      // 被整除了
      if (n % i === 0) {
        let j = n / i;
        // 两个因子都是质数的话, 就是四因数
        if (i !== j && primes.has(i) && primes.has(j)) {
          ans += 1 + n + i + j;
        }

        break;
      }
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=sumFourDivisors
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,2,3,4,5,6,7,8,9,10]\n
// @lcpr case=end

// @lcpr case=start
// [21,21]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = sumFourDivisors;
// @lcpr-after-debug-end
