/*
 * @lc app=leetcode.cn id=50 lang=javascript
 * @lcpr version=30204
 *
 * [50] Pow(x, n)
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function (x, n) {
  if (n === 0) return 1;

  // 思路: 在于防止精度丢失

  // 取整
  function decimal(n) {
    let base = 1;
    while (parseInt(n) !== n) {
      base *= 10;
      n *= 10;
    }

    return {
      base,
      n,
    };
  }
  // 乘
  function multiply(n, n2) {
    const res1 = decimal(n);
    const res2 = decimal(n2);

    return (res1.n * res2.n) / (res1.base * res2.base);
  }

  let isNegative = n < 0;
  let res = x;
  for (let index = 1; index < Math.abs(n); index++) {
    res = multiply(res, x);
  }

  return isNegative ? 1 / res : res;
};
// @lc code=end

/*
// @lcpr case=start
// 2.00000\n10\n
// @lcpr case=end

// @lcpr case=start
// 2.10000\n3\n
// @lcpr case=end

// @lcpr case=start
// 2.00000\n-2\n
// @lcpr case=end

 */
