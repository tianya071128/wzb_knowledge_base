/*
 * @lc app=leetcode.cn id=24 lang=javascript
 * @lcpr version=30204
 *
 * [24] 两两交换链表中的节点
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
var swapPairs = function (head) {
  // 递归法
  if (!head?.next) return head;

  const newHead = head.next;
  const nextNode = newHead.next;
  newHead.next = head;
  head.next = swapPairs(nextNode);

  return newHead;

  // 迭代法
  // const dummy = new ListNode(0, head);

  // let left = dummy,
  //   center = dummy.next,
  //   right = center?.next ?? null,
  //   n;
  // while (right) {
  //   // 交换节点
  //   left.next = right;
  //   center.next = right.next;
  //   right.next = center;

  //   // 移动指针
  //   right = center.next?.next ?? null;
  //   left = left.next.next;
  //   center = center.next;
  // }

  // return dummy.next;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = swapPairs;
// @lcpr-after-debug-end
