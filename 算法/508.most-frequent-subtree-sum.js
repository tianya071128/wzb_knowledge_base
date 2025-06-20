/*
 * @lc app=leetcode.cn id=508 lang=javascript
 * @lcpr version=30204
 *
 * [508] 出现次数最多的子树元素和
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
 * @return {number[]}
 */
var findFrequentTreeSum = function (root) {
  // 使用哈希表记录下子树元素和, 并且记录下出现次数最多的
  let map = new Map(),
    max = 0;
  function dfs(root) {
    if (!root) return 0;

    // 计算总和
    const sum = dfs(root.left) + root.val + dfs(root.right);
    // 记录次数
    const n = (map.get(sum) ?? 0) + 1;
    map.set(sum, n);
    max = Math.max(n, max);

    return sum;
  }
  dfs(root);

  // 迭代哈希表, 找出 max 次数的
  const ans = [];
  map.forEach((v, k) => v === max && ans.push(k));

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [5,2,-3]\n
// @lcpr case=end

// @lcpr case=start
// [5,2,-5]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findFrequentTreeSum;
// @lcpr-after-debug-end
