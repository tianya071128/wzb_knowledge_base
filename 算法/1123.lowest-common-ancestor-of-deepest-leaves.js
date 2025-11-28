/*
 * @lc app=leetcode.cn id=1123 lang=javascript
 * @lcpr version=30204
 *
 * [1123] 最深叶节点的最近公共祖先
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
 * @return {TreeNode}
 */
var lcaDeepestLeaves = function (root) {
  /**
   * 深度搜索:
   *  搜索搜索时, 判断左右子树的最大深度, 如果深度一致的话, 那么当前节点就是最近公共祖先
   *  重复上述操作, 直至根节点
   */
  let ans = null,
    maxLevel = -1;
  function dfs(node, level = -1) {
    if (!node) return level;

    // 叶节点
    let leftLevel = dfs(node.left, level + 1);
    let rightLevel = dfs(node.right, level + 1);

    // 命中结果
    if (leftLevel === rightLevel && leftLevel >= maxLevel) {
      ans = node;
      maxLevel = leftLevel;
    }

    return Math.max(leftLevel, rightLevel);
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,5,1,6,2,0,8,null,null,7,4]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,3,null,2]\n
// @lcpr case=end

 */
