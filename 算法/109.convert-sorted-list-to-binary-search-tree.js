/*
 * @lc app=leetcode.cn id=109 lang=javascript
 * @lcpr version=30204
 *
 * [109] 有序链表转换二叉搜索树
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function (head) {
  /**
   * 分治法: 中间元素作为根, 左边作为左树, 右边元素作为右树
   *  1. 将链表转为数组, 便于操作
   *  2. 分治处理数组
   */
  const list = [];
  while (head) {
    list.push(head);
    head = head.next;
  }

  function dfs(list) {
    if (!list.length) return null;

    const mid = Math.floor(list.length / 2);
    const root = new TreeNode(list[mid].val);

    // 构造左侧
    root.left = dfs(list.slice(0, mid));
    // 构造右侧
    root.right = dfs(list.slice(mid + 1));

    return root;
  }

  return dfs(list);
};
// @lc code=end

/*
// @lcpr case=start
// [-10,-3,0,5,9]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

 */
