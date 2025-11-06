/*
 * @lc app=leetcode.cn id=797 lang=javascript
 * @lcpr version=30204
 *
 * [797] 所有可能的路径
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} graph
 * @return {number[][]}
 */
var allPathsSourceTarget = function (graph) {
  /**
   * 图: 回溯所有可能
   */
  let ans = [],
    paths = []; // 路径

  function dfs(i) {
    // 因为是无环图, 所以所需考虑循环问题

    // 剪枝
    if (graph.length - 1 === i) {
      ans.push([...paths, i]);
      return;
    }

    paths.push(i);

    for (const next of graph[i]) {
      dfs(next);
    }

    paths.pop();
  }

  dfs(0);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2],[3],[3],[]]\n
// @lcpr case=end

// @lcpr case=start
// [[4,3,1],[3,2,4],[3],[4],[]]\n
// @lcpr case=end

 */
