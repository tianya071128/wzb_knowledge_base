/*
 * @lc app=leetcode.cn id=19 lang=javascript
 * @lcpr version=30204
 *
 * [19] 删除链表的倒数第 N 个结点
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
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
  /**
   * 解决思路: 问题在于从倒数开始, 而单向链表需要遍历才能知道长度
   *  所以, 先遍历一遍, 转换成数组一下, 之后使用数组快速访问的特性来实现
   */
  // let arr = [],
  //   current = head;
  // // 转为数组
  // do {
  //   arr.push(current);
  // } while ((current = current.next));
  // // 转化为数组操作索引
  // let i = arr.length - n;
  // // 删除头
  // if (i === 0) return arr[1] ?? null;
  // arr[i - 1].next = arr[i].next;
  // return head;
  /**
   * 根据题解得出更优解: 前后指针 --> https://leetcode.cn/problems/remove-nth-node-from-end-of-list/solutions/2004057/ru-he-shan-chu-jie-dian-liu-fen-zhong-ga-xpfs/
   */
  // 在对链表进行操作时，一种常用的技巧是添加一个哑节点（dummy node），它的 next 指针指向链表的头节点。这样一来，我们就不需要对头节点进行特殊的判断了。
  const dummy = new ListNode(0, head);
  let left = dummy;
  let right = dummy;
  while (n--) {
    right = right.next; // 右指针先向右走 n 步
  }
  while (right.next) {
    left = left.next;
    right = right.next; // 左右指针一起走
  }
  left.next = left.next.next; // 左指针的下一个节点就是倒数第 n 个节点
  return dummy.next;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n2\n
// @lcpr case=end

// @lcpr case=start
// [1]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n1\n
// @lcpr case=end

 */
