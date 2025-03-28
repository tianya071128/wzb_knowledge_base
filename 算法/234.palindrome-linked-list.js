/*
 * @lc app=leetcode.cn id=234 lang=javascript
 * @lcpr version=30204
 *
 * [234] 回文链表
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
 * @return {boolean}
 */
var isPalindrome = function (head) {
  let list = [];
  while (head) {
    list.push(head);
    head = head.next;
  }

  let left = 0,
    right = list.length - 1;
  while (left < right) {
    if (list[left].val !== list[right].val) return false;

    left++;
    right--;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n
// @lcpr case=end

 */
