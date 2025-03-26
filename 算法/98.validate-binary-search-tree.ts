/*
 * @lc app=leetcode.cn id=98 lang=typescript
 * @lcpr version=30204
 *
 * [98] 验证二叉搜索树
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function isValidBST(root: TreeNode | null): boolean {
  // 根据下述特性, 中序遍历
  // 对于根节点，左子树中所有节点的值 < 根节点的值 < 右子树中所有节点的值。
  // 任意节点的左、右子树也是二叉搜索树，即同样满足条件 1

  let ans = true; // 结果
  let curVal = -Infinity;

  function bfs(
    node: TreeNode | null,
    parentVal?: number,
    position?: 'left' | 'right'
  ) {
    if (!node || ans === false) return;

    // 左节点
    bfs(node.left, node.val, 'left');

    // 判断当前节点是否符合条件
    if (
      !(
        node.val > curVal &&
        ((parentVal != undefined &&
          position === 'left' &&
          node.val < parentVal) ||
          (parentVal != undefined &&
            position === 'right' &&
            node.val > parentVal))
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
}
// @lc code=end

/*
// @lcpr case=start
// [2,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [5,1,4,null,null,3,6]\n
// @lcpr case=end

 */
