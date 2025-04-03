/*
 * @lc app=leetcode.cn id=230 lang=javascript
 * @lcpr version=30204
 *
 * [230] 二叉搜索树中第 K 小的元素
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
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (root, k) {
  let ans;
  // 中序遍历
  function dfs(root) {
    if (!root || ans != null) return;

    dfs(root.left, k);

    k--;
    if (k === 0) {
      ans = root.val;
    }

    dfs(root.right, k);
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,1,4,null,2]\n1\n
// @lcpr case=end

// @lcpr case=start
// [5,3,6,2,4,null,null,1]\n3\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = kthSmallest;
// @lcpr-after-debug-end
