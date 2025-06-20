/*
 * @lc app=leetcode.cn id=513 lang=javascript
 * @lcpr version=30204
 *
 * [513] 找树左下角的值
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
var findBottomLeftValue = function (root) {
  // 先序遍历: 根 -> 左 -> 右, 总之, 先遍历左树
  // 遍历过程中, 记录层级
  let level = 0,
    ans = 0;
  function dfs(root, curLevel) {
    if (!root) return;

    // 叶节点
    if (!root.left && !root.right) {
      if (curLevel > level) {
        level = curLevel;
        ans = root.val;
      }
      return;
    }

    // 左右节点处理
    dfs(root.left, curLevel + 1);
    dfs(root.right, curLevel + 1);
  }

  dfs(root, 1);
  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [2,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,null,5,6,null,null,7]\n
// @lcpr case=end

 */
