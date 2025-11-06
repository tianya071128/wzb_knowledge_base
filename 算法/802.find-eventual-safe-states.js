/*
 * @lc app=leetcode.cn id=802 lang=javascript
 * @lcpr version=30204
 *
 * [802] 找到最终的安全状态
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} graph
 * @return {number[]}
 */
var eventualSafeNodes = function (graph) {
  /**
   * 拓扑排序
   */
  // 记录下所有节点的出度, 当出度为0时, 表示为终端节点(同时也是安全节点)
  let ans = [],
    frequencys = Array(graph.length).fill(0),
    hash = new Map(); // 记录下节点的入度节点

  for (let i = 0; i < graph.length; i++) {
    frequencys[i] = graph[i].length;
    // 记录下该节点出度的节点, 添加出度节点对应的入度节点
    for (const j of graph[i]) {
      if (hash.has(j)) {
        hash.get(j).push(i);
      } else {
        hash.set(j, [i]);
      }
    }
  }

  // 将所有出度为0的添加进队列
  let queue = [];
  for (let i = 0; i < frequencys.length; i++) {
    if (frequencys[i] === 0) {
      queue.push(i);
    }
  }

  // 遍历所有出度为0的节点
  while (queue.length) {
    let cur = queue.pop();
    ans.push(cur);

    // 将该节点对应的入度节点的出度减一
    if (hash.has(cur)) {
      for (const i of hash.get(cur)) {
        frequencys[i]--;
        // 如果出度为0, 则追加进队列
        if (frequencys[i] === 0) {
          queue.unshift(i);
        }
      }
    }
  }

  return ans.sort((a, b) => a - b);
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2],[2,3],[5],[0],[5],[],[]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2,3,4],[1,2],[3,4],[0,4],[]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = eventualSafeNodes;
// @lcpr-after-debug-end
