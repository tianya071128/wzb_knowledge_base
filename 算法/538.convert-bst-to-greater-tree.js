/*
 * @lc app=leetcode.cn id=538 lang=javascript
 * @lcpr version=30204
 *
 * [538] 把二叉搜索树转换为累加树
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
var convertBST = function (root) {
  /**
   * 遍历: 右节点 -> 节点 -> 左节点, 遍历过程中计算 sum, 即为当前节点的值
   */
  let sum = 0;
  function dfs(root) {
    if (!root) return;

    dfs(root.right);

    // 处理当前节点
    sum += root.val;
    root.val = sum;

    dfs(root.left);
  }
  dfs(root);

  return root;
};
// @lc code=end

/*
// @lcpr case=start
// [4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]\n
// @lcpr case=end

// @lcpr case=start
// [0,null,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,0,2]\n
// @lcpr case=end

// @lcpr case=start
// [3,2,4,1]\n
// @lcpr case=end

 */
