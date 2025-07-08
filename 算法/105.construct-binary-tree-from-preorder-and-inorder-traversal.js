/*
 * @lc app=leetcode.cn id=105 lang=javascript
 * @lcpr version=30204
 *
 * [105] 从前序与中序遍历序列构造二叉树
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
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
  /**
   * 分治: 主要是根据先序和中序来确定根节点以及左右子节点
   *
   *  1. 无重复值节点
   *  2. 先序第一个为根节点, 那么就可以在第二个中确定左右子树的节点的数量
   */
  if (preorder.length === 0) return null;

  // 根节点
  const root = new TreeNode(preorder[0]);

  // 只有一个
  if (preorder.length === 1) return root;

  // 在中序遍历结果 inorder 中确定左右子树分界线
  const i = inorder.indexOf(preorder[0]);

  root.left = buildTree(preorder.slice(1, i + 1), inorder.slice(0, i));
  root.right = buildTree(preorder.slice(i + 1), inorder.slice(i + 1));

  return root;
};
// @lc code=end

/*
// @lcpr case=start
// [3,9,20,15,7]\n[9,3,15,20,7]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n[3,2,1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = buildTree;
// @lcpr-after-debug-end
