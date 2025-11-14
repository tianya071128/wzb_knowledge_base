/*
 * @lc app=leetcode.cn id=1042 lang=javascript
 * @lcpr version=30204
 *
 * [1042] 不邻接植花
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[][]} paths
 * @return {number[]}
 */
var gardenNoAdj = function (n, paths) {
  /**
   * 双向图
   */
  let graph = new Array(n).fill(0).map(() => []),
    ans = new Array(n).fill(0);

  for (const [n1, n2] of paths) {
    graph[n1 - 1].push(n2 - 1);
    graph[n2 - 1].push(n1 - 1);
  }

  // 从第一个花园开始
  for (let i = 0; i < n; i++) {
    // 从与该花园相连已经种下的花中排除
    const hash = new Set([1, 2, 3, 4]);
    for (const j of graph[i]) {
      hash.delete(ans[j]);
    }

    ans[i] = [...hash][0];
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 3\n[[1,2],[2,3],[3,1]]\n
// @lcpr case=end

// @lcpr case=start
// 4\n[[1,2],[3,4]]\n
// @lcpr case=end

// @lcpr case=start
// 4\n[[1,2],[2,3],[3,4],[4,1],[1,3],[2,4]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = gardenNoAdj;
// @lcpr-after-debug-end
