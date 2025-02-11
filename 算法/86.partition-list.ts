/*
 * @lc app=leetcode.cn id=86 lang=typescript
 * @lcpr version=30204
 *
 * [86] 分隔链表
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
function partition(head: ListNode | null, x: number): ListNode | null {
  let dummy = new ListNode(0, head), // 哑节点
    prev = dummy,
    cur = dummy;

  while (cur) {
    // 交互位置
    if (cur.next && cur.next.val < x) {
      if (prev !== cur) {
        const swap = cur.next;
        cur.next = swap.next;
        swap.next = prev.next;
        prev.next = swap;

        // 重置变量
        prev = swap;
      } else {
        prev = cur = cur.next;
      }
    } else {
      cur = cur.next;
    }
  }

  return dummy.next;
}
// @lc code=end

/*
// @lcpr case=start
// [1,4,3,2,5,2]\n3\n
// @lcpr case=end

// @lcpr case=start
// [2,1]\n2\n
// @lcpr case=end

 */
