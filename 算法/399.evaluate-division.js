/*
 * @lc app=leetcode.cn id=399 lang=javascript
 * @lcpr version=30204
 *
 * [399] 除法求值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[][]} equations
 * @param {number[]} values
 * @param {string[][]} queries
 * @return {number[]}
 */
var calcEquation = function (equations, values, queries) {
  /**
   * 问题可以总结为有权有向图:
   *  从某个点到某个点的权重相乘即为结果
   */

  /** @type {Map<string, Map<string, number>>} Map<顶点, Map<连接的顶点, 权重>> */
  let graph = new Map();
  for (let i = 0; i < equations.length; i++) {
    let nodes = equations[i],
      weight = values[i];

    // 添加顶点和边
    let node = graph.get(nodes[0]) ?? new Map();
    node.set(nodes[1], weight);
    graph.set(nodes[0], node);

    node = graph.get(nodes[1]) ?? new Map();
    node.set(nodes[0], 1 / weight);
    graph.set(nodes[1], node);
  }

  /** @type {string[]} 结果 */
  let ans = [],
    /** @type {Map<string, number>} 缓存计算结果 */
    cache = new Map(),
    /** @type {string[]} 路径 */
    paths = [];

  // 计算
  function dfs(start, end) {
    // 防止环
    if (paths.includes(start)) return;

    let key = `${start},${end}`;
    if (cache.has(key)) return cache.get(key);

    paths.push(start);
    // 当次结果
    let ans;

    if (graph.has(start)) {
      // 提前确定终点
      if (graph.get(start).has(end)) {
        ans = graph.get(start).get(end);
      } else {
        for (const [v, n] of graph.get(start)) {
          let res = dfs(v, end);

          if (typeof res === 'number') {
            ans = res * n;
            break;
          }
        }
      }
    }

    paths.pop(start);
    ans != undefined && cache.set(key, ans);

    return ans;
  }

  for (const querie of queries) {
    // 启动计算
    ans.push(
      graph.has(querie[0]) && graph.has(querie[1])
        ? dfs(querie[0], querie[1]) ?? -1
        : -1
    );
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [["a","b"],["b","c"]]\n[2.0,3.0]\n[["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]\n
// @lcpr case=end

// @lcpr case=start
// [["a","b"],["b","c"],["bc","cd"]]\n[1.5,2.5,5.0]\n[["a","c"],["c","b"],["bc","cd"],["cd","bc"]]\n
// @lcpr case=end

// @lcpr case=start
// [["a","b"]]\n[0.5]\n[["a","b"],["b","a"],["a","c"],["x","y"]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = calcEquation;
// @lcpr-after-debug-end
