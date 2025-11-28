/*
 * @lc app=leetcode.cn id=1110 lang=javascript
 * @lcpr version=30204
 *
 * [1110] 删点成林
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
 * @param {number[]} to_delete
 * @return {TreeNode[]}
 */
var delNodes = function (root, to_delete) {
  let hash = new Set(to_delete),
    ans = [];

  function dfs(node, parant = null) {
    if (!node) return false;
    let isDelete = hash.has(node.val);

    // 如果当前节点不需要删除, 并且父节点不存在, 就添加到结果
    if (!isDelete && !parant) {
      ans.push(node);
    }

    // 处理左树
    let isLeftDelete = dfs(node.left, isDelete ? null : node);
    // 删除左树引用
    if (isLeftDelete && !isDelete) {
      node.left = null;
    }

    // 处理右树
    let isRightDelete = dfs(node.right, isDelete ? null : node);
    // 删除左树引用
    if (isRightDelete && !isDelete) {
      node.right = null;
    }

    return isDelete;
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5,6,7]\n[3,6]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,4,null,3]\n[3]\n
// @lcpr case=end

 */
