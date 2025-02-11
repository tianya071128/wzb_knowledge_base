/*
 * @lc app=leetcode.cn id=82 lang=typescript
 * @lcpr version=30204
 *
 * [82] 删除排序链表中的重复元素 II
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

function deleteDuplicates(head: ListNode | null): ListNode | null {
  const virtual = new ListNode(0, null); // 建立虚拟头
  let prev = virtual,
    current = head;

  while (current) {
    let flag = false,
      num = current.val;

    while (current.next?.val === num) {
      flag = true;
      current = current.next;
    }

    if (!flag) {
      prev.next = current;
      prev = current;
    } else {
      prev.next = null;
    }

    current = current.next;
  }

  return virtual.next;
}
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,3,4,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,2,3]\n
// @lcpr case=end

 */
