/*
 * @lc app=leetcode.cn id=113 lang=javascript
 * @lcpr version=30204
 *
 * [113] 路径总和 II
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
 * @param {number} targetSum
 * @return {number[][]}
 */
var pathSum = function (root, targetSum) {
  // 回溯
  const ans = [],
    paths = [];

  function dfs(root, total) {
    // 退出条件1: 节点不存在
    if (!root) return;

    paths.push(root.val);
    total += root.val;

    // 终止条件2, 满足条件
    if (targetSum === total && !root.left && !root.right) {
      ans.push([...paths]);
    }

    // 因为节点可能是负数, 所以继续往下走, 必须走到叶子节点才行
    dfs(root.left, total);
    dfs(root.right, total);

    // 当前节点退出路径
    paths.pop();
  }

  dfs(root, 0);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [5,4,8,11,null,13,4,7,2,null,null,5,1]\n22\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n5\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n0\n
// @lcpr case=end

 */
