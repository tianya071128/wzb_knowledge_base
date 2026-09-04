/*
 * @lc app=leetcode.cn id=2022 lang=javascript
 * @lcpr version=30204
 *
 * [2022] 将一维数组转变成二维数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} original
 * @param {number} m
 * @param {number} n
 * @return {number[][]}
 */
var construct2DArray = function (original, m, n) {
  if (m * n !== original.length) return [];

  /** @type {number[][]} 结果 */
  let ans = Array.from({ length: m }, () => new Array(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      ans[i][j] = original[i * n + j];
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n2\n2\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n1\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n1\n1\n
// @lcpr case=end

// @lcpr case=start
// [3]\n1\n2\n
// @lcpr case=end

 */
