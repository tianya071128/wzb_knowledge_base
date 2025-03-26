/*
 * @lc app=leetcode.cn id=104 lang=javascript
 * @lcpr version=30204
 *
 * [104] 二叉树的最大深度
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
var maxDepth = function (root) {
  let level = 0;

  function dfs(root, n) {
    if (!root) return;

    if (!root.left && !root.right) {
      level = Math.max(level, n + 1);
      return;
    }

    dfs(root.left, n + 1);
    dfs(root.right, n + 1);
  }

  dfs(root, 0);
  return level;
};
// @lc code=end

/*
// @lcpr case=start
// [3,9,20,null,null,15,7]\n
// @lcpr case=end

// @lcpr case=start
// [1,null,2]\n
// @lcpr case=end

 */
