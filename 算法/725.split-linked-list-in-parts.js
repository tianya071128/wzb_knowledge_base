/*
 * @lc app=leetcode.cn id=725 lang=javascript
 * @lcpr version=30204
 *
 * [725] 分隔链表
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
 * @return {ListNode[]}
 */
var splitListToParts = function (head, k) {
  if (!head) return [];

  /**
   * 1. 先计算链表的长度
   * 2. 计算每个链表的长度
   */
  let len = 0,
    cur = head;
  while (cur) {
    len++;
    cur = cur.next;
  }

  let ans = new Array(k).fill(null),
    ave = Math.floor(len / k), // 每个区间的平均数
    remainder = len % k, // 前几个区间多余的数
    start = head, // 开始的节点
    curNode = head, // 当前遍历节点
    i = 0; // 处理的 ans 索引

  while (curNode) {}
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n5\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,6,7,8,9,10]\n3\n
// @lcpr case=end

 */
