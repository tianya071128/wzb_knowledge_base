/*
 * @lc app=leetcode.cn id=1837 lang=javascript
 * @lcpr version=30204
 *
 * [1837] K 进制表示下的各位数字总和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var sumBase = function (n, k) {
  /** @type {number} 结果 */
  let ans = 0;

  while (n) {
    ans += n % k;

    n = Math.floor(n / k);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 34\n6\n
// @lcpr case=end

// @lcpr case=start
// 10\n10\n
// @lcpr case=end

 */
