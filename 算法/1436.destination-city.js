/*
 * @lc app=leetcode.cn id=1436 lang=javascript
 * @lcpr version=30204
 *
 * [1436] 旅行终点站
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[][]} paths
 * @return {string}
 */
var destCity = function (paths) {
  // 使用 map 存储出度的节点
  const hash = new Set(),
    nodes = new Set();
  for (const [A, B] of paths) {
    hash.add(A);
    nodes.add(B);
  }

  // 遍历所有节点, 没有出度的即是结果
  for (const node of nodes) {
    if (!hash.has(node)) return node;
  }
};
// @lc code=end

/*
// @lcpr case=start
// [["London","New York"],["New York","Lima"],["Lima","Sao Paulo"]]\n
// @lcpr case=end

// @lcpr case=start
// [["B","C"],["D","B"],["C","A"]]\n
// @lcpr case=end

// @lcpr case=start
// [["A","Z"]]\n
// @lcpr case=end

 */
