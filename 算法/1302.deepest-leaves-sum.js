/*
 * @lc app=leetcode.cn id=1302 lang=javascript
 * @lcpr version=30204
 *
 * [1302] 层数最深叶子节点的和
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
 * @return {number}
 */
var deepestLeavesSum = function (root) {
  // 层序遍历
  let queue = [root];

  while (queue.length) {
    let cur = [],
      total = 0;

    for (const node of queue) {
      if (node.left) cur.push(node.left);
      if (node.right) cur.push(node.right);

      total += node.val;
    }

    // 如果没有下层节点, 则为最深层
    if (!cur.length) return total;

    queue = cur;
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5,null,6,7,null,null,null,null,8]\n
// @lcpr case=end

// @lcpr case=start
// [6,7,8,2,7,1,3,9,null,1,4,null,null,null,5]\n
// @lcpr case=end

 */
