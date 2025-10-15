/*
 * @lc app=leetcode.cn id=590 lang=javascript
 * @lcpr version=30204
 *
 * [590] N 叉树的后序遍历
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * // Definition for a _Node.
 * function _Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number[]}
 */
var postorder = function (root) {
  let ans = [];

  function dfs(node) {
    if (!node) return;

    node.children?.forEach((node) => {
      dfs(node);
    });

    ans.push(node.val);
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,null,3,2,4,null,5,6]\n
// @lcpr case=end

// @lcpr case=start
// [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]\n
// @lcpr case=end

 */
