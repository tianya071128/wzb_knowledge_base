/*
 * @lc app=leetcode.cn id=1304 lang=javascript
 * @lcpr version=30204
 *
 * [1304] 和为零的 N 个不同整数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number[]}
 */
var sumZero = function (n) {
  let ans = n % 2 !== 0 ? [0] : [];

  for (let i = 1; i <= n / 2; i++) {
    ans.push(i, i * -1);
  }
  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 5\n
// @lcpr case=end

// @lcpr case=start
// 3\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */
