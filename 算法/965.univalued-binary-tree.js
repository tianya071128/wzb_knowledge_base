/*
 * @lc app=leetcode.cn id=965 lang=javascript
 * @lcpr version=30204
 *
 * [965] 单值二叉树
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
 * @return {boolean}
 */
var isUnivalTree = function (root) {
  let base = root.val;

  function dfs(node) {
    if (!node) return true;

    if (node.val !== base) return false;

    return dfs(node.left) && dfs(node.right);
  }

  return dfs(root);
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,1,1,1,null,1]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,2,5,2]\n
// @lcpr case=end

 */
