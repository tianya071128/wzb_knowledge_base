/*
 * @lc app=leetcode.cn id=148 lang=typescript
 * @lcpr version=30204
 *
 * [148] 排序链表
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
function sortList(head: ListNode | null): ListNode | null {
  // 归并排序
  if (!head || !head.next) return head;

  // 链表转数组操作
  let nums: number[] = [];
  while (head) {
    nums.push(head.val);
    head = head.next;
  }

  // 数组归并排序
  function merge(nums: number[]) {
    if (nums.length <= 1) return nums;

    let mid = Math.floor(nums.length / 2),
      left = nums.slice(0, mid),
      right = nums.slice(mid, nums.length);

    // 递归处理 left、right
    left = merge(left);
    right = merge(right);

    // 合并左右
    let i = 0,
      j = 0,
      k = 0,
      res: number[] = [];
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        res[k++] = left[i++];
      } else {
        res[k++] = right[j++];
      }
    }

    // 处理剩余元素
    res.push(
      ...[...left.slice(i, left.length), ...right.slice(j, right.length)]
    );

    return res;
  }

  nums = merge(nums);

  // 数组转链表
  head = new ListNode(nums[0]);
  let prev = head;
  for (let index = 1; index < nums.length; index++) {
    const item = nums[index],
      current = new ListNode(item);

    prev.next = current;
    prev = current;
  }

  return head;
}
// @lc code=end

/*
// @lcpr case=start
// [4,2,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [-1,5,3,4,0]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

 */
