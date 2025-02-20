/*
 * @lc app=leetcode.cn id=142 lang=typescript
 * @lcpr version=30204
 *
 * [142] 环形链表 II
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

function detectCycle(head: ListNode | null): ListNode | null {
  // 时间复杂度为 O(n), 使用 Set 记录下走过的节点
  const memory = new Set();
  let cur = head;
  while (cur) {
    if (memory.has(cur)) return cur;
    memory.add(cur);

    cur = cur.next;
  }

  return null;
}
// @lc code=end

/*
// @lcpr case=start
// [3,2,0,-4]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n0\n
// @lcpr case=end

// @lcpr case=start
// [1]\n-1\n
// @lcpr case=end

 */
