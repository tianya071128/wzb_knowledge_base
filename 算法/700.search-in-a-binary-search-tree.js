/*
 * @lc app=leetcode.cn id=700 lang=javascript
 * @lcpr version=30204
 *
 * [700] 二叉搜索树中的搜索
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
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function (root, val) {
  function dfs(node) {
    if (!node) return null;

    if (node.val === val) return node;

    if (node.val > val) {
      return dfs(node.left);
    } else {
      return dfs(node.right);
    }
  }

  return dfs(root);
};
// @lc code=end

/*
// @lcpr case=start
// [4,2,7,1,3]\n2\n
// @lcpr case=end

// @lcpr case=start
// [4,2,7,1,3]\n5\n
// @lcpr case=end

 */
