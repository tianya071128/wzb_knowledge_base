/*
 * @lc app=leetcode.cn id=98 lang=javascript
 * @lcpr version=30204
 *
 * [98] 验证二叉搜索树
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
 * @return {boolean}
 */
var isValidBST = function (root) {
  // 根据下述特性, 中序遍历
  // 对于根节点，左子树中所有节点的值 < 根节点的值 < 右子树中所有节点的值。
  // 任意节点的左、右子树也是二叉搜索树，即同样满足条件 1

  let ans = true; // 结果
  let curVal = -Infinity;

  // 可以使用 while 实现递归, 而不是 函数

  function bfs(node, parentVal, position) {
    if (!node || ans === false) return;

    // 左节点
    bfs(node.left, node.val, 'left');

    // 判断当前节点是否符合条件
    if (
      !(
        node.val > curVal &&
        // 没有必要使用左右节点与父节点进行比较的
        // 因为当使用中序遍历时, 二叉搜索树一定是数字顺序增加的
        (parentVal == undefined ||
          (position === 'left' && node.val < parentVal) ||
          (position === 'right' && node.val > parentVal))
      )
    ) {
      ans = false;
      return;
    }

    curVal = node.val;

    // 右节点
    bfs(node.right, node.val, 'right');
  }

  bfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [2,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [5,1,7,null,null,6,8]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isValidBST;
// @lcpr-after-debug-end
