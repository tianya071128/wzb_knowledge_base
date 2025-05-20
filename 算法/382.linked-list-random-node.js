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
// /**
//  * @param {ListNode} head
//  */
// var Solution = function (head) {
//   // 将链表规整为数组
//   let list = [];
//   while (head) {
//     list.push(head);
//     head = head.next;
//   }

//   this.list = list;
// };

// /**
//  * @return {number}
//  */
// Solution.prototype.getRandom = function () {
//   // 使用 Math.random 随机性
//   return this.list[Math.floor(Math.random() * this.list.length)].val;
// };

/** 蓄水池抽样随机算法 */
/**
 * @param {ListNode} head
 */
var Solution = function (head) {
  this.head = head;
};

/**
 * @return {number}
 */
Solution.prototype.getRandom = function () {
  let ans,
    i = 1,
    head = this.head;
  while (head) {
    // 如果获取的随机数正好为 0, 则 ans 替换为当前 head
    if (Math.floor(Math.random() * i) === 0) {
      ans = head;
    }

    head = head.next;
    i++;
  }

  return ans.val;
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(head)
 * var param_1 = obj.getRandom()
 */
// @lc code=end
