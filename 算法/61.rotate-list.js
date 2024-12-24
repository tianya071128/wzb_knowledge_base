/*
 * @lc app=leetcode.cn id=61 lang=javascript
 * @lcpr version=30204
 *
 * [61] 旋转链表
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
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function (head, k) {
  if (head?.next == null) return head;

  // 迭代链表, 使用数组存储所有节点
  let arr = [head];
  while (head.next) {
    arr.push(head.next);
    head = head.next;
  }

  // 计算下应该从第几个索引开始旋转
  const i = arr.length - (k % arr.length);
  if (i >= arr.length) return arr[0];

  // 重建关系
  arr[i - 1].next = null;
  arr[arr.length - 1].next = arr[0];

  return arr[i];
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n2\n
// @lcpr case=end

// @lcpr case=start
// [0,1,2]\n4\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = rotateRight;
// @lcpr-after-debug-end
