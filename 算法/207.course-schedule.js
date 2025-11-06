/*
 * @lc app=leetcode.cn id=207 lang=javascript
 * @lcpr version=30204
 *
 * [207] 课程表
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function (numCourses, prerequisites) {
  /**
   * 有向图: 如果从某一节点出发, 会重复访问某个节点两次, 表示形成环, 就返回 false
   *
   *  - 1. 使用邻接表组成图
   *  - 2. 遍历节点, 尝试是否会找到环
   */

  /** @type {Map<number, Set<number>>} */
  let graph = new Map();
  for (const [v1, v2] of prerequisites) {
    let sideHash = graph.get(v1) ?? new Set();
    sideHash.add(v2);

    graph.set(v1, sideHash);
  }

  // 遍历节点
  let processed = new Set(), // 已处理课程
    paths = []; // 走过的路径
  // 深度搜索
  function dfs(vertex) {
    // 如果已经处理过, 直接返回
    if (processed.has(vertex)) return true;
    // 如果形成环, 直接返回 false
    if (paths.includes(vertex)) return false;

    // 遍历当前顶点边
    paths.push(vertex);
    for (const item of graph.get(vertex) ?? []) {
      if (!dfs(item)) return false;
    }
    paths.pop();
    processed.add(vertex);

    return true;
  }
  for (const [vertex] of graph) {
    if (processed.has(vertex)) continue;

    if (!dfs(vertex)) return false;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// 2\n[[1,0],[0,1]]\n
// @lcpr case=end

// @lcpr case=start
// 5\n[[1,4],[2,4],[3,1],[3,2]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = canFinish;
// @lcpr-after-debug-end
