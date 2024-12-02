/*
 * @lc app=leetcode.cn id=100 lang=javascript
 * @lcpr version=30204
 *
 * [100] 相同的树
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function (p, q) {
  // 递归法 - https://leetcode.cn/problems/same-tree/solutions/12686/hua-jie-suan-fa-100-xiang-tong-de-shu-by-guanpengc/
  if (p == null && q == null) return true;

  if (p?.val !== q?.val) return false;

  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);

  // 迭代法
  // let stack = [p],
  //   stack2 = [q];
  // while (stack.length || stack2.length) {
  //   let top = stack.pop(),
  //     top2 = stack2.pop();
  //   if (top?.val !== top2?.val) return false;
  //   if (
  //     top?.left != null ||
  //     top?.right != null ||
  //     top2?.left != null ||
  //     top2?.right != null
  //   ) {
  //     stack.push(top?.left, top?.right);
  //     stack2.push(top2?.left, top2?.right);
  //   }
  // }
  // return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n[1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n[1,null,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,1]\n[1,1,2]\n
// @lcpr case=end

 */
