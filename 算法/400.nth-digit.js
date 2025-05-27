/*
 * @lc app=leetcode.cn id=400 lang=javascript
 * @lcpr version=30204
 *
 * [400] 第 N 位数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var findNthDigit = function (n) {
  /**
   * carry(位数) --> 个数(数字个数) --> 总数
   *      1      --> 9             --> 9 * 1 = 9
   *      2      --> 90            --> 90 * 2 = 180
   *      3      --> 900           --> 900 * 3 = 2700
   *
   * 所以随机一个数字: 1231, 他的个数区间求值:
   *  const max = carry(1) + carry(2) + carry(3) + (1231 - 1000 + 1) * 4
   *  区间为 [max - 4, max]
   */
  // 1. 先求出进位的前缀和
  const prefixSum = [];
  for (let i = 1; i <= Math.log10(n) + 1; i++) {
    prefixSum.push((prefixSum.at(-1) ?? 0) + 9 * 10 ** (i - 1) * i);
  }

  // 2. 二分搜索
  let left = 1,
    right = n;

  while (left <= right) {
    const mid = Math.floor((right - left) / 2) + left;
    // 找到 mid 对应的数量
    const midCarry = Math.floor(Math.log10(mid));
    // 右区间
    const rightInterval =
      (prefixSum[midCarry - 1] ?? 0) +
      (mid - 10 ** midCarry + 1) * (midCarry + 1);
    // 左区间
    const leftInterval = rightInterval - midCarry;

    // 在左区间
    if (n < leftInterval) {
      right = mid - 1;
    }
    // 在右区间
    else if (n > rightInterval) {
      left = mid + 1;
    }
    // 命中
    else {
      /**
       * 如果目标就在 mid 中, 取出具体的
       */
      return Math.floor(
        (mid % 10 ** (rightInterval - n + 1)) / 10 ** (rightInterval - n)
      );
    }
  }

  // 还是超时
  // let s = '',
  //   current = 1;
  // while (s.length < n) {
  //   s += String(current);
  //   current++;
  // }

  // return Number(s[n - 1]);

  // 超时
  // let current = 1,
  //   carry = 1;
  // while (n >= 0) {
  //   /**
  //    * 如果目标就在 current 中, 取出具体的
  //    *  假设
  //    *    --> current === 1231, n === 2, carry === 4
  //    *    那么取的就是 2 数字
  //    *
  //    *    res = Math.floor((1231 % (10 ** (4 - 2 + 1))) / 10 ** (4 - 2)) = Math.floor((current % (10 ** (carry - n + 1))) / 10 ** (carry - n))
  //    *
  //    */
  //   if (n <= carry) {
  //     return Math.floor((current % 10 ** (carry - n + 1)) / 10 ** (carry - n));
  //   }

  //   n -= carry;
  //   current++;
  //   carry = Math.floor(Math.log10(current)) + 1;
  // }
};
// @lc code=end

/*
// @lcpr case=start
// 2147483\n
// @lcpr case=end

// @lcpr case=start
// 11\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findNthDigit;
// @lcpr-after-debug-end
