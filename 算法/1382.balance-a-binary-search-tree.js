/*
 * @lc app=leetcode.cn id=1382 lang=javascript
 * @lcpr version=30204
 *
 * [1382] 将二叉搜索树变平衡
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
var balanceBST = function (root) {
  /**
   * - 先提取出全部节点
   * - 之后重新构造树
   */
  let nodes = [];
  function dfs(node) {
    if (!node) return;

    dfs(node.left);
    nodes.push(node);
    dfs(node.right);
  }
  dfs(root);

  // 重新构造树
  function helper(l, r) {
    if (l > r) return null;

    let mid = l + Math.floor((r - l) / 2),
      node = nodes[mid];
    node.left = helper(l, mid - 1);
    node.right = helper(mid + 1, r);

    return node;
  }

  return helper(0, nodes.length - 1);
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=balanceBST
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,null,2,null,3,null,4,null,null]\n
// @lcpr case=end

// @lcpr case=start
// [2,1,3]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = balanceBST;
// @lcpr-after-debug-end
