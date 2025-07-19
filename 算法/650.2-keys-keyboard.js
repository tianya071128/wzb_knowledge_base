/*
 * @lc app=leetcode.cn id=650 lang=javascript
 * @lcpr version=30204
 *
 * [650] 两个键的键盘
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var minSteps = function (n) {
  /**
   * 1 --> 0
   * 2 --> 2
   * 3 --> 3
   *
   *
   * 4
   *  "A"   --> Copy All 操作
   *  "AA"  --> 使用 Paste 操作
   *  "AAA" --> 使用 Paste 操作，这里使用 Copy All 操作也是可以的
   *  "AAAA" --> 使用 Paste 操作
   *
   *
   * 5
   *  "A"   --> Copy All 操作
   *  "AA"  --> 使用 Paste 操作
   *  "AAA"  --> 使用 Paste 操作
   *  "AAAA"  --> 使用 Paste 操作
   *  "AAAAA"  --> 使用 Paste 操作
   *
   *
   *
   * 6 = 2 * 3
   *   - 那只要先操作到 3, 之后在加两步(Copy All 操作)
   *
   * 9 = 3 * 3
   *   - 那只要先操作到 3, 之后在加三步(Copy All 操作加上两次复制)
   *
   * 17 --> 质数, 只能一个个复制
   *
   *
   * 综上发现:
   *  1. 如果是质数, 那么的操作次数直接是本身, 只能一个个复制
   *  2. 5 以下的数也是本身
   *  3. 所以就对于一个数: 36 -->  3 * (2 * 2 * 3) 最少需要 10 步
   *      --> 一直拆解到质数
   */
  let ans = 0;

  one: while (n > 5) {
    // 对 n 进行拆解
    for (let i = 2; i <= Math.sqrt(n); i++) {
      // 说明不是质数
      if (n % i === 0) {
        ans += i;
        n /= i;
        continue one;
      }
    }

    // 到了这里的话, 就说明是质数
    break;
  }

  return n <= 1 ? 0 : ans + n;
};
// @lc code=end

/*
// @lcpr case=start
// 1000\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */
