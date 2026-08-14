/*
 * @lc app=leetcode.cn id=1716 lang=javascript
 * @lcpr version=30204
 *
 * [1716] 计算力扣银行的钱
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var totalMoney = function (n) {
  /** @type {number[]} 相加的数 */
  let diff = [1, 2, 3, 4, 5, 6, 7],
    ans = 0;

  for (let i = 0; i < n; i++) {
    ans += diff[i % 7]++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 4\n
// @lcpr case=end

// @lcpr case=start
// 10\n
// @lcpr case=end

// @lcpr case=start
// 20\n
// @lcpr case=end

 */
