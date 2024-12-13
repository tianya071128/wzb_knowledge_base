/*
 * @lc app=leetcode.cn id=83 lang=javascript
 * @lcpr version=30204
 *
 * [83] 删除排序链表中的重复元素
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
var deleteDuplicates = function (head) {
  // let current = head, // 当前遍历的指针
  //   prev; // 上一个节点指针

  // while (current) {
  //   // 如果当前指针域上一个节点指针的值重复, 那么判定为重置节点
  //   if (prev && prev.val === current.val) {
  //     current = current.next;
  //     prev.next = current;
  //   } else {
  //     // 移动指针
  //     prev = current;
  //     current = current.next;
  //   }
  // }

  // return head;

  /**
   * 优化: https://leetcode.cn/problems/remove-duplicates-from-sorted-list/solutions/680357/shan-chu-pai-xu-lian-biao-zhong-de-zhong-49v5/
   */
  // 注意边界，没有也不影响
  if (!head) {
    return head;
  }

  let cur = head;
  while (cur.next) {
    if (cur.val === cur.next.val) {
      cur.next = cur.next.next;
    } else {
      cur = cur.next;
    }
  }
  return head;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,2,3,3]\n
// @lcpr case=end

 */
