/*
 * @lc app=leetcode.cn id=1171 lang=javascript
 * @lcpr version=30204
 *
 * [1171] 从链表中删去总和值为零的连续节点
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
 * @return {ListNode}
 */
var removeZeroSumSublists = function (head) {
  /**
   * 1. 转为数组
   * 2. 数组使用前缀和
   */
  let ans = [], // 前缀和数组
    prefixSum = 0,
    hash = new Map();
  while (head) {
    prefixSum += head.val;

    // 如果此时前缀和为零, 那么之前的全部舍弃
    if (prefixSum === 0) {
      ans = [];
      hash.clear();
    }
    // 如果之前的前缀和存在该数的话, 那么在该数索引之间的全部去除
    else if (hash.has(prefixSum)) {
      // 将删除从 hash 中剔除
      for (let i = hash.get(prefixSum) + 1; i < ans.length; i++) {
        hash.delete(ans[i][0]);
      }
      ans = ans.slice(0, hash.get(prefixSum) + 1);
    } else {
      // 其他情况, 追加到
      ans.push([prefixSum, head]);
      hash.set(prefixSum, ans.length - 1);
    }

    head = head.next;
  }

  // 拼装为链表
  let dump = new ListNode(),
    perv = dump;
  for (const [, node] of ans) {
    node.next = null; // 切断之前的联系

    perv.next = node;
    perv = node;
  }

  return dump.next;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=removeZeroSumSublists
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,2,3,-3,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,-3,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,-3,-2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = removeZeroSumSublists;
// @lcpr-after-debug-end
