/*
 * @lc app=leetcode.cn id=62 lang=javascript
 * @lcpr version=30204
 *
 * [62] 不同路径
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
  // 动态规划, f(m x n) 网格的路径等于 f(m -1 x n) + f(m x n - 1)
  // 终止条件
  // if (m === 1 || n === 1) return 1;
  // 超出时间限制 - 使用递归
  // return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
  // 使用迭代
};
// @lc code=end

/*
// @lcpr case=start
// 3\n7\n
// @lcpr case=end

// @lcpr case=start
// 3\n2\n
// @lcpr case=end

// @lcpr case=start
// 7\n3\n
// @lcpr case=end

// @lcpr case=start
// 3\n3\n
// @lcpr case=end

 */
