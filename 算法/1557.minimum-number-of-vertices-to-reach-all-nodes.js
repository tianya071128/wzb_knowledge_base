/*
 * @lc app=leetcode.cn id=1557 lang=javascript
 * @lcpr version=30204
 *
 * [1557] 可以到达所有点的最少点数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[]}
 */
var findSmallestSetOfVertices = function (n, edges) {
  // 因为是无环图, 所以只需要找到入度为 0 的节点
  let deg = Array(n).fill(0);
  for (const [a, b] of edges) {
    deg[b]++;
  }

  let ans = [];
  for (let i = 0; i < deg.length; i++) {
    if (deg[i] === 0) ans.push(i);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 6\n[[0,1],[0,2],[2,5],[3,4],[4,2]]\n
// @lcpr case=end

// @lcpr case=start
// 5\n[[0,1],[2,1],[3,1],[1,4],[2,4]]\n
// @lcpr case=end

 */
