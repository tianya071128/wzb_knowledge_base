/*
 * @lc app=leetcode.cn id=92 lang=typescript
 * @lcpr version=30204
 *
 * [92] 反转链表 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function reverseBetween(
  head: ListNode | null,
  left: number,
  right: number
): ListNode | null {
  if (left === right) return head;

  /**
   * 解决关键在于, 如何交互位置
   */

  let dummy = new ListNode(0, head),
    cur = dummy;

  for (let i = 1; i < left; i++) {
    cur = cur.next;
  }

  let prev = cur,
    first = prev.next,
    temp = first;

  cur = first.next;

  for (let i = 1; i <= right - left; i++) {
    const item = cur;
    cur = cur.next;
    item.next = temp;
    temp = item;
  }

  // 处理最后一个节点
  first.next = cur;
  prev.next = temp;

  return dummy.next;
}
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n2\n4\n
// @lcpr case=end

// @lcpr case=start
// [5]\n1\n1\n
// @lcpr case=end

 */
