/*
 * @lc app=leetcode.cn id=129 lang=javascript
 * @lcpr version=30204
 *
 * [129] 求根节点到叶节点数字之和
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
var sumNumbers = function (root) {
  // 先序遍历
  let total = 0;

  function dfs(root, preNum) {
    if (!root) return;

    // 加上当前节点组成的数字
    preNum = preNum * 10 + root.val;

    // 叶节点
    if (!root.left && !root.right) {
      total += preNum;
    }

    dfs(root.left, preNum);
    dfs(root.right, preNum);
  }

  dfs(root, 0);

  return total;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [4,9,0,5,1]\n
// @lcpr case=end

 */
