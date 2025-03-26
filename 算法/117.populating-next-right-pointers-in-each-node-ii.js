/*
 * @lc app=leetcode.cn id=117 lang=javascript
 * @lcpr version=30204
 *
 * [117] 填充每个节点的下一个右侧节点指针 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * // Definition for a _Node.
 * function _Node(val, left, right, next) {
 *    this.val = val === undefined ? null : val;
 *    this.left = left === undefined ? null : left;
 *    this.right = right === undefined ? null : right;
 *    this.next = next === undefined ? null : next;
 * };
 */

/**
 * @param {_Node} root
 * @return {_Node}
 */
var connect = function (root) {
  // 与 116. 填充每个节点的下一个右侧节点指针 基本上一致
  // 只是找到下一个节点的逻辑不同

  if (!root) return root;

  // 找下一个节点的方法
  function getNext(root) {
    if (!root) return null;

    return root.left ?? root.right ?? getNext(root.next);
  }

  function dfs(root) {
    if (!root) return;

    if (root.left) {
      root.left.next = root.right ?? getNext(root.next);
    }

    if (root.right) {
      root.right.next = getNext(root.next);
    }

    // 先处理右节点, 在处理左节点, 这样处理左节点的时候, 右节点都已经建立好了 next 链接
    dfs(root.right);
    dfs(root.left);
  }

  dfs(root);

  return root;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,null,6,7, 8, null, null, null, null, null, null, 9]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

 */
