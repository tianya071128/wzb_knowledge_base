/*
 * @lc app=leetcode.cn id=1022 lang=javascript
 * @lcpr version=30204
 *
 * [1022] 从根到叶的二进制数之和
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
var sumRootToLeaf = function (root) {
  /**
   * 深度搜索
   */
  let pathsSum = 0,
    ans = 0;

  function dfs(node) {
    if (!node) return;

    pathsSum = pathsSum * 2 + node.val;

    if (!node.left && !node.right) {
      ans += pathsSum;
    } else {
      dfs(node.left);
      dfs(node.right);
    }

    pathsSum = Math.floor(pathsSum / 2);
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,0,1,0,1,0,1,0,1,0,1,1,0,1,0]\n
// @lcpr case=end

// @lcpr case=start
// [0]\n
// @lcpr case=end

 */
