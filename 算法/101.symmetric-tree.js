/*
 * @lc app=leetcode.cn id=101 lang=javascript
 * @lcpr version=30204
 *
 * [101] 对称二叉树
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
 * @return {boolean}
 */
var isSymmetric = function (root) {
  // 与相同二叉树类似, 但是是左树对右树比较
  function isSameTree(p, q) {
    if (p === null && q === null) return true;

    return (
      p?.val === q?.val &&
      isSameTree(p.left, q.right) &&
      isSameTree(p.right, q.left)
    );
  }

  return isSameTree(root?.left, root?.right);
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,2,3,4,4,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,2,null,3,null,3]\n
// @lcpr case=end

 */
