/*
 * @lc app=leetcode.cn id=938 lang=javascript
 * @lcpr version=30204
 *
 * [938] 二叉搜索树的范围和
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
 * @return {number}
 */
var rangeSumBST = function (root, low, high) {
  let ans = 0;
  function dfs(node) {
    if (!node) return;

    if (node.val > low) dfs(node.left);

    if (node.val >= low && node.val <= high) ans += node.val;

    if (node.val < high) dfs(node.right);
  }

  dfs(root);
  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [10,5,15,3,7,null,18]\n7\n15\n
// @lcpr case=end

// @lcpr case=start
// [10,5,15,3,7,13,18,1,null,6]\n6\n10\n
// @lcpr case=end

 */
