/*
 * @lc app=leetcode.cn id=60 lang=javascript
 * @lcpr version=30204
 *
 * [60] 排列序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number} k
 * @return {string}
 */
var getPermutation = function (n, k) {
  /**
   * 贪心:
   *
   *  - 首先从第一位开始算起
   *     - 第一位为 1 时, 当 k > (n - 1)!, 那么说明后面的变化不够, 所以进位
   *     - 进位为 2 时, 重复上一步, 直到无法进位
   *  - 延伸到最后一位
   */
  let factorial = [1, 1, 2, 6, 24, 120, 720, 5040, 40320],
    ans = '',
    strs = Array.from({ length: n }, (v, k) => `${k + 1}`);

  while (n) {
    // 从当前为开始计算
    for (let i = 0; i < strs.length; i++) {
      // 当前数字已经处理过
      if (!strs[i]) continue;

      // 是否需要进位
      if (k <= factorial[n - 1]) {
        ans += strs[i];
        strs[i] = false;
        break;
      }

      k -= factorial[n - 1];
    }

    n--;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 3\n2\n
// @lcpr case=end

// @lcpr case=start
// 4\n9\n
// @lcpr case=end

// @lcpr case=start
// 9\n500\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = getPermutation;
// @lcpr-after-debug-end
