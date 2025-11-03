/*
 * @lc app=leetcode.cn id=988 lang=javascript
 * @lcpr version=30204
 *
 * [988] 从叶结点开始的最小字符串
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
 * @return {string}
 */
var smallestFromLeaf = function (root) {
  /**
   * 前序遍历
   */
  let ans = '',
    paths = '';

  function dfs(node) {
    if (!node) return;

    // 先在路径上添加当前节点
    paths = String.fromCharCode('a'.charCodeAt() + node.val) + paths;

    // 到达叶节点
    if (!node.left && !node.right) {
      if (!ans || paths < ans) ans = paths;
    } else {
      dfs(node.left);
      dfs(node.right);
    }

    // 当前路径上退出当前节点
    paths = paths.slice(1);
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [0,1,2,3,4,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [25,1,3,1,3,0,2]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,1,null,1,0,null,0]\n
// @lcpr case=end

 */
