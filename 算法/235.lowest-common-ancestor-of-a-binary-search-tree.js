/*
 * @lc app=leetcode.cn id=235 lang=javascript
 * @lcpr version=30204
 *
 * [235] 二叉搜索树的最近公共祖先
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  // 应该利用二叉搜索树的特性:
  //  1. 当 p、q 的值比 root 小, 那么就是在左子树下
  //  2. 当 p、q 的值比 root 大，那么就是在右子树下
  //  3. 其他情况下，公共祖先节点就是当前节点
  //      --> p、q 在 root 的树的两边, 即一大一小
  //      --> p、q 有一节点的值正好为 root, 此时也是当前节点为公共祖先节点

  if (!root) return;

  if (p.val > root.val && q.val > root.val) {
    return lowestCommonAncestor(root.right, p, q);
  }

  if (p.val < root.val && q.val < root.val) {
    return lowestCommonAncestor(root.left, p, q);
  }

  return root;

  // // 找到 p、q 的路径,之后在比较两个路径的公共节点
  // function getPaths(root, target, paths) {
  //   if (!root) return;
  //   // 将当前节点添加至路径
  //   paths.push(root);
  //   if (target.val === root.val) {
  //     return [...paths];
  //   }
  //   let leftRes = getPaths(root.left, target, paths);
  //   if (leftRes) return leftRes;
  //   let rightRes = getPaths(root.right, target, paths);
  //   if (rightRes) return rightRes;
  //   paths.pop();
  // }
  // const path1 = getPaths(root, p, []);
  // const path2 = getPaths(root, q, []);
  // let cur = 0;
  // while (path1[cur] === path2[cur]) {
  //   cur++;
  // }
  // return path1[cur - 1];
};
// @lc code=end

/*
// @lcpr case=start
// [6,2,8,0,4,7,9,null,null,3,5]\n2\n8\n
// @lcpr case=end

// @lcpr case=start
// [6,2,8,0,4,7,9,null,null,3,5]\n2\n4\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = lowestCommonAncestor;
// @lcpr-after-debug-end
