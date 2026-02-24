/*
 * @lc app=leetcode.cn id=1457 lang=javascript
 * @lcpr version=30204
 *
 * [1457] 二叉树中的伪回文路径
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
var pseudoPalindromicPaths = function (root) {
  let ans = 0,
    paths = Array(10).fill(0);

  function dfs(node) {
    if (!node) return;

    paths[node.val]++;

    // 叶节点
    if (!node.left && !node.right) {
      // console.log(paths);
      // 是否可以组成 伪回文
      let flag = true,
        one = true; // 只有一个数字可以为奇数
      for (const item of paths) {
        if (item % 2 === 1) {
          if (one) {
            one = false;
          } else {
            flag = false;
            break;
          }
        }
      }

      if (flag) ans++;
    }

    dfs(node.left);
    dfs(node.right);

    paths[node.val]--;
  }

  dfs(root);

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=pseudoPalindromicPaths
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [2,3,1,3,1,null,1]\n
// @lcpr case=end

// @lcpr case=start
// [2,1,1,1,3,null,null,null,null,null,1]\n
// @lcpr case=end

// @lcpr case=start
// [9]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = pseudoPalindromicPaths;
// @lcpr-after-debug-end
