/*
 * @lc app=leetcode.cn id=449 lang=javascript
 * @lcpr version=30204
 *
 * [449] 序列化和反序列化二叉搜索树
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
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function (root) {
  if (!root) return '';
  /**
   * 数组表示, 使用层序
   */
  let ans = [root.val],
    level = [root];
  while (level.length) {
    const nextLevel = [];
    for (const item of level) {
      // 如果存在, 说明存在节点, 否则就是 null
      if (item) {
        nextLevel.push(item.left, item.right);
      }
    }
    ans.push(...nextLevel.map((item) => item?.val ?? null));
    level = nextLevel;
  }

  return ans.join();
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function (data) {
  // 一个节点都不存在, 直接返回 null
  if (!data) return null;

  let list = data.split(','), // 节点数组
    root = new TreeNode(Number(list[0])),
    pending = [root], // 待处理连接的节点
    cur = 0;

  while (cur < list.length) {
    const node = pending.shift();
    const leftNum = list[++cur];
    const rightNum = list[++cur];

    if (leftNum) {
      const leftNode = new TreeNode(Number(leftNum));
      node.left = leftNode;
      pending.push(leftNode);
    }

    if (rightNum) {
      const rightNode = new TreeNode(Number(rightNum));
      node.right = rightNode;
      pending.push(rightNode);
    }
  }

  return root;
};
/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
// @lc code=end

/*
// @lcpr case=start
// [5,4,7,3,null,6]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = serialize;
// @lcpr-after-debug-end
