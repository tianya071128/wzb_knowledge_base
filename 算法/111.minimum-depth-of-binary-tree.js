/*
 * @lc app=leetcode.cn id=111 lang=javascript
 * @lcpr version=30204
 *
 * [111] 二叉树的最小深度
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
var minDepth = function (root) {
  if (!root) return 0;

  let level = Infinity;

  function dfs(root, n) {
    if (!root) return;

    if (!root.left && !root.right) {
      level = Math.min(n, level);
      return;
    }

    dfs(root.left, n + 1);
    dfs(root.right, n + 1);
  }

  dfs(root, 1);

  return level;
};
// @lc code=end

/*
// @lcpr case=start
// [3,9,20,null,null,15,7]\n
// @lcpr case=end

// @lcpr case=start
// [2,null,3,null,4,null,5,null,6]\n
// @lcpr case=end

 */
