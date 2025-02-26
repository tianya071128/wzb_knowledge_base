/*
 * @lc app=leetcode.cn id=147 lang=typescript
 * @lcpr version=30204
 *
 * [147] 对链表进行插入排序
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

function insertionSortList(head: ListNode | null): ListNode | null {
  /**
   * 此方法无需反转的, 没必要, 内层遍历直接从头部开始遍历
   * 被题目描述的动画绕进去了
   *
   * 已排序的列表进行反转
   */
  let dummy = new ListNode(-Infinity, null),
    reverseHead = new ListNode(Infinity, dummy), // 反转后的头节点
    cur = head;

  while (cur) {
    const node = cur; // 当前操作节点
    cur = cur.next; // 下一个需要操作的节点, 先进行赋值

    // 迭代反转后的节点
    let reverseCur = reverseHead;
    while (reverseCur) {
      // 插入
      if (node.val >= reverseCur.next.val) {
        node.next = reverseCur.next;
        reverseCur.next = node;
        break;
      }

      reverseCur = reverseCur.next;
    }
  }

  // 在将反转后的链表反转回来
  let prev: ListNode;
  cur = reverseHead.next;
  while (cur) {
    const node = cur;
    cur = cur.next;

    node.next = prev ?? null;
    prev = node;
  }

  return dummy.next;
}
// @lc code=end

/*
// @lcpr case=start
// [4,2,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [-1,5,3,4,0]\n
// @lcpr case=end

 */
