/*
 * @lc app=leetcode.cn id=559 lang=javascript
 * @lcpr version=30204
 *
 * [559] N 叉树的最大深度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * // Definition for a _Node.
 * function _Node(val,children) {
 *    this.val = val === undefined ? null : val;
 *    this.children = children === undefined ? null : children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number}
 */
var maxDepth = function (root) {
  let level = 0,
    queue = root ? [root] : [];

  while (queue.length) {
    let cur = [];
    for (const node of queue) {
      cur.push(...(node.children ?? []));
    }
    queue = cur;

    level++;
  }
  return level;
};
// @lc code=end

/*
// @lcpr case=start
// []\n
// @lcpr case=end

// @lcpr case=start
// [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxDepth;
// @lcpr-after-debug-end
