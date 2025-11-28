/*
 * @lc app=leetcode.cn id=1315 lang=javascript
 * @lcpr version=30204
 *
 * [1315] 祖父节点值为偶数的节点和
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
var sumEvenGrandparent = function (root) {
  let ans = 0,
    paths = [];

  function dfs(node) {
    if (!node) return;

    // 满足条件
    if (paths.at(-2) % 2 === 0) {
      ans += node.val;
    }

    paths.push(node.val);

    dfs(node.left);
    dfs(node.right);

    paths.pop();
  }
  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [6,7,8,2,7,1,3,9,null,1,4,null,null,null,5]\n
// @lcpr case=end

 */
