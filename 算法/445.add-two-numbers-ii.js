/*
 * @lc app=leetcode.cn id=445 lang=javascript
 * @lcpr version=30204
 *
 * [445] 两数相加 II
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
   * 简单点: 转为数组处理
   */
  let list1 = [],
    list2 = [];
  while (l1 || l2) {
    l1 && list1.push(l1.val);
    l2 && list2.push(l2.val);

    l1 = l1?.next;
    l2 = l2?.next;
  }

  // 反转计算
  list1.reverse();
  list2.reverse();

  let res = [],
    carry = 0;
  for (let i = 0; i < Math.max(list1.length, list2.length); i++) {
    let sum = (list1[i] ?? 0) + (list2[i] ?? 0) + carry;
    carry = sum > 9 ? 1 : 0;
    sum = sum > 9 ? sum - 10 : sum;

    res.push(new ListNode(sum));
  }

  if (carry > 0) res.push(new ListNode(carry));

  // 结果反转
  res.reverse();

  // 组装成链表
  for (let i = 0; i < res.length; i++) {
    res[i].next = res[i + 1] ?? null;
  }

  return res[0];
};
// @lc code=end

/*
// @lcpr case=start
// [7,2,4,3]\n[5,6,4]\n
// @lcpr case=end

// @lcpr case=start
// [2,4,3]\n[5,6,4]\n
// @lcpr case=end

// @lcpr case=start
// [0]\n[0]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = addTwoNumbers;
// @lcpr-after-debug-end
