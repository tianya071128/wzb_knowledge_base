/*
 * @lc app=leetcode.cn id=21 lang=javascript
 * @lcpr version=30204
 *
 * [21] 合并两个有序链表
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
//  * @param {ListNode} list1
//  * @param {ListNode} list2
//  * @return {ListNode}
//  */
// var mergeTwoLists = function (list1, list2) {
//   // 处理边界
//   if (!list1) return list2;
//   if (!list2) return list1;
//   /**
//    * 解题思路:
//    *  1. 需要四个指针:
//    *      1. 指针1: list1 中的节点
//    *      2. 指针2: 指针1中的下一个节点
//    *      3. 指针3: 指针1中的上一个节点, 初始为 null
//    *      4. 指针4: list2 的节点
//    *  2. 遍历, 注释如下
//    */
//   let head = list1, // 开头节点
//     node1 = list1,
//     node2 = node1.next,
//     node3 = null,
//     node4 = list2,
//     overNode; // 过度节点变量, 用于交换节点

//   while (node4 && node1) {
//     /**
//      * 当指针4的值小于等于指针1
//      *  1. 将指针4的节点放置在指针1和指针3(如果存在)的中间
//      *  2. 向右移动指针4
//      *  3. 将指针3重置为旧的指针4
//      */
//     if (node4.val <= node1.val) {
//       overNode = node4;
//       node4 = overNode.next; // 先将指针4移动到下一个节点
//       // 如果指针3(指针1中的上一个节点存在), 将指针4的节点插入到指针3和指针1中间
//       if (node3) {
//         node3.next = overNode;
//       } else {
//         // 重置开头节点
//         head = overNode;
//       }
//       overNode.next = node1;
//       node3 = overNode;
//     }
//     // 当指针4的值大于指针1, 小于等于指针2(必须存在)
//     // 1. 将指针4的节点放置在指针1和指针2之间
//     // 2. 需要移动指针4
//     // 3. 指针1指向旧的指针4, 指针2不动, 指针3指向旧的指针1
//     else if (node2 && node2.val > node4.val) {
//       overNode = node4;
//       node4 = overNode.next; // 先将指针4移动到下一个节点

//       node1.next = overNode;
//       overNode.next = node2;

//       // 指针1指向旧的指针4, 指针2不动, 指针3指向旧的指针1
//       node3 = node1;
//       node1 = overNode;
//     }
//     // 其他情况下, 需要将指针1、指针2、指针3向右移动
//     else {
//       node3 = node1;
//       node1 = node3.next;
//       node2 = node1?.next ?? null;
//     }
//   }

//   // 在这里只需要处理, 指针4还没有遍历完成
//   // 此时, 将指针3链接到指针4即可
//   if (node4) {
//     node3.next = node4;
//   }

//   return head;
// };

/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
  // 处理边界
  if (!list1) return list2;
  if (!list2) return list1;
  if (list1.val < list2.val) {
    list1.next = mergeTwoLists(list1.next, list2);
    return list1;
  } else {
    list2.next = mergeTwoLists(list1, list2.next);
    return list2;
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,4]\n[1,3,4]\n
// @lcpr case=end

// @lcpr case=start
// []\n[]\n
// @lcpr case=end

// @lcpr case=start
// []\n[0]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = mergeTwoLists;
// @lcpr-after-debug-end
