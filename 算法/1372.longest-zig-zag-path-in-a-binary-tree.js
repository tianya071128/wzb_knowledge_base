/*
 * @lc app=leetcode.cn id=1372 lang=javascript
 * @lcpr version=30204
 *
 * [1372] 二叉树中的最长交错路径
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
var longestZigZag = function (root) {
  /**
   * 每个节点都返回一下, 左侧和右侧出发的交错节点数量
   */

  let ans = 0;

  function dfs(node) {
    if (!node) return [0, 0];

    let left = 1 + dfs(node.left)[1],
      right = 1 + dfs(node.right)[0];

    ans = Math.max(left, right, ans);

    return [left, right];
  }

  dfs(root);

  return Math.max(0, ans - 1);
};
// @lc code=end

/*
// @lcpr case=start
// [1,null,1,1,1,null,null,1,1,null,1,null,null,null,1,null,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,null,1,null,null,1,1,null,1]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */
