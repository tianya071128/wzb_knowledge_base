/*
 * @lc app=leetcode.cn id=404 lang=javascript
 * @lcpr version=30204
 *
 * [404] 左叶子之和
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
var sumOfLeftLeaves = function (root, isLeft = false) {
  // 递归
  if (!root) return 0;

  // 判定为左子叶子
  if (isLeft && !root.left && !root.right) return root.val;

  return sumOfLeftLeaves(root.left, true) + sumOfLeftLeaves(root.right);
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */
