/*
 * @lc app=leetcode.cn id=653 lang=javascript
 * @lcpr version=30204
 *
 * [653] 两数之和 IV - 输入二叉搜索树
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
 * 优化: 在遍历树的过程中处理是否存在即可的
 *
 * @param {TreeNode} root
 * @param {number} k
 * @return {boolean}
 */
var findTarget = function (root, k) {
  /**
   * 哈希存储
   */
  let hash = new Set();

  function dfs(node) {
    if (!node) return;

    hash.add(node.val);
    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);

  for (const n of hash) {
    if (k - n !== n && hash.has(k - n)) return true;
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// [5,3,6,2,4,null,7]\n9\n        
// @lcpr case=end

// @lcpr case=start
// [0,-1,2]\n0\n
// @lcpr case=end

 */
