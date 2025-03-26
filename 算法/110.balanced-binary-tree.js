/*
 * @lc app=leetcode.cn id=110 lang=javascript
 * @lcpr version=30204
 *
 * [110] 平衡二叉树
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
var isBalanced = function (root) {
  if (!root) return true;

  let ans = true;

  function dfs(root, level) {
    // 比较当前节点所组成的子树是否为平衡二叉树
    let leftLevel = root.left ? dfs(root.left, level + 1) : level;
    let rightLevel = root.right ? dfs(root.right, level + 1) : level;

    if (ans) {
      ans = Math.abs(leftLevel - rightLevel) <= 1;
    }

    return Math.max(leftLevel, rightLevel);
  }

  dfs(root, 1);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,2,3,null,null,3,4,null,null,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,2,3,3,null,null,4,4]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isBalanced;
// @lcpr-after-debug-end
