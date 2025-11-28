/*
 * @lc app=leetcode.cn id=1145 lang=javascript
 * @lcpr version=30204
 *
 * [1145] 二叉树着色游戏
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
 * @param {number} n
 * @param {number} x
 * @return {boolean}
 */
var btreeGameWinningMove = function (root, n, x) {
  /**
   * 贪心:
   *  当先手选择了 x 时, 那么我们只能有三种选择情况
   *   - 选择 x 的父节点 --> 此时先手就会占据 x 节点及其子树
   *   - 选择 x 的左子树 --> 此时先手就会占据 x 的父节点以及右子树
   *   - 选择 x 的右子树 --> 此时先手就会占据 x 的父节点以及左子树
   */
  let ans = 0,
    flag = false; // 已经找到 x 节点并处理完成其左右子树的数量

  function dfs(node) {
    if (!node || flag) return 0;

    let leftCount = dfs(node.left),
      rightCount = dfs(node.right);

    // 命中
    if (node.val === x) {
      ans = Math.max(leftCount, rightCount, n - 1 - leftCount - rightCount);
      flag = true;
    }

    return leftCount + rightCount + 1;
  }

  dfs(root);

  return ans > n / 2;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,null,4,5,6,7,8,9,null,10,11]\n11\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n3\n1\n
// @lcpr case=end

 */
