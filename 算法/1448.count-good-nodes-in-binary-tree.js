/*
 * @lc app=leetcode.cn id=1448 lang=javascript
 * @lcpr version=30204
 *
 * [1448] 统计二叉树中好节点的数目
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
var goodNodes = function (root) {
  let maxList = [-Infinity],
    ans = 0;

  function dfs(node) {
    if (!node) return;

    if (node.val >= maxList.at(-1)) ans++;

    maxList.push(Math.max(node.val, maxList.at(-1)));

    dfs(node.left);
    dfs(node.right);

    maxList.pop();
  }
  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,1,4,3,null,1,5]\n
// @lcpr case=end

// @lcpr case=start
// [3,3,null,4,2]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */
