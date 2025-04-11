/*
 * @lc app=leetcode.cn id=328 lang=javascript
 * @lcpr version=30204
 *
 * [328] 奇偶链表
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
var oddEvenList = function (head) {
  // 先排除无需重组的链表
  if (!head?.next?.next) return head;

  let oddNode = head, // 奇数
    evenNode = head.next, // 偶数
    evenHead = head.next, // 偶数链表的开头
    cur = head.next.next; // 指向偶数指针

  while (cur) {
    const temp = cur;
    cur = cur?.next?.next; // 重新指针

    oddNode.next = temp;
    oddNode = temp;

    evenNode.next = temp.next;
    evenNode = temp.next;

    // 重新链接奇数和偶数链表
    temp.next = evenHead;
  }

  return head;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [2,1,3,5,6,4,7]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = oddEvenList;
// @lcpr-after-debug-end
