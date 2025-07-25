/*
 * @lc app=leetcode.cn id=572 lang=javascript
 * @lcpr version=30204
 *
 * [572] 另一棵树的子树
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
 * 优化: 使用单个遍历即可的, 空节点使用 # 替代, 这样可以保证单个遍历就可以判断唯一
 * @param {TreeNode} root
 * @param {TreeNode} subRoot
 * @return {boolean}
 */
var isSubtree = function (root, subRoot) {
  /**
   * 分治:
   *  1. 首先先序遍历和中序遍历 subRoot 组装成字符串
   *  2. 分治处理 root
   */
  let subRootDfs = dfs(subRoot),
    str1 = subRootDfs[0], // 先序遍历
    str2 = subRootDfs[1]; // 中序遍历

  function dfs(node) {
    if (!node) return ['', ''];

    let left = dfs(node.left);
    let right = dfs(node.right);

    // 先序和中序
    return [
      `${node.val},${left[0]},${right[0]}`,
      `${left[1]},${node.val},${right[1]}`,
    ];
  }

  let flag = false;

  function dfs2(node) {
    if (!node || flag) return ['', ''];

    let left = dfs2(node.left);
    let right = dfs2(node.right);

    // 先序和中序
    const res = [
      `${node.val},${left[0]},${right[0]}`,
      `${left[1]},${node.val},${right[1]}`,
    ];

    if (res[0] === str1 && res[1] === str2) {
      flag = true;
    }

    return res;
  }
  dfs2(root);

  return flag;
};
// @lc code=end

/*
// @lcpr case=start
// [3,4,5,1,2]\n[4,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [3,4,5,1,2,null,null,null,null,0]\n[4,1,2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isSubtree;
// @lcpr-after-debug-end
