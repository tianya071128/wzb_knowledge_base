/*
 * @lc app=leetcode.cn id=107 lang=javascript
 * @lcpr version=30204
 *
 * [107] 二叉树的层序遍历 II
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
 * @return {number[][]}
 */
var levelOrderBottom = function (root) {
  if (!root) return [];

  let level = [root],
    ans = [];
  while (level.length) {
    ans.push(level.map((item) => item.val));

    level = level.reduce(
      (total, item) => [
        ...total,
        ...[item.left, item.right].filter((item) => !!item),
      ],
      []
    );
  }

  return ans.reverse();
};
// @lc code=end

/*
// @lcpr case=start
// [3,9,20,null,null,15,7]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

 */
