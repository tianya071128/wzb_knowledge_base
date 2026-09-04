/*
 * @lc app=leetcode.cn id=1971 lang=javascript
 * @lcpr version=30204
 *
 * [1971] 寻找图中是否存在路径
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} source
 * @param {number} destination
 * @return {boolean}
 */
var validPath = function (n, edges, source, destination) {
  /** @type {number[][]} 图的表示 */
  let map = Array.from({ length: n }, () => []);

  for (const [n1, n2] of edges) {
    map[n1].push(n2);
    map[n2].push(n1);
  }

  /** @type {Set<number>} 标记是否访问过 */
  let hash = new Set([source]),
    /** @type {number[]} 队列 */
    queue = [source];

  for (let i = 0; i < queue.length; i++) {
    if (queue[i] === destination) return true;

    for (const item of map[queue[i]]) {
      if (!hash.has(item)) {
        queue.push(item);
        hash.add(item);
      }
    }
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// 3\n[[0,1],[1,2],[2,0]]\n0\n2\n
// @lcpr case=end

// @lcpr case=start
// 6\n[[0,1],[0,2],[3,5],[5,4],[4,3]]\n0\n5\n
// @lcpr case=end

 */
