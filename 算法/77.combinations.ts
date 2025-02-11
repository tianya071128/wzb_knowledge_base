/*
 * @lc app=leetcode.cn id=77 lang=typescript
 * @lcpr version=30204
 *
 * [77] 组合
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function combine(n: number, k: number): number[][] {
  // 回溯
  const res: number[][] = [],
    path: number[] = [];

  function dfs(start: number) {
    // 添加进结果集并剪枝
    if (path.length === k) {
      res.push([...path]);
      return;
    }

    // 剪枝 - 当后续元素不够剩余长度时
    if (n - start + 1 + path.length < k) return;

    for (let index = start; index <= n; index++) {
      path.push(index);
      dfs(index + 1);
      // 回退 - 恢复状态
      path.pop();
    }
  }

  dfs(1);

  return res;
}
// @lc code=end

/*
// @lcpr case=start
// 4\n2\n
// @lcpr case=end

// @lcpr case=start
// 1\n1\n
// @lcpr case=end

 */
