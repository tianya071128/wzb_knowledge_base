/*
 * @lc app=leetcode.cn id=79 lang=typescript
 * @lcpr version=30204
 *
 * [79] 单词搜索
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function exist(board: string[][], word: string): boolean {
  // 回溯
  let ans = false,
    m = board.length,
    n = board[0].length,
    path: number[] = []; // 已经走过的路径

  /**
   *
   * @param current 当前在矩阵中的索引
   * @param compare 在 words 中的比较索引
   */
  function dfs(current: number, compare: number) {
    // 将 current 转换为行和列的索引
    const rowIndex = Math.floor(current / n);
    const columnIndex = current % n;

    // 剪枝, 当前位置不相同时
    if (word[compare] !== board[rowIndex][columnIndex]) return;

    // 结束回溯, 找到
    if (compare === word.length - 1) return (ans = true);

    // 继续下一个字母的比对
    // 从当前位置的上下左右查找 - 排除掉已经走过的以及超出边界的
    let next: number[] = [],
      i = 0;
    // 上
    if (rowIndex > 0 && !path.includes((i = (rowIndex - 1) * n + columnIndex)))
      next.push(i);
    // 下
    if (
      rowIndex + 1 < m &&
      !path.includes((i = (rowIndex + 1) * n + columnIndex))
    )
      next.push(i);
    // 左
    if (columnIndex > 0 && !path.includes((i = columnIndex - 1 + rowIndex * n)))
      next.push(i);
    // 右
    if (
      columnIndex + 1 < n &&
      !path.includes((i = columnIndex + 1 + rowIndex * n))
    )
      next.push(i);

    for (const item of next) {
      path.push(item);
      dfs(item, compare + 1);
      path.pop();
      // 如果已经确定, 直接结束
      if (ans) return;
    }
  }

  // 从每个节点中为起点开始查找
  for (let index = 0; index < m * n; index++) {
    path.push(index);
    dfs(index, 0);
    path.pop();
    if (ans) return ans;
  }

  return ans;
}
// @lc code=end
/*
// @lcpr case=start
// [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCCED"\n
// @lcpr case=end

// @lcpr case=start
// [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"SEE"\n
// @lcpr case=end

// @lcpr case=start
// [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCB"\n
// @lcpr case=end

 */
