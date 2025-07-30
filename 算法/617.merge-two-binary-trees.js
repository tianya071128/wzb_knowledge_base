/*
 * @lc app=leetcode.cn id=617 lang=javascript
 * @lcpr version=30204
 *
 * [617] 合并二叉树
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
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {TreeNode}
 */
var mergeTrees = function (root1, root2) {
  if (!root1 && !root2) return null;

  return new TreeNode(
    (root1?.val ?? 0) + (root2?.val ?? 0),
    mergeTrees(root1?.left, root2?.left),
    mergeTrees(root1?.right, root2?.right)
  );
};
// @lc code=end

/*
// @lcpr case=start
// [1,3,2,5]\n[2,1,3,null,4,null,7]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n[1,2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = mergeTrees;
// @lcpr-after-debug-end
