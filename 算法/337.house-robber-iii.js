/*
 * @lc app=leetcode.cn id=337 lang=javascript
 * @lcpr version=30204
 *
 * [337] 打家劫舍 III
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
var rob = function (root) {
  const cache = new Map(); // 防止重复求值
  function dfs(root) {
    if (!root) return 0;

    // 存在记录, 直接返回
    if (cache.has(root)) return cache.get(root);

    // 否则当前节点的最大值为: MAX(当前节点盗取 + 左子树的左右子树 + 右子树的左右子树, 当前节点不盗取 + 左子树 + 右子树)
    let max = Math.max(
      root.val +
        dfs(root.left?.left) +
        dfs(root.left?.right) +
        dfs(root.right?.left) +
        dfs(root.right?.right),

      dfs(root.left) + dfs(root.right)
    );

    cache.set(root, max);

    return max;
  }

  return dfs(root);
};
// @lc code=end

/*
// @lcpr case=start
// [3,2,3,null,3,null,1]\n
// @lcpr case=end

// @lcpr case=start
// [3,4,5,1,3,null,1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = rob;
// @lcpr-after-debug-end
