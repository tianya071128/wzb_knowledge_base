/*
 * @lc app=leetcode.cn id=114 lang=javascript
 * @lcpr version=30204
 *
 * [114] 二叉树展开为链表
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
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function (root) {
  // 先使用先序遍历到所有节点
  let list = [],
    cur = root,
    quque = [];
  while (cur) {
    list.push(cur);
    quque.unshift(...[cur.left, cur.right].filter((item) => !!item));

    cur = quque.shift();
  }

  for (let i = 0; i < list.length; i++) {
    const node = list[i];

    node.left = null;
    node.right = list[i + 1] ?? null;
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,5,3,4,null,6]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

// @lcpr case=start
// [0]\n
// @lcpr case=end

 */
