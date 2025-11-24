/*
 * @lc app=leetcode.cn id=993 lang=javascript
 * @lcpr version=30204
 *
 * [993] 二叉树的堂兄弟节点
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
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
var isCousins = function (root, x, y) {
  /**
   * 层序遍历
   */
  let queue = [root];
  while (queue.length) {
    let cur = [],
      prevIndex = -1;

    for (let i = 0; i < queue.length; i++) {
      const node = queue[i];

      if (!node) continue;

      if (node.val === x || node.val === y) {
        // 如果已经匹配了的话
        if (prevIndex !== -1) {
          return i - prevIndex !== 1 || i % 2 === 0;
        } else {
          prevIndex = i;
        }
      }

      if (node.left || node.right) {
        cur.push(node.left, node.right);
      }
    }

    if (prevIndex !== -1) return false;
    queue = cur;
  }
  return false;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n4\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,null,4,null,5]\n5\n4\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,null,4]\n2\n3\n
// @lcpr case=end

 */
