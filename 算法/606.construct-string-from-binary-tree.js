/*
 * @lc app=leetcode.cn id=606 lang=javascript
 * @lcpr version=30204
 *
 * [606] 根据二叉树创建字符串
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
var tree2str = function (root) {
  function dfs(root) {
    // 节点为空, 则返回
    if (!root) return '';

    // 先处理当前节点的
    let ans = String(root.val);

    // 如果没有左右子节点, 直接返回
    if (!root.left && !root.right) return ans;

    // 左节点直接递归
    ans += `(${dfs(root.left)})`;

    // 只有当右节点存在时, 才需要添加
    if (root.right) ans += `(${dfs(root.right)})`;

    return ans;
  }

  return dfs(root);
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,null,null,5]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,null,4]\n
// @lcpr case=end

 */
