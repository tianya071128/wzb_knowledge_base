/*
 * @lc app=leetcode.cn id=623 lang=javascript
 * @lcpr version=30204
 *
 * [623] 在二叉树中增加一行
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
 * @param {number} depth
 * @return {TreeNode}
 */
var addOneRow = function (root, val, depth) {
  if (depth === 1) return new TreeNode(val, root);

  function dfs(root, curDepth) {
    if (!root) return;

    if (depth === curDepth + 1) {
      root.left = new TreeNode(val, root.left);
      root.right = new TreeNode(val, undefined, root.right);

      return;
    }

    dfs(root.left, curDepth + 1);
    dfs(root.right, curDepth + 1);
  }

  dfs(root, 1);

  return root;
};
// @lc code=end

/*
// @lcpr case=start
// [4,2,6,3,1,5]\n1\n2\n
// @lcpr case=end

// @lcpr case=start
// [4,2,null,3,1]\n1\n3\n
// @lcpr case=end

 */
