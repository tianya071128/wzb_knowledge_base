/*
 * @lc app=leetcode.cn id=103 lang=javascript
 * @lcpr version=30204
 *
 * [103] 二叉树的锯齿形层序遍历
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
 * @return {number[][]}
 */
var zigzagLevelOrder = function (root) {
  if (!root) return [];

  let level = [root],
    ans = [],
    directionFlag = false;

  while (level.length) {
    ans.push(
      level.reduce((total, item) => {
        total[directionFlag ? 'unshift' : 'push'](item.val);
        return total;
      }, [])
    );

    level = level.reduce(
      (total, item) => [
        ...total,
        ...[item.left, item.right].filter((item) => !!item),
      ],
      []
    );
    directionFlag = !directionFlag;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,9,20,null,null,15,7]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = zigzagLevelOrder;
// @lcpr-after-debug-end
