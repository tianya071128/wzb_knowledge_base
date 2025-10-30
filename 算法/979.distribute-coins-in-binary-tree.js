/*
 * @lc app=leetcode.cn id=979 lang=javascript
 * @lcpr version=30204
 *
 * [979] 在二叉树中分配硬币
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
var distributeCoins = function (root) {
  /**
   * 注意提示: 所有 Node.val 的值之和是 n --> 那么每个节点的硬币应该都是 1 个
   *
   * 后序遍历: 先子节点后根节点
   *  - 遍历到每个节点时, 计算当前节点及子节点缺少(或多余)的硬币
   *  - 向上传递的过程中, 计算出应该移动的次数
   */
  let ans = 0;

  function dfs(node) {
    if (!node) return 0;

    // 当前硬币
    let cur = node.val + dfs(node.left) + dfs(node.right);

    // 保持一个硬币, 其余的都需要移动上父节点处理
    ans += Math.abs(cur - 1);

    return cur - 1;
  }

  dfs(root);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,0,0]\n
// @lcpr case=end

// @lcpr case=start
// [0,3,0]\n
// @lcpr case=end

 */
