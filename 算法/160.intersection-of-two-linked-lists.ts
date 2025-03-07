/*
 * @lc app=leetcode.cn id=160 lang=typescript
 * @lcpr version=30204
 *
 * [160] 相交链表
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

function getIntersectionNode(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  // 思路: hash 记录下第一个链表的节点, 接着遍历第二个链表, 判断 hash 中是否存在
  let cur = headA,
    hash = new Set<ListNode>();

  while (cur) {
    hash.add(cur);
    cur = cur.next;
  }

  cur = headB;
  while (cur) {
    if (hash.has(cur)) return cur;

    cur = cur.next;
  }

  return null;
}
// @lc code=end

/*
// @lcpr case=start
// 8\n[4,1,8,4,5]\n[5,6,1,8,4,5]\n2\n3\n
// @lcpr case=end

// @lcpr case=start
// 2\n[1,9,1,2,4]\n[3,2,4]\n3\n1\n
// @lcpr case=end

// @lcpr case=start
// 0\n[2,6,4]\n[1,5]\n3\n2\n
// @lcpr case=end

 */
