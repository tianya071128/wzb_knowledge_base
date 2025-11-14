/*
 * @lc app=leetcode.cn id=1161 lang=javascript
 * @lcpr version=30204
 *
 * [1161] 最大层内元素和
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
 * @param {TreeNode} root
 * @return {number}
 */
var maxLevelSum = function (root) {
  /**
   * 层序遍历
   */
  let ans = 0,
    queue = [root],
    max = -Infinity,
    level = 1;

  while (queue.length) {
    let sum = 0,
      child = [];
    for (const node of queue) {
      sum += node.val;
      node.left && child.push(node.left);
      node.right && child.push(node.right);
    }

    if (sum > max) {
      max = sum;
      ans = level;
    }

    level++;
    queue = child;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,7,0,7,-8,null,null]\n
// @lcpr case=end

// @lcpr case=start
// [989,null,10250,98693,-89388,null,null,null,-32127]\n
// @lcpr case=end

 */
