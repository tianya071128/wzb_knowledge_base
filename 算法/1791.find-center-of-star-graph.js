/*
 * @lc app=leetcode.cn id=1791 lang=javascript
 * @lcpr version=30204
 *
 * [1791] 找出星型图的中心节点
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} edges
 * @return {number}
 */
var findCenter = function (edges) {
  return edges[0][0] === edges[1][0] || edges[0][0] === edges[1][1]
    ? edges[0][0]
    : edges[0][1];
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2],[2,3],[4,2]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2],[5,1],[1,3],[1,4]]\n
// @lcpr case=end

 */
