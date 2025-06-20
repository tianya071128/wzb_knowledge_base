/*
 * @lc app=leetcode.cn id=1721 lang=javascript
 * @lcpr version=30204
 *
 * [1721] 交换链表中的节点
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
var swapNodes = function (head, k) {
  // 两次迭代, 找到交换的节点
  let node1, node2;

  // 第一次, 找到 node1, 并且记录下链表的长度
  let curNode = head,
    len = 0;
  while (curNode) {
    len++;
    // 找到第一个节点
    if (len === k) {
      node1 = curNode;
    }

    curNode = curNode.next;
  }

  // 第二次, 找到第二个节点
  curNode = head;
  while (curNode) {
    if (len === k) {
      node2 = curNode;
      break;
    }

    len--;
    curNode = curNode.next;
  }

  // // 交换值
  [node1.val, node2.val] = [node2.val, node1.val];

  return head;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=swapNodes
// paramTypes= ["number[]","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,2,3,4,5]\n2\n
// @lcpr case=end

// @lcpr case=start
// [7,9,6,6,7,8,3,0,9,5]\n5\n
// @lcpr case=end

// @lcpr case=start
// [1]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = swapNodes;
// @lcpr-after-debug-end
