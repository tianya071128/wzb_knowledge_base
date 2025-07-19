/*
 * @lc app=leetcode.cn id=106 lang=javascript
 * @lcpr version=30204
 *
 * [106] 从中序与后序遍历序列构造二叉树
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
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
  /**
   * 分治 - 不递归, 使用
   *  1. 同样的道理, 后序遍历确定根节点
   *  2. 中序遍历确定左右节点的数量
   */

  /**
   * 使用指针子树
   */
  function dfs(inorderStart, inorderEnd, postorderStart, postorderEnd) {
    // 无节点
    if (inorderStart > inorderEnd) return null;

    // 根节点 - 后序遍历的最后一个元素
    const rootVal = postorder[postorderEnd];
    const root = new TreeNode(rootVal);

    // 在中序遍历 inorder 中确定根节点位置
    const i = inorder.indexOf(rootVal);

    // 构建左右子树
    root.left = dfs(
      inorderStart,
      i - 1,
      postorderStart,
      postorderStart + i - inorderStart - 1
    );
    root.right = dfs(
      i + 1,
      inorderEnd,
      postorderStart + i - inorderStart,
      postorderEnd - 1
    );

    return root;
  }

  return dfs(0, inorder.length - 1, 0, postorder.length - 1);
};
// @lc code=end

/*
// @lcpr case=start
// [9,3,15,20,7]\n[9,15,7,20,3]\n
// @lcpr case=end

// @lcpr case=start
// [-1]\n[-1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = buildTree;
// @lcpr-after-debug-end
