/*
 * @lc app=leetcode.cn id=210 lang=javascript
 * @lcpr version=30204
 *
 * [210] 课程表 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
var findOrder = function (numCourses, prerequisites) {
  /**
   * 拓扑排序
   */
  let inDegree = Array(numCourses).fill(0), // 入度数
    adj = Array.from({ length: numCourses }, () => []), // 邻接表
    ans = [];

  for (const [n, n1] of prerequisites) {
    inDegree[n]++;
    adj[n1].push(n);
  }

  // 记录下入度为0的顶点
  let queue = [];
  for (let i = 0; i < inDegree.length; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  while (queue.length) {
    let cur = queue.pop();
    ans.push(cur);

    for (const i of adj[cur]) {
      // 顶点入度减一
      inDegree[i]--;

      // 如果入度数为0, 追加进队列
      if (inDegree[i] === 0) {
        queue.unshift(i);
      }
    }
  }

  return ans.length === numCourses ? ans : [];
};
// @lc code=end

/*
// @lcpr case=start
// 2\n[[1,0]]\n
// @lcpr case=end

// @lcpr case=start
// 4\n[[1,0],[2,0],[3,1],[3,2]]\n
// @lcpr case=end

// @lcpr case=start
// 1\n[]\n
// @lcpr case=end

 */
