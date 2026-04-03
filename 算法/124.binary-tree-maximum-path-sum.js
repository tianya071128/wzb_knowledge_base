/*
 * @lc app=leetcode.cn id=124 lang=javascript
 * @lcpr version=30204
 *
 * [124] 二叉树中的最大路径和
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
var maxPathSum = function (root) {
  let ans = -Infinity;
  function dfs(node) {
    if (!node) return 0;

    let leftVal = dfs(node.left);
    let rightVal = dfs(node.right);

    ans = Math.max(ans, node.val + leftVal + rightVal);

    return Math.max(0, node.val + leftVal, node.val + rightVal);
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [-10,9,20,null,null,15,7]\n
// @lcpr case=end

 */
