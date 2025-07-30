/*
 * @lc app=leetcode.cn id=429 lang=javascript
 * @lcpr version=30204
 *
 * [429] N 叉树的层序遍历
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * // Definition for a _Node.
 * function _Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
  if (!root) return [];

  let ans = [],
    queue = [root];

  while (queue.length) {
    ans.push(queue.map((item) => item.val));

    queue = queue.reduce(
      (total, item) => [...total, ...(item.children ?? [])],
      []
    );
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// []\n
// @lcpr case=end

// @lcpr case=start
// [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]\n
// @lcpr case=end

 */
