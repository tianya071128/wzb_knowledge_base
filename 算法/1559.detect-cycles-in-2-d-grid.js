/*
 * @lc app=leetcode.cn id=1559 lang=javascript
 * @lcpr version=30204
 *
 * [1559] 二维网格图中探测环
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {character[][]} grid
 * @return {boolean}
 */
var containsCycle = function (grid) {
  // 从某一点出发, 只有遍历到的节点是相同数字, 然后路径中只有有环就满足条件
  // 如果没有环的话, 那么途径的点都不需要再次处理的

  // 深度搜索
  let m = grid.length,
    n = grid[0].length,
    flags = Array(m)
      .fill(0)
      .map(() => Array(n).fill(false)),
    direction = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

  function dfs(i, j, parentI, parentJ, parentChar) {
    let char = grid[i][j];

    // 如果存在父路径, 比较一下父路径的值是否相同以及是否形成环
    if (parentChar) {
      // 值不同, 不能走
      if (parentChar !== char) return false;

      // 形成环
      if (flags[i][j]) return true;
    }

    // 其他情景下, 继续往下走
    flags[i][j] = true;

    for (let [dI, dJ] of direction) {
      dI += i;
      dJ += j;

      if (
        dI >= 0 &&
        dI < m &&
        dJ >= 0 &&
        dJ < n &&
        !(dI === parentI && dJ === parentJ)
      ) {
        if (dfs(dI, dJ, i, j, char)) return true;
      }
    }

    return false;
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 已经遍历过, 不做处理
      if (flags[i][j]) continue;

      if (dfs(i, j)) return true;
    }
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// [["a","a","a","a"],["a","b","b","a"],["a","b","b","a"],["a","a","a","a"]]\n
// @lcpr case=end

// @lcpr case=start
// [["c","c","c","a"],["c","d","c","c"],["c","c","e","c"],["f","c","c","c"]]\n
// @lcpr case=end

// @lcpr case=start
// [["a","b","b"],["b","z","b"],["b","b","a"]]\n
// @lcpr case=end

 */
