/*
 * @lc app=leetcode.cn id=897 lang=javascript
 * @lcpr version=30204
 *
 * [897] 递增顺序搜索树
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
 * @return {TreeNode}
 */
var increasingBST = function (root) {
  let ans, prev;

  function dfs(node) {
    if (!node) return;

    dfs(node.left);

    let cur = new TreeNode(node.val);
    if (!prev) {
      prev = cur;
      ans = prev;
    } else {
      prev.right = cur;
      prev = cur;
    }

    dfs(node.right);
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [5,3,6,2,4,null,8,1,null,null,null,7,9]\n
// @lcpr case=end

// @lcpr case=start
// [5,1,7]\n
// @lcpr case=end

 */
