/*
 * @lc app=leetcode.cn id=1261 lang=javascript
 * @lcpr version=30204
 *
 * [1261] 在受污染的二叉树中查找元素
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
 */
var FindElements = function (root) {
  let hash = new Set();

  function dfs(node, val) {
    if (!node) return;
    hash.add(val);
    node.val = val;
    dfs(node.left, val * 2 + 1);
    dfs(node.right, val * 2 + 2);
  }

  dfs(root, 0);

  this.hash = hash;
  this.root = root;
};

/**
 * @param {number} target
 * @return {boolean}
 */
FindElements.prototype.find = function (target) {
  return this.hash.has(target);
};

/**
 * Your FindElements object will be instantiated and called as such:
 * var obj = new FindElements(root)
 * var param_1 = obj.find(target)
 */
// @lc code=end

/*
// @lcpr case=start
// ["FindElements","find","find"]\n[[[-1,null,-1]],[1],[2]]\n
// @lcpr case=end

// @lcpr case=start
// ["FindElements","find","find","find"]\n[[[-1,-1,-1,-1,-1]],[1],[3],[5]]\n
// @lcpr case=end

// @lcpr case=start
// ["FindElements","find","find","find","find"]\n[[[-1,null,-1,-1,null,-1]],[2],[3],[4],[5]]\n
// @lcpr case=end

 */
