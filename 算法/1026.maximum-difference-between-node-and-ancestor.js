/*
 * @lc app=leetcode.cn id=1026 lang=javascript
 * @lcpr version=30204
 *
 * [1026] 节点与其祖先之间的最大差值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxAncestorDiff = function (root) {
  /**
   * 也就是求一条路径上的最大值和最小值之间的差值
   */
  let ans = 0;

  function dfs(node, max, min) {
    if (!node) return;

    max = Math.max(node.val, max);
    min = Math.min(node.val, min);

    if (!node.left && !node.right) {
      ans = Math.max(ans, max - min);
    } else {
      dfs(node.left, max, min);
      dfs(node.right, max, min);
    }
  }

  dfs(root, -Infinity, Infinity);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [8,3,10,1,6,null,14,null,null,4,7,13]\n
// @lcpr case=end

// @lcpr case=start
// [1,null,2,null,0,3]\n
// @lcpr case=end

 */
