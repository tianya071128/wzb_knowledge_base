/*
 * @lc app=leetcode.cn id=743 lang=javascript
 * @lcpr version=30204
 *
 * [743] 网络延迟时间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var networkDelayTime = function (times, n, k) {
  /**
   * 构建有权有向图, 之后深度搜索
   */
  /** @type {Map<number, Map<number, number>>} Map<节点, Map<边, 权重>> */
  let graph = new Map();
  for (const [n, n1, n2] of times) {
    let nodeMap = graph.get(n) ?? new Map();
    nodeMap.set(n1, n2);

    graph.set(n, nodeMap);
  }

  // 深度搜索
  /** @type {Map<number, number>} 到达时间 */
  let hash = new Map();

  /**
   *
   * @param {number} node 节点
   * @param {number} time 到达时间
   */
  function dfs(node, time) {
    // 已经到达过这个节点, 并且时间上更少
    if (hash.has(node) && hash.get(node) <= time) return;

    hash.set(node, time);

    // 查找下一个节点
    for (const [sonNode, n] of graph.get(node) ?? []) {
      dfs(sonNode, time + n);
    }
  }

  dfs(k, 0);

  return hash.size === n ? Math.max(...hash.values()) : -1;
};
// @lc code=end

/*
// @lcpr case=start
// [[2,1,1],[2,3,1],[3,4,1]]\n4\n2\n
// @lcpr case=end

// @lcpr case=start
// [[1,2,1]]\n2\n1\n
// @lcpr case=end

// @lcpr case=start
// [[1,2,1]]\n2\n2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = networkDelayTime;
// @lcpr-after-debug-end
