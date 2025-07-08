/*
 * @lc app=leetcode.cn id=654 lang=javascript
 * @lcpr version=30204
 *
 * [654] 最大二叉树
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
 *  优化: O(n) 时间 --> 单调栈
 *   - 如果栈顶元素大于待插入的元素，则：栈顶元素.right = 待插入元素
 *   - 如果栈顶元素小于待插入的元素，则：待插入元素.left = 栈顶元素
 *
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function (nums) {
  /**
   * 找到最大值, 将最大值左边的作为左子树, 右边的作为右子树
   */
  function dfs(left, right) {
    if (left > right) return null;

    // 找到最大值
    let maxIndex = left,
      max = -Infinity;
    for (let i = left; i <= right; i++) {
      if (nums[i] > max) {
        maxIndex = i;
        max = nums[i];
      }
    }

    // 构建根节点
    const root = new TreeNode(max);
    root.left = dfs(left, maxIndex - 1);
    root.right = dfs(maxIndex + 1, right);

    return root;
  }

  return dfs(0, nums.length - 1);
};
// @lc code=end

/*
// @lcpr case=start
// [3,2,1,6,0,5]\n
// @lcpr case=end

// @lcpr case=start
// [3,2,1]\n
// @lcpr case=end

 */
