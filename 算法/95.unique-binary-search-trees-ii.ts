/*
 * @lc app=leetcode.cn id=95 lang=typescript
 * @lcpr version=30204
 *
 * [95] 不同的二叉搜索树 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function generateTrees(n: number): Array<TreeNode | null> {
  // 回溯
  const ans: (number | null)[][] = [];

  function dfs(
    // 已经走过的路径
    paths: (number | null)[],
    // 已经存在的值
    exist: Set<number>,
    // 父节点的值
    fatherVal?: number,
    // 当前构建的节点位置
    position?: 'left' | 'right'
  ) {
    // 终止条件, 已经是一颗树
    if (exist.size === n) {
      ans.push([...paths]);
      return;
    }

    for (let i = 1; i <= n; i++) {
      // 已经存在, 无法构建
      if (exist.has(i)) continue;

      // 构建左侧节点
    }
  }

  return ans;
}
// @lc code=end

/*
// @lcpr case=start
// 3\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */
