/*
 * @lc app=leetcode.cn id=94 lang=javascript
 * @lcpr version=30204
 *
 * [94] 二叉树的中序遍历
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
 * @return {number[]}
 */
var inorderTraversal = function (root) {
  if (!root) return [];

  /**
   * 二叉树的中序遍历: 中序遍历是二叉树遍历的一种，也叫做中根遍历、中序周游。在二叉树中，中序遍历首先遍历左子树，然后访问根结点，最后遍历右子树。
   */

  // 递归算法
  // const res = [];
  // function traversal(node) {
  //   if (node.left !== null) traversal(node.left);

  //   res.push(node.val);

  //   if (node.right !== null) traversal(node.right);
  // }

  // traversal(root);

  // return res;

  // 迭代算法 - 使用栈, 关键是需要标识是往树下面走, 还是树上面归 --> 也就是上一个动作是入栈还是出栈的动作
  let stack = [root],
    direction = 1,
    res = [];
  while (stack.length) {
    let top = stack.at(-1);

    // 栈顶节点不存在左侧节点, 出栈
    if (top.left === null) {
      res.push(stack.pop().val);
      direction = -1;
      // 此时如果存在右侧节点, 入栈
      if (top.right !== null) {
        stack.push(top.right);
        direction = 1;
      }
    }
    // 上一个动作是出栈, 那么将栈顶出栈
    else if (direction < 0) {
      res.push(stack.pop().val);
      // 此时如果存在右侧节点, 入栈
      if (top.right !== null) {
        stack.push(top.right);
        direction = 1;
      }
    }
    // 否则进行入栈操作
    else {
      stack.push(top.left);
    }
  }

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [1,null,2,3]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = inorderTraversal;
// @lcpr-after-debug-end
