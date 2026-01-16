/*
 * @lc app=leetcode.cn id=1319 lang=javascript
 * @lcpr version=30204
 *
 * [1319] 连通网络的操作次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[][]} connections
 * @return {number}
 */
var makeConnected = function (n, connections) {
  /**
   * 1. 本质上是图, 但是是多个图
   * 2. 得出多个图, 连接多个图即可, 那么结果就是 图的数量 - 1
   */

  // 此时线缆数量不够
  if (connections.length < n - 1) return -1;

  // 记录下每个节点的出度
  /** @type { number[][] } */
  let degree = Array.from({ length: n }, () => []);

  for (const [n1, n2] of connections) {
    degree[n1].push(n2);
    degree[n2].push(n1);
  }

  // 计算图的数量
  let ans = 0,
    // 是否处理过
    visibled = Array(n).fill(false);

  /**
   * 深度搜索
   * @param {number} node 搜索节点
   */
  function dfs(node) {
    // 已经搜索过
    if (visibled[node]) return;

    visibled[node] = true;

    for (const i of degree[node]) {
      dfs(i);
    }
  }

  for (let i = 0; i < degree.length; i++) {
    if (!visibled[i]) {
      dfs(i);
      ans++;
    }
  }

  return ans - 1;
};
// @lc code=end

/*
// @lcpr case=start
// 4\n[[0,1],[0,2],[1,2]]\n
// @lcpr case=end

// @lcpr case=start
// 6\n[[0,1],[0,2],[0,3],[1,2],[1,3]]\n
// @lcpr case=end

// @lcpr case=start
// 6\n[[0,1],[0,2],[0,3],[1,2]]\n
// @lcpr case=end

// @lcpr case=start
// 5\n[[0,1],[0,2],[3,4],[2,3]]\n
// @lcpr case=end

 */
