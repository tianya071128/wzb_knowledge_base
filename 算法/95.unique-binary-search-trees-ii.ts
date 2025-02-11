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
  const ans: Array<TreeNode | null> = [];

  /**
   *
   * @param root 根节点
   * @param current 当前处理节点
   * @param current 当前处理节点
   * @param parentNode 父节点, 用于限制节点的取值范围
   */
  function dfs(
    root: TreeNode,
    current: TreeNode,
    nodeVals: number[],
    parentNode?: TreeNode
  ) {
    // 如果所有节点都添加完成
    if (nodeVals.length === n) {
      // 追加进结果
      ans.push(root);
      return;
    }

    // 左侧节点取值
    for (let index = (parentNode?.val ?? 0) + 1; index < current.val; index++) {
      // 剪枝 - 重复节点不能添加
      if (nodeVals.includes(index)) continue;

      const leftNode = new TreeNode(index);
      current.left = leftNode;
      dfs(root, leftNode, [...nodeVals, index], current);
    }

    // 右侧节点
    for (let index = current.val + 1; index <= n; index++) {
      // 剪枝 - 重复节点不能添加
      if (nodeVals.includes(index)) continue;

      const rightNode = new TreeNode(index);
      current.right = rightNode;
      dfs(root, rightNode, [...nodeVals, index], current);
    }
  }

  for (let index = 1; index <= n; index++) {
    const root = new TreeNode(index);
    dfs(root, root, [index]);
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
