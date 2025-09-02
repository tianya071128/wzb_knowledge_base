/*
 * @lc app=leetcode.cn id=866 lang=javascript
 * @lcpr version=30204
 *
 * [866] 回文质数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var primePalindrome = function (n) {
  /**
   * 暴力解法
   */

  while (true) {
    if (n === reverse(n) && isPrime(n)) return n;

    // 不存在 8 长度的素数 --> 这不就是要跳过 8 位数...
    if (n >= 10000000 && n <= 99999999) {
      n = 100000000;
    } else {
      n++;
    }
  }
};

/**
 * 检测是否为素数
 */
var isPrime = function (n) {
  if (n <= 1) return false;

  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }

  return true;
};

/**
 * 反转数字
 */
var reverse = function (n) {
  let ans = 0;
  while (n > 0) {
    ans = ans * 10 + (n % 10);
    n = Math.floor(n / 10);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 9989900\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

// @lcpr case=start
// 13\n
// @lcpr case=end

 */
