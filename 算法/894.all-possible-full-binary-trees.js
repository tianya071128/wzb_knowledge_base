/*
 * @lc app=leetcode.cn id=894 lang=javascript
 * @lcpr version=30204
 *
 * [894] 所有可能的真二叉树
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
 * @param {number} n
 * @return {TreeNode[]}
 */
var allPossibleFBT = function (n) {
  // 偶数直接返回 []
  if (n % 2 === 0) return [];

  // 记忆化
  let memory = new Map();

  /**
   * 分治: 穷举左右子树的可能
   */
  function dfs(n) {
    if (n === 0) return [];
    if (n === 1) return [new TreeNode()];
    if (memory.has(n)) return memory.get(n);

    let ans = [];

    let leftNodeLen = 1; // 左侧节点长度
    while (leftNodeLen < n) {
      let leftNodes = dfs(leftNodeLen),
        rightNodes = dfs(n - leftNodeLen - 1);

      // 构造树
      for (const left of leftNodes) {
        for (const right of rightNodes) {
          ans.push(new TreeNode(0, left, right));
        }
      }

      leftNodeLen += 2;
    }

    memory.set(n, ans);

    return ans;
  }

  return dfs(n);
};
// @lc code=end

/*
// @lcpr case=start
// 7\n
// @lcpr case=end

// @lcpr case=start
// 3\n
// @lcpr case=end

 */
