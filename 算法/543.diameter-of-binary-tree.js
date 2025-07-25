/*
 * @lc app=leetcode.cn id=543 lang=javascript
 * @lcpr version=30204
 *
 * [543] 二叉树的直径
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
var diameterOfBinaryTree = function (root) {
  /**
   * 分治: 取到左右子树的最大直径
   */
  let ans = 0;

  function dfs(node) {
    if (!node) return 0;

    let left = dfs(node.left);
    let right = dfs(node.right);

    // 连接当前根节点比较
    ans = Math.max(left + right + 1, ans);

    return Math.max(left, right) + 1;
  }

  dfs(root);

  return ans - 1; // 取的是节点数量, 边的数量就需要减1
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n
// @lcpr case=end

 */
