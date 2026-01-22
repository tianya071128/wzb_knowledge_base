/*
 * @lc app=leetcode.cn id=1339 lang=javascript
 * @lcpr version=30204
 *
 * [1339] 分裂二叉树的最大乘积
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
var maxProduct = function (root) {
  /**
   * 计算出整棵树的总和
   * 当两颗树的差值越大, 那么结果就会越大
   */
  let total = 0,
    queue = [root],
    cur;
  while ((cur = queue.shift())) {
    total += cur.val;
    if (cur.left) queue.push(cur.left);
    if (cur.right) queue.push(cur.right);
  }

  let ans = Infinity;
  function dfs(node) {
    if (!node) return 0;

    let leftTotal = dfs(node.left);
    let rightTotal = dfs(node.right);

    ans = Math.min(
      ans,
      Math.abs(total / 2 - leftTotal),
      Math.abs(total / 2 - rightTotal)
    );

    return leftTotal + node.val + rightTotal;
  }
  dfs(root);

  return ((total / 2 - ans) * (total / 2 + ans)) % (10 ** 9 + 7);
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5,6]\n
// @lcpr case=end

// @lcpr case=start
// [1,null,2,3,4,null,null,5,6]\n
// @lcpr case=end

// @lcpr case=start
// [2,3,9,10,7,8,6,5,4,11,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,1]\n
// @lcpr case=end

 */
