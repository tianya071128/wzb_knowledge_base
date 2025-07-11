/*
 * @lc app=leetcode.cn id=687 lang=javascript
 * @lcpr version=30204
 *
 * [687] 最长同值路径
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
var longestUnivaluePath = function (root) {
  let ans = 0;

  function dfs(node, parentVal) {
    if (!node) return 0;

    // 分治: 处理左右子树
    let leftLen = dfs(node.left, node.val);
    let rightLen = dfs(node.right, node.val);
    let totalLen = leftLen + rightLen + 1; // 加上当前节点

    ans = Math.max(ans, totalLen - 1);

    // 如果节点值与父节点相同, 则取左右子树最大值的一个返回
    return node.val === parentVal ? Math.max(leftLen, rightLen) + 1 : 0;
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [5,4,5,1,1,5]\n
// @lcpr case=end

// @lcpr case=start
// [1,4,5,4,4,5,null,4,4,null,4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = longestUnivaluePath;
// @lcpr-after-debug-end