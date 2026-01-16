/*
 * @lc app=leetcode.cn id=1325 lang=javascript
 * @lcpr version=30204
 *
 * [1325] 删除给定值的叶子节点
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
 * @param {number} target
 * @return {TreeNode}
 */
var removeLeafNodes = function (root, target) {
  function dfs(node) {
    if (!node) return node;

    node.left = dfs(node.left);
    node.right = dfs(node.right);

    if (node.val === target && !node.left && !node.right) return null;

    return node;
  }

  return dfs(root);
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,2,null,2,4]\n2\n
// @lcpr case=end

// @lcpr case=start
// [1,3,3,3,2]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2,null,2,null,2]\n2\n
// @lcpr case=end

 */
