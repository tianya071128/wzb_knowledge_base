/*
 * @lc app=leetcode.cn id=222 lang=javascript
 * @lcpr version=30204
 *
 * [222] 完全二叉树的节点个数
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
var countNodes = function (root) {
  if (!root) return 0;

  let h = 0,
    lastNodeNum = 0,
    quit = false; // 退出通知
  // 先序遍历, 找到树的高度, 以及第一个没有填满子节点的节点
  function dfs(root, level) {
    if (!root || quit) {
      quit = true;
      return;
    }

    if (!root.left && !root.right) {
      if (level < h) {
        quit = true;
      } else {
        h = level;
        lastNodeNum++;
      }
      return;
    }

    dfs(root.left, level + 1);
    dfs(root.right, level + 1);
  }

  dfs(root, 1);

  return Math.max(0, 2 ** (h - 1) - 1 + lastNodeNum);
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = countNodes;
// @lcpr-after-debug-end
