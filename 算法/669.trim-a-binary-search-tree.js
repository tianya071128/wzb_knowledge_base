/*
 * @lc app=leetcode.cn id=669 lang=javascript
 * @lcpr version=30204
 *
 * [669] 修剪二叉搜索树
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
 * @param {number} low
 * @param {number} high
 * @return {TreeNode}
 */
var trimBST = function (root, low, high) {
  /**
   * 如果 root 的值小于 low 的话, 那么左树直接丢弃, 取右树的值
   * 如果 root 的值大于 high 的话, 那么右树直接丢弃, 取左树的值
   */

  if (!root) return root;

  // 如果当前节点的值小于 low, 取右树
  if (root.val < low) {
    return trimBST(root.right, low, high);
  }
  // 如果当前节点的值大于 high, 取左树
  else if (root.val > high) {
    return trimBST(root.left, low, high);
  }
  // 否则当前节点的值在 (low, high) 之间, 递归左右树
  else {
    root.left = root.val === low ? null : trimBST(root.left, low, high);
    root.right = root.val === high ? null : trimBST(root.right, low, high);
    return root;
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,0,2]\n1\n2\n
// @lcpr case=end

// @lcpr case=start
// [3,0,4,null,2,null,null,1]\n1\n3\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = trimBST;
// @lcpr-after-debug-end
