/*
 * @lc app=leetcode.cn id=958 lang=javascript
 * @lcpr version=30204
 *
 * [958] 二叉树的完全性检验
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
var isCompleteTree = function (root) {
  /**
   * 层次遍历: 使用 null 来填充空节点
   */
  let level = 0,
    queue = [root];

  while (queue.length) {
    let cur = [];
    for (const node of queue) {
      // 如果右节点不存在, 但是 cur 存在节点, 说明右空位没有填充
      if (!node.right && cur.length) return false;

      node.right && cur.push(node.right);

      // 同理 --> 如果左节点不存在, 但是 cur 存在节点, 说明左空位没有填充
      if (!node.left && cur.length) return false;

      node.left && cur.push(node.left);
    }

    // 如果当前层级存在节点并且上一层级没有填满的话, 说明上一层级的节点没有填满
    if (cur.length && queue.length !== 2 ** level) return false;

    queue = cur;
    level++;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5,6]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,null,7]\n
// @lcpr case=end

 */
