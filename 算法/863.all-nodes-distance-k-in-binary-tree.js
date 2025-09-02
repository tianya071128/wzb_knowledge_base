/*
 * @lc app=leetcode.cn id=863 lang=javascript
 * @lcpr version=30204
 *
 * [863] 二叉树中所有距离为 K 的结点
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} target
 * @param {number} k
 * @return {number[]}
 */
var distanceK = function (root, target, k) {
  if (k === 0) return [target.val];

  /**
   * 先找到目标节点, 在根据目标节点找到对应的节点
   */
  let res = [];

  /**
   *
   * @param {*} node 查找节点
   * @param {*} k 层级
   * @param {*} location 该方向的节点要忽略
   */
  function dfs2(node, k, location) {
    if (!node) return;

    if (k <= 0) {
      k === 0 && res.push(node.val);
      return;
    }

    location !== 'left' && dfs2(node.left, k - 1);
    location !== 'right' && dfs2(node.right, k - 1);
  }

  /**
   * 首先找到目标节点, 在根据目标节点的路径找到对应的节点
   * @param {*} node 节点
   */
  let paths = [];
  function dfs(node) {
    if (!node) return;

    // 找到目标节点
    if (node.val === target.val) {
      paths.push({
        node,
      });
      paths.reverse();
      for (let i = 0; i < paths.length; i++) {
        // 已经不符合
        if (k < i) break;

        dfs2(paths[i].node, k - i, paths[i].location);
      }
      return true;
    }

    const cur = {
      node,
      location: 'left',
    };
    paths.push(cur);
    let flag = dfs(node.left);
    if (flag) return;
    // 调整方向
    cur.location = 'right';
    dfs(node.right);
    paths.pop();
  }
  dfs(root);

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [3,5,1,6,2,0,8,null,null,7,4]\n2\n0\n
// @lcpr case=end

// @lcpr case=start
// [0,1,null,null,2,null,3,null,4]\n3\n0\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = distanceK;
// @lcpr-after-debug-end
