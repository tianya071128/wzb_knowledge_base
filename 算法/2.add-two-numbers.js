/*
 * @lc app=leetcode.cn id=2 lang=javascript
 * @lcpr version=30204
 *
 * [2] 两数相加
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
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  /**
   * 解题思路
   *  1. 遍历链表
   *  2. 每一项相加
   *      2.1 如果相加超出9, 则下一位加1, 并且该项的值需要减去10
   *      2.2 如果相加不超出9, 则该结果的值作为该项
   *  3. 遍历结束后, 还需要检测最后是否需要进位
   *      3.1 如果需要, 则结果需要追加一个 1
   *      3.2 否则返回结果
   */
  let head,
    current, // 当前链表
    prev; // 上一位链表
  let carry = false; // 是否需要进位

  while (l1 || l2) {
    let n = (l1?.val ?? 0) + (l2?.val ?? 0) + Number(carry);
    if (n > 9) {
      // 结果超出 9, 表示需要进位
      carry = true;
      n = n - 10;
    } else {
      carry = false;
    }

    current = new ListNode(n);
    // 如果存在上一个值的话, 建立链接关系
    if (prev) {
      prev.next = current;
    } else {
      // 否则表示开头的
      head = current;
    }

    // 重置引用
    prev = current;
    l1 = l1?.next;
    l2 = l2?.next;
  }

  // 遍历完成后, 如果发现还需要进一位, 那么补 1
  if (carry) {
    prev.next = new ListNode(1);
  }

  return head;
};
// @lc code=end

/*
// @lcpr case=start
// [2,4,3]\n[5,6,4]\n
// @lcpr case=end

// @lcpr case=start
// [0]\n[0]\n
// @lcpr case=end

// @lcpr case=start
// [9,9,9,9,9,9,9]\n[9,9,9,9]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = addTwoNumbers;
// @lcpr-after-debug-end
