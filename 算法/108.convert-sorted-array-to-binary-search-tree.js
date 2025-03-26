/*
 * @lc app=leetcode.cn id=108 lang=javascript
 * @lcpr version=30204
 *
 * [108] 将有序数组转换为二叉搜索树
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
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function (nums) {
  // 分治法

  function dfs(left, right) {
    // 区间已经没有元素
    if (left > right) return null;

    // 中间元素做根
    const mid = Math.floor((right - left) / 2) + left;
    const root = new TreeNode(nums[mid]);

    // 构建左树
    root.left = dfs(left, mid - 1);
    // 构建右树
    root.right = dfs(mid + 1, right);

    return root;
  }

  return dfs(0, nums.length - 1);
};
// @lc code=end

/*
// @lcpr case=start
// [-10,-3,0,5,9]\n
// @lcpr case=end

// @lcpr case=start
// [1,3]\n
// @lcpr case=end

 */
