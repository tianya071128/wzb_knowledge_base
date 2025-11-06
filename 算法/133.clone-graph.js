/*
 * @lc app=leetcode.cn id=133 lang=javascript
 * @lcpr version=30204
 *
 * [133] 克隆图
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * // Definition for a _Node.
 * function _Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */
function _Node(val, neighbors) {
  this.val = val === undefined ? 0 : val;
  this.neighbors = neighbors === undefined ? [] : neighbors;
}
/**
 * @param {_Node} node
 * @return {_Node}
 */
var cloneGraph = function (node) {
  // 这里存储着已经拷贝过的节点
  let cache = new Map();

  function clone(node) {
    if (!node) return;

    if (cache.has(node.val)) return cache.get(node.val);

    let cloneNode = new _Node(node.val);
    cache.set(node.val, cloneNode);

    // 复制边
    for (const item of node.neighbors) {
      cloneNode.neighbors.push(clone(item));
    }

    return cloneNode;
  }

  return clone(node);
};
// @lc code=end

/*
// @lcpr case=start
// [[2,4],[1,3],[2,4],[1,3]]\n
// @lcpr case=end

// @lcpr case=start
// [[]]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = cloneGraph;
// @lcpr-after-debug-end
