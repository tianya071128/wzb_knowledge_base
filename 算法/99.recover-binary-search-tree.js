/*
 * @lc app=leetcode.cn id=99 lang=javascript
 * @lcpr version=30204
 *
 * [99] 恢复二叉搜索树
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
 * @return {void} Do not return anything, modify root in-place instead.
 */
var recoverTree = function (root) {
  /**
   * 解题思路: 问题的关键找出二个错误的节点
   *  1. 第一个错误的节点: 只要当前节点比下一个要遍历的节点的值要大(不符合条件)即可判定为错误节点
   *  2. 第二个错误的节点:
   *      2.1 以第一个错误的节点为当前位置, 比上一个节点的值要大, 比下一个节点的值要小, 那么就可以判定为错误节点
   */

  const queue = [];

  function bfs(root) {
    if (!root) return;

    bfs(root.left);

    queue.push(root);

    bfs(root.right);
  }

  bfs(root);

  // 遍历队列, 找出错误节点
  let firstNode;
  for (let index = 0; index < queue.length; index++) {
    const item = queue[index];

    // 找到第一个错误节点
    if (!firstNode) {
      if (item.val > (queue[index + 1]?.val ?? Infinity)) firstNode = item;
    }
    // 找到第二个错误节点
    else {
      if (
        firstNode.val < (queue[index + 1]?.val ?? Infinity) &&
        firstNode.val >= queue[index - 1]?.val
      ) {
        [item.val, firstNode.val] = [firstNode.val, item.val];
      }
    }
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,3,null,null,2]\n
// @lcpr case=end

// @lcpr case=start
// [3,1,4,null,null,2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = recoverTree;
// @lcpr-after-debug-end
