/*
 * @lc app=leetcode.cn id=876 lang=javascript
 * @lcpr version=30204
 *
 * [876] 链表的中间结点
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
 * @param {ListNode} head
 * @return {ListNode}
 */
var middleNode = function (head) {
  /** 快慢指针 */
  let fast = head, // 快指针
    slow = head; // 慢指针

  while (fast?.next) {
    fast = fast.next.next;
    slow = slow.next;
  }

  return slow;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,6]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = middleNode;
// @lcpr-after-debug-end
