/*
 * @lc app=leetcode.cn id=783 lang=javascript
 * @lcpr version=30204
 *
 * [783] 二叉搜索树节点最小距离
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
var minDiffInBST = function (root) {
  /** 中序遍历 */
  let prev = -Infinity,
    ans = Infinity; // 前一个值

  function dfs(node) {
    // 最小差值为 1
    if (ans === 1 || !node) return;

    dfs(node.left);

    // 当前节点计算
    ans = Math.min(node.val - prev, ans);
    prev = node.val;

    dfs(node.right);
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [4,2,6,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,null,48,12]\n
// @lcpr case=end

 */
