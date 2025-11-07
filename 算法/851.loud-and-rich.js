/*
 * @lc app=leetcode.cn id=851 lang=javascript
 * @lcpr version=30204
 *
 * [851] 喧闹和富有
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} richer
 * @param {number[]} quiet
 * @return {number[]}
 */
var loudAndRich = function (richer, quiet) {
  /**
   * 拓扑排序, 在减去入度的时候还需要同时更新一下最低的安静值
   */
  let inDegree = Array(quiet.length).fill(0), // 入度数
    adj = Array.from({ length: quiet.length }, () => []), // 邻接表
    ans = Array.from({ length: quiet.length }, (item, i) => i);

  for (const [n1, n2] of richer) {
    inDegree[n2]++;
    adj[n1].push(n2);
  }

  // 入度为 0 的进入队列 --> 入度为 0 表示自己就是最有钱的, 那么安静值就是自身最小
  let queue = [];
  for (let i = 0; i < inDegree.length; i++) {
    inDegree[i] === 0 && queue.push(i);
  }

  while (queue.length) {
    let cur = queue.shift();

    // 对于所有邻接的顶点, 更新一下安静值
    for (const i of adj[cur]) {
      if (quiet[ans[i]] > quiet[ans[cur]]) {
        ans[i] = ans[cur];
      }

      inDegree[i]--;

      if (inDegree[i] === 0) {
        queue.push(i);
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,0],[2,1],[3,1],[3,7],[4,3],[5,3],[6,3]]\n[3,2,5,4,6,1,7,0]\n
// @lcpr case=end

// @lcpr case=start
// []\n[0]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = loudAndRich;
// @lcpr-after-debug-end
