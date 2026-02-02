/*
 * @lc app=leetcode.cn id=1367 lang=javascript
 * @lcpr version=30204
 *
 * [1367] 二叉树中的链表
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
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {ListNode} head
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSubPath = function (head, root) {
  // 链表转为数组
  let arr = [];
  while (head) {
    arr.push(head.val);
    head = head.next;
  }

  let paths = []; // 二叉树路径
  /**
   * @param {*} node 当前的节点
   * @param {*} i 匹配在 arr 的位置
   */
  function dfs(node, i) {
    // 此时匹配到了末尾
    if (i === arr.length) return true;

    // 此时肯定不存在
    if (!node) return false;

    paths.push(node.val);

    // 如果当前位置不匹配, 修正匹配索引
    if (arr[i] !== node.val) {
      /**
       * 例如:
       *  arr:    [4, 5, 6]
       *  paths:  [4, 4]
       *
       * 那么此时重新将 i 定位到 0
       */
      for (; i >= 0; i--) {
        // 遍历 arr 和 paths
        let j = i,
          k = paths.length - 1;
        while (j >= 0 && k >= 0 && arr[j] === paths[k]) {
          j--;
          k--;
        }

        // 遍历到了 arr 的开头, 则表示匹配命中
        if (j === -1) break;
      }
    }

    // 左树递归
    let flag = dfs(node.left, i + 1);
    if (flag) return true;

    // 右树
    flag = dfs(node.right, i + 1);
    if (flag) return true;

    paths.shift();
    return false;
  }

  return dfs(root, 0);
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=isSubPath
// paramTypes= ["number[]","number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [4,2,8]\n[1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,4,2,6]\n[1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,4,2,6,8]\n[1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isSubPath;
// @lcpr-after-debug-end
