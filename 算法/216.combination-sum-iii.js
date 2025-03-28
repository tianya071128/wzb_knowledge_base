/*
 * @lc app=leetcode.cn id=216 lang=javascript
 * @lcpr version=30204
 *
 * [216] 组合总和 III
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} k
 * @param {number} n
 * @return {number[][]}
 */
var combinationSum3 = function (k, n) {
  // 回溯
  const paths = [],
    ans = [];

  function dfs(start, surplus) {
    // 终止条件: 路径到达 或者 剩余值小于等于 0
    if (paths.length === k || surplus <= 0) {
      // 添加进结果: 路径正好为 k, 并且剩余值为 0
      paths.length === k && surplus === 0 && ans.push([...paths]);
      return;
    }

    for (let i = start; i <= 9; i++) {
      // 添加进路径
      paths.push(i);
      dfs(i + 1, surplus - i);
      // 退出路径
      paths.pop();
    }
  }

  dfs(1, n);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 2\n18\n
// @lcpr case=end

// @lcpr case=start
// 3\n9\n
// @lcpr case=end

// @lcpr case=start
// 4\n1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = combinationSum3;
// @lcpr-after-debug-end
