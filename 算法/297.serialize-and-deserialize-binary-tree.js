/*
 * @lc app=leetcode.cn id=297 lang=javascript
 * @lcpr version=30204
 *
 * [297] 二叉树的序列化与反序列化
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

  let ans = [root.val],
    queue = [root];

  while (queue.length) {
    let level = [];
    for (const item of queue) {
      ans.push(item.left?.val ?? null, item.right?.val ?? null);
      item.left && level.push(item.left);
      item.right && level.push(item.right);
    }

    queue = level;
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
  if (!data) return null;

  let list = data.split(',').map((item) => (item ? Number(item) : null));

  // 启动构建
  let root = new TreeNode(list[0]),
    level = [root],
    l = 1;

  while (level.length) {
    let cur = [];
    for (const node of level) {
      // 构建左右节点
      let n = list[l++];
      if (n != null) {
        node.left = new TreeNode(n);
        cur.push(node.left);
      }
      n = list[l++];
      if (n != null) {
        node.right = new TreeNode(n);
        cur.push(node.right);
      }
    }

    level = cur;
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
// [1,2,3,null,null,4,5]\n
// @lcpr case=end

// @lcpr case=start
// []\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = serialize;
// @lcpr-after-debug-end
