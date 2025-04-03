/*
 * @lc app=leetcode.cn id=236 lang=javascript
 * @lcpr version=30204
 *
 * [236] 二叉树的最近公共祖先
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
  // 找到 p、q 的路径,之后在比较两个路径的公共节点
  function getPaths(root, target, paths) {
    if (!root) return;

    // 将当前节点添加至路径
    paths.push(root);

    if (target.val === root.val) {
      return [...paths];
    }

    let leftRes = getPaths(root.left, target, paths);

    if (leftRes) return leftRes;

    let rightRes = getPaths(root.right, target, paths);

    if (rightRes) return rightRes;

    paths.pop();
  }

  const path1 = getPaths(root, p, []);
  const path2 = getPaths(root, q, []);
  let cur = 0;

  while (path1[cur] === path2[cur]) {
    cur++;
  }

  return path1[cur - 1];
};
// @lc code=end

/*
// @lcpr case=start
// [3,5,1,6,2,0,8,null,null,7,4]\n5\n1\n
// @lcpr case=end

// @lcpr case=start
// [3,5,1,6,2,0,8,null,null,7,4]\n5\n4\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n1\n2\n
// @lcpr case=end

 */
