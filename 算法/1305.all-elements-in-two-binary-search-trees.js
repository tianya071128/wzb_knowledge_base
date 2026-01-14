/*
 * @lc app=leetcode.cn id=1305 lang=javascript
 * @lcpr version=30204
 *
 * [1305] 两棵二叉搜索树中的所有元素
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
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {number[]}
 */
var getAllElements = function (root1, root2) {
  let list1 = [],
    list2 = [];

  dfs(root1, list1);
  dfs(root2, list2);

  // 排序
  let ans = [],
    l1 = 0,
    l2 = 0;
  while (l1 < list1.length || l2 < list2.length) {
    if (l1 < list1.length && list1[l1] <= (list2[l2] ?? Infinity)) {
      ans.push(list1[l1]);
      l1++;
    } else {
      ans.push(list2[l2]);
      l2++;
    }
  }

  return ans;
};

function dfs(node, list) {
  if (!node) return;

  dfs(node.left, list);
  list.push(node.val);
  dfs(node.right, list);
}
// @lc code=end

/*
// @lcpr case=start
// [2,1,4]\n[1,0,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,null,8]\n[8,1]\n
// @lcpr case=end

 */
