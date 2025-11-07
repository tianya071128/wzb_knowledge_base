/*
 * @lc app=leetcode.cn id=1019 lang=javascript
 * @lcpr version=30204
 *
 * [1019] 链表中的下一个更大节点
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
 * @return {number[]}
 */
var nextLargerNodes = function (head) {
  let prev = null;
  /** 反转链表 */
  while (head) {
    let temp = head.next;
    head.next = prev;
    prev = head;
    head = temp;
  }

  let ans = [],
    stack = []; // 单调递减栈
  while (prev) {
    // 将栈中小于 prev.val 的值出栈
    while (stack.length && stack.at(-1) <= prev.val) {
      stack.pop();
    }

    ans.unshift(stack.at(-1) ?? 0);

    stack.push(prev.val);
    prev = prev.next;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [2,1,5]\n
// @lcpr case=end

// @lcpr case=start
// [2,7,4,3,5]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = nextLargerNodes;
// @lcpr-after-debug-end
