/*
 * @lc app=leetcode.cn id=1376 lang=javascript
 * @lcpr version=30204
 *
 * [1376] 通知所有员工所需的时间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number} headID
 * @param {number[]} manager
 * @param {number[]} informTime
 * @return {number}
 */
var numOfMinutes = function (n, headID, manager, informTime) {
  /** @type {number[][]} 存储着树结构, 对应下属 */
  let tree = Array.from({ length: n }, () => []);
  for (let i = 0; i < manager.length; i++) {
    if (manager[i] !== -1) {
      tree[manager[i]].push(i);
    }
  }

  // 求出最大值
  let max = 0,
    paths = 0;
  function dfs(i) {
    // 没有了下属
    if (!tree[i].length) {
      max = Math.max(max, paths);
      return;
    }

    // 增加当前传递时间
    paths += informTime[i];
    for (const j of tree[i]) {
      dfs(j);
    }

    paths -= informTime[i];
  }

  dfs(headID);

  return max;
};
// @lc code=end

/*
// @lcpr case=start
// 1\n0\n[-1]\n[0]\n
// @lcpr case=end

// @lcpr case=start
// 6\n2\n[2,2,-1,2,2,2]\n[0,0,1,0,0,0]\n
// @lcpr case=end

 */
