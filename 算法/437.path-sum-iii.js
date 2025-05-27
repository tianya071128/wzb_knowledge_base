/*
 * @lc app=leetcode.cn id=437 lang=javascript
 * @lcpr version=30204
 *
 * [437] 路径总和 III
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
 * 优化空间: 前缀和
 *  假设一条路径为 [10, 3, 5] --> 目标为 8
 *
 *    1. 得出前缀和 [10, 13, 18]
 *    2. 将 前缀和 - 8, 判断该结果是否在前缀和中
 *    3. why? -- 当将 该项的前缀和 - 目标值 时, 如果得出的结果在前缀和结果中...
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
var pathSum = function (root, targetSum) {
  /**
   * 分治 - 左右子节点分别处理
   */
  let ans = 0;
  function dfs(root, paths) {
    // 直接返回
    if (!root) return;

    paths = [...paths.map((item) => item + root.val), root.val];
    // 则表示满足条件
    paths.forEach((item) => {
      if (item === targetSum) ans++;
    });

    dfs(root.left, paths);
    dfs(root.right, paths);
  }
  dfs(root, []);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [0,1,1]\n8\n
// @lcpr case=end

// @lcpr case=start
// [5,4,8,11,null,13,4,7,2,null,null,5,1]\n22\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = pathSum;
// @lcpr-after-debug-end
