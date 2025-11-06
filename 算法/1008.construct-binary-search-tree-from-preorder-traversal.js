/*
 * @lc app=leetcode.cn id=1008 lang=javascript
 * @lcpr version=30204
 *
 * [1008] 前序遍历构造二叉搜索树
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
 * @param {number[]} preorder
 * @return {TreeNode}
 */
var bstFromPreorder = function (preorder) {
  function dfs(l, r) {
    if (l > r) return null;

    /**
     * 关键点: 找到左右节点的交接点
     */
    let left = l + 1,
      right = r;
    while (left <= right) {
      let mid = left + Math.floor((right - left) / 2);

      // 在左区间
      if (preorder[mid] > preorder[l]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return new TreeNode(preorder[l], dfs(l + 1, left - 1), dfs(left, r));
  }

  return dfs(0, preorder.length - 1);
};
// @lc code=end

/*
// @lcpr case=start
// [8,5,1,7,10,12]\n
// @lcpr case=end

// @lcpr case=start
// [1,3]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = bstFromPreorder;
// @lcpr-after-debug-end
