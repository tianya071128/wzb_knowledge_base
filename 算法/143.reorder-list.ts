/*
 * @lc app=leetcode.cn id=143 lang=typescript
 * @lcpr version=30204
 *
 * [143] 重排链表
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

/**
 Do not return anything, modify head in-place instead.
 */
function reorderList(head: ListNode | null): void {
  /**
   * 使用数组辅助, 在双指针数组迭代重排
   */
  let list: any[] = [];
  let cur = head;
  while (cur) {
    list.push(cur);
    cur = cur.next;
  }

  // 迭代数组
  let left = 0,
    right = list.length - 1;
  while (right >= left) {
    if (left === right) {
      list[left].next = null;
      break;
    }

    list[left].next = list[right];

    // 左指针先进一位
    left++;

    list[right].next = left < right ? list[left] : null;

    right--;
  }
}
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

 */
