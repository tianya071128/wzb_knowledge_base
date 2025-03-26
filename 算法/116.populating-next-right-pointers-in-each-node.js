/*
 * @lc app=leetcode.cn id=116 lang=javascript
 * @lcpr version=30204
 *
 * [116] 填充每个节点的下一个右侧节点指针
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
  /**
   * 使用递归:
   *  当处理某个节点时, 那么父节点的next 已经建立好了链接, 就可以通过这个链接找到当前节点的 next节点
   */
  function dfs(root, parent, position) {
    if (!root) return;

    // 根节点
    if (!parent) {
      root.next = null;
    }
    // 当前为左树, 那么下一个节点为父节点的右节点
    else if (position === 'left') {
      root.next = parent.right;
    }
    // 当前为右树, 那么下一个节点为父节点的next节点的左节点
    else {
      root.next = parent.next?.left ?? null;
    }

    // 处理左右子节点
    dfs(root.left, root, 'left');
    dfs(root.right, root, 'right');
  }

  dfs(root);

  return root;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5,6,7]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

 */
