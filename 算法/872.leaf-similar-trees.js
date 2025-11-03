/*
 * @lc app=leetcode.cn id=872 lang=javascript
 * @lcpr version=30204
 *
 * [872] 叶子相似的树
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
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {boolean}
 */
var leafSimilar = function (root1, root2) {
  /**
   * 找出树的叶子节点进行比较即可
   */
  let arr1 = getLeafNodes(root1),
    arr2 = getLeafNodes(root2);

  function getLeafNodes(node) {
    let ans = [];

    function dfs(node) {
      if (!node) return;

      if (!node.left && !node.right) {
        ans.push(node.val);

        return;
      }

      dfs(node.left);
      dfs(node.right);
    }

    dfs(node);

    return ans;
  }

  return (
    arr1.length === arr2.length && arr1.every((item, i) => item === arr2[i])
  );
};
// @lc code=end

/*
// @lcpr case=start
// [3,5,1,6,2,9,8,null,null,7,4]\n[3,5,1,6,7,4,2,null,null,null,null,null,null,9,8]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n[1,3,2]\n
// @lcpr case=end

 */
