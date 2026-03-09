/*
 * @lc app=leetcode.cn id=25 lang=javascript
 * @lcpr version=30204
 *
 * [25] K 个一组翻转链表
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
var reverseKGroup = function (head, k) {
  if (k === 1) return head;

  /**
   * 每 k 个链表翻转, 以每组分别翻转
   */
  let prevTail, // 上一个组的尾部
    nextHead = head, // 下一个分组的开始
    ans; // 结果

  /**
   * 根据头部翻转 k 个节点
   *
   *   1     2     3
   *  ⬆️    ⬆️
   *  cur   next
   */
  function helper(head) {
    let i = 1, // 翻转个数
      groupTailNode = head, // 头部会变成尾部节点
      cur = head, // 当前指针
      next = cur.next;

    cur.next = null;

    while (next && i < k) {
      let temp = next;

      // 指针移动
      next = next.next;
      temp.next = cur;
      cur = temp;

      // 个数加一
      i++;
    }

    return {
      /** 翻转个数 */
      i,
      /** 该组翻转后的尾部节点 */
      groupTailNode,
      /** 该组翻转后的头部节点 */
      groupHeadNode: cur,
      /** 下一组的头部节点 */
      nextGroupHeadNode: next,
    };
  }

  while (nextHead) {
    let result = helper(nextHead);

    // 如果翻转个数不足 k
    if (result.i < k) {
      // 重新翻转
      result = helper(result.groupHeadNode);
    }

    // 连接两个组
    if (prevTail) {
      prevTail.next = result.groupHeadNode;
    }
    if (!ans) ans = result.groupHeadNode;

    // 移动指针
    prevTail = result.groupTailNode;
    nextHead = result.nextGroupHeadNode;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n2\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,6,7,8,9,10]\n3\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = reverseKGroup;
// @lcpr-after-debug-end
