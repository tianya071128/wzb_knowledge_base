/*
 * @lc app=leetcode.cn id=1519 lang=javascript
 * @lcpr version=30204
 *
 * [1519] 子树中标签相同的节点数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {string} labels
 * @return {number[]}
 */
var countSubTrees = function (n, edges, labels) {
  // 边以 Map 形式
  let edgeMap = new Map(
    Array(n)
      .fill(0)
      .map((item, index) => [index, []])
  );
  for (const [i, j] of edges) {
    edgeMap.get(i).push(j);
    edgeMap.get(j).push(i);
  }

  // 组树
  let root = createNode(0);
  function h(node, parentNode) {
    for (const j of edgeMap.get(node.val)) {
      if (j === parentNode?.val) continue;

      curNode = createNode(j);
      node.children.push(curNode);

      // 递归构造
      h(curNode, node);
    }
  }
  h(root); // 从根节点开始

  // 后序遍历树
  let ans = Array(n).fill(0); // 字符个数

  function dfs(node) {
    if (!node) return Array(26).fill(0);

    let list = Array(26).fill(0);

    for (const child of node.children) {
      let childList = dfs(child);

      for (let i = 0; i < childList.length; i++) {
        list[i] += childList[i];
      }
    }

    ans[node.val] = ++list[labels[node.val].charCodeAt() - 97];

    return list;
  }
  dfs(root);

  return ans;
};

function createNode(i) {
  return {
    children: [],
    val: i,
  };
}
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=countSubTrees
// paramTypes= ["number","number[][]","string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 7\n[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]]\n"abaedcd"\n
// @lcpr case=end

// @lcpr case=start
// 4\n[[0,1],[1,2],[0,3]]\n"bbbb"\n
// @lcpr case=end

// @lcpr case=start
// 5\n[[0,1],[0,2],[1,3],[0,4]]\n"aabab"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = countSubTrees;
// @lcpr-after-debug-end
