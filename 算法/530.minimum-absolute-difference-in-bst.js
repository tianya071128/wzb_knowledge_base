/*
 * @lc app=leetcode.cn id=530 lang=javascript
 * @lcpr version=30204
 *
 * [530] 二叉搜索树的最小绝对差
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
 * 优化优化: 直接中序遍历就完事了的, 因为正好是升序遍历
 *
 * @param {TreeNode} root
 * @return {number}
 */
var getMinimumDifference = function (root) {
  /**
   * 二叉搜索树: 左子树的值要小于根节点, 右子树的值要大于根节点
   *
   * 所以找到左子树中最大的值跟根节点比较，右子树中最小的值跟根节点比较
   *
   * 分治处理上述步骤
   */
  let ans = Infinity;

  function dfs(node) {
    if (!node) return [Infinity, -Infinity];

    // 找到左子树中
    let leftVal = dfs(node.left);
    let rightVal = dfs(node.right);

    ans = Math.min(
      ans,
      Math.abs(node.val - leftVal[1]),
      Math.abs(node.val - rightVal[0])
    );

    return [Math.min(node.val, leftVal[0]), Math.max(node.val, rightVal[1])];
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [100,2,1006,null,80]\n
// @lcpr case=end

// @lcpr case=start
// [1,0,48,null,null,12,49]\n
// @lcpr case=end

 */
