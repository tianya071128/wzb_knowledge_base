/*
 * @lc app=leetcode.cn id=817 lang=javascript
 * @lcpr version=30204
 *
 * [817] 链表组件
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
 * @param {number[]} nums
 * @return {number}
 */
var numComponents = function (head, nums) {
  /**
   * 1. 对 nums 进行 hash 表存储
   * 2. 对 head 进行遍历过程中, 在 hash 中查找是否有值, 碰到没有值的说明是一个节点
   */
  let hash = new Set(nums),
    flag = false,
    ans = 0;

  while (head) {
    // 存在值
    if (hash.has(head.val)) {
      flag = true;
    }
    // 不存在值
    else {
      if (flag) ans++;
      flag = false;
    }

    head = head.next;
  }

  // 判定最后的
  if (flag) ans++;

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [0,1,2,3]\n[0,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,2,3,4]\n[0,3,1,4]\n
// @lcpr case=end

 */
