/*
 * @lc app=leetcode.cn id=382 lang=javascript
 * @lcpr version=30204
 *
 * [382] 链表随机节点
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
 */
var Solution = function (head) {
  // 将链表规整为数组
  let list = [];
  while (head) {
    list.push(head);
    head = head.next;
  }

  this.list = list;
};

/**
 * @return {number}
 */
Solution.prototype.getRandom = function () {
  // 使用 Math.random 随机性
  return this.list[Math.floor(Math.random() * this.list.length)].val;
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(head)
 * var param_1 = obj.getRandom()
 */
// @lc code=end
