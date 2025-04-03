/*
 * @lc app=leetcode.cn id=237 lang=javascript
 * @lcpr version=30204
 *
 * [237] 删除链表中的节点
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */
var deleteNode = function (node) {
  // 题目描述真的难懂 - 看这个: https://leetcode.cn/problems/delete-node-in-a-linked-list/solutions/1077517/shan-chu-lian-biao-zhong-de-jie-dian-by-x656s/
  // 也就是说待删除的节点就是这个 node
  node.val = node.next.val;
  node.next = node.next.next;
};
// @lc code=end

/*
// @lcpr case=start
// [4,5,1,9]\n5\n
// @lcpr case=end

// @lcpr case=start
// [4,5,1,9]\n1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = deleteNode;
// @lcpr-after-debug-end
